'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './client';
import type { User, Session } from '@supabase/supabase-js';

interface SponsorOrg {
  id: string;
  name: string;
  billing_email: string;
  website_url?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  roles: string[];
  isSponsor: boolean;
  isAdmin: boolean;
  isConsumer: boolean;
  sponsorOrg: SponsorOrg | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  roles: [],
  isSponsor: false,
  isAdmin: false,
  isConsumer: false,
  sponsorOrg: null,
  loading: true,
  signOut: async () => {},
  refreshAuth: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [sponsorOrg, setSponsorOrg] = useState<SponsorOrg | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (currentUser: User | null) => {
    if (!currentUser) {
      setRoles([]);
      setSponsorOrg(null);
      return;
    }

    try {
      // 1. Fetch user roles from public.user_roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.id);

      if (!roleError && roleData) {
        const roleList = roleData.map((r: { role: string }) => r.role);
        setRoles(roleList);
      }

      // 2. Fetch sponsor organization membership if user has SPONSOR role
      const { data: memberData, error: memberError } = await supabase
        .from('sponsor_members')
        .select('org_id, role, sponsor_organizations(id, name, billing_email, website_url)')
        .eq('user_id', currentUser.id)
        .limit(1)
        .maybeSingle();

      if (!memberError && memberData && memberData.sponsor_organizations) {
        const orgInfo = memberData.sponsor_organizations as unknown as SponsorOrg;
        setSponsorOrg({
          id: orgInfo.id,
          name: orgInfo.name,
          billing_email: orgInfo.billing_email,
          website_url: orgInfo.website_url,
          role: memberData.role,
        });
      }
    } catch (err) {
      console.error('Failed to fetch user roles or org data:', err);
    }
  };

  const refreshAuth = async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setUser(data.session?.user || null);
    await fetchUserData(data.session?.user || null);
  };

  useEffect(() => {
    let mounted = true;

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        await fetchUserData(session.user);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user || null);
        if (newSession?.user) {
          await fetchUserData(newSession.user);
        } else {
          setRoles([]);
          setSponsorOrg(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRoles([]);
    setSponsorOrg(null);
  };

  const isSponsor = roles.includes('SPONSOR');
  const isAdmin = roles.includes('ADMIN');
  const isConsumer = roles.includes('CONSUMER');

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        roles,
        isSponsor,
        isAdmin,
        isConsumer,
        sponsorOrg,
        loading,
        signOut,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
