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

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [wantToSponsor, setWantToSponsor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const sponsorParam = searchParams.get('sponsor') === 'true' || searchParams.get('type') === 'sponsor';

  const { refreshAuth } = useAuth();

  // Pre-check wantToSponsor if navigated with sponsor param
  React.useEffect(() => {
    if (sponsorParam) {
      setWantToSponsor(true);
    }
  }, [sponsorParam]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            preferred_role: wantToSponsor ? 'SPONSOR' : 'CONSUMER',
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        // Immediate session active
        await refreshAuth();
        if (wantToSponsor) {
          router.push('/sponsor');
        } else {
          router.push('/dashboard');
        }
      } else {
        // Email confirmation is required by Supabase Auth
        setSuccessMessage(
          'Account created! A confirmation email has been sent. After confirming, sign in to complete onboarding.'
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please check your details.';
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
              <TechnicalEyebrow variant={wantToSponsor ? 'blue' : 'emerald'}>
                {wantToSponsor ? 'Sponsor Account' : 'Developer Registration'}
              </TechnicalEyebrow>
              <h2 className="text-xl font-semibold text-white pt-2">Create AgentSponsor Account</h2>
              <p className="text-xs text-zinc-400">
                {wantToSponsor
                  ? 'Advertise directly to developers in the Antigravity CLI status bar'
                  : 'Monetize agent thinking time with zero prompt snooping'}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono space-y-2 text-center">
                <p className="font-bold">✓ {successMessage}</p>
                <Link
                  href="/login"
                  className="inline-block mt-2 px-4 py-1.5 bg-emerald-500 text-zinc-950 rounded-lg text-xs font-bold"
                >
                  Go to Sign In →
                </Link>
              </div>
            )}

            {!successMessage && (
              <form className="space-y-4" onSubmit={handleSignup}>
                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Full Name / Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full bg-black/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@workstation.io"
                    className="w-full bg-black/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Create Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] font-mono"
                  />
                </div>

                {/* "I want to sponsor" Checkbox Selection */}
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="wantToSponsor"
                    checked={wantToSponsor}
                    onChange={(e) => setWantToSponsor(e.target.checked)}
                    className="mt-0.5 rounded border-zinc-700 bg-black text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                  />
                  <label htmlFor="wantToSponsor" className="text-xs text-zinc-300 leading-relaxed cursor-pointer">
                    <span className="font-semibold text-white block">I want to sponsor developer terminals</span>
                    <span className="text-[11px] text-zinc-400">
                      Enables the Sponsor Portal &amp; campaign creation on initial sign in.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-zinc-950 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] active:scale-[0.98]"
                >
                  {loading ? 'Creating Account...' : 'Create Account →'}
                </button>
              </form>
            )}

            <p className="text-center text-xs font-mono text-zinc-500 pt-2 border-t border-zinc-800/80">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </MotionWrapper>
    </PageShell>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b]" />}>
      <SignupForm />
    </Suspense>
  );
}
