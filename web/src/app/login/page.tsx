'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/supabase/auth-context';
import {
  PageShell,
  TechnicalEyebrow,
  MotionWrapper,
} from '@/components/primitives';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || searchParams.get('next');
  const { refreshAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        await refreshAuth();
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          // Check role to determine destination
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.session.user.id);

          const roleList = roles?.map((r: { role: string }) => r.role) || [];
          if (roleList.includes('SPONSOR')) {
            router.push('/sponsor');
          } else {
            router.push('/dashboard');
          }
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials. Please verify your email and password.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell maxWidth="5xl">
      <MotionWrapper>
        <div className="min-h-[60vh] flex items-center justify-center py-8">
          <div className="max-w-md w-full space-y-6 bg-[#0c0c0e] border border-zinc-800 p-8 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_25px_60px_rgba(0,0,0,0.85)]">
            <div className="text-center space-y-2">
              <TechnicalEyebrow variant="emerald">Authentication</TechnicalEyebrow>
              <h2 className="text-xl font-semibold text-white pt-2">Sign in to AgentSponsor</h2>
              <p className="text-xs text-zinc-400">Access developer earnings ledger or sponsor campaign management</p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@workstation.io"
                  className="w-full bg-black/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-xs text-zinc-600 font-mono">
                    Secured by Supabase Auth
                  </span>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-zinc-950 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] active:scale-[0.98]"
              >
                {loading ? 'Authenticating...' : 'Sign In →'}
              </button>
            </form>

            <div className="pt-3 border-t border-zinc-800/80 text-center space-y-2 text-xs font-mono">
              <p className="text-zinc-500">
                New to AgentSponsor?{' '}
                <Link href="/signup" className="text-emerald-400 hover:underline">
                  Create an account
                </Link>
              </p>
              <p className="text-zinc-600 text-[11px]">
                Want to sponsor? Sign up and select &quot;I want to sponsor&quot;
              </p>
            </div>
          </div>
        </div>
      </MotionWrapper>
    </PageShell>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b]" />}>
      <LoginForm />
    </Suspense>
  );
}
