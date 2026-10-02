'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/supabase/auth-context';
import {
  PageShell,
  SectionHeader,
  TechnicalEyebrow,
  StatusIndicator,
  MotionWrapper,
} from '@/components/primitives';

function ConnectForm() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  const { user, loading: authLoading } = useAuth();

  const [code, setCode] = useState(initialCode);
  const [deviceName, setDeviceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; uuid?: string } | null>(null);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode.toUpperCase());
    }
  }, [initialCode]);

  // If checking authentication
  if (authLoading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-10 text-center space-y-3">
        <div className="w-6 h-6 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin mx-auto" />
        <p className="text-xs font-mono text-zinc-500">Checking developer authentication...</p>
      </div>
    );
  }

  // 1. MUST BE SIGNED IN BEFORE PAIRING
  if (!user) {
    return (
      <div className="rounded-2xl border border-zinc-800/90 bg-[#0c0c0e] p-8 sm:p-10 shadow-2xl text-center space-y-6">
        <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400 text-2xl font-mono">
          🔒
        </div>
        <div>
          <TechnicalEyebrow variant="amber">Authentication Required</TechnicalEyebrow>
          <h2 className="text-xl font-semibold text-white mt-2">Sign in to Pair Your Terminal</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
            Your terminal CLI installation must be linked to your personal developer account so all dwell impression earnings are credited to your UPI ledger.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/login?redirect=/connect"
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-xs text-zinc-950 transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] active:scale-[0.98]"
          >
            Sign In to Pair Device →
          </Link>
          <Link
            href="/signup?redirect=/connect"
            className="px-6 py-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-xs font-medium text-zinc-200 transition-colors"
          >
            Create Developer Account
          </Link>
        </div>
      </div>
    );
  }

  // 2. SIGNED IN: PAIRING INTERFACE
  const handlePairing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/v1/installations/pair/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pairing_code: code.trim(),
          installation_id: code.trim(),
          device_name: deviceName.trim() || 'My Workstation CLI',
          user_id: user.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult({
          success: true,
          message: data.message || 'Installation linked successfully!',
          uuid: data.installation_uuid,
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to claim pairing code. Please verify the code and try again.',
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'Network error occurred while connecting.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800/90 bg-[#0c0c0e] p-7 sm:p-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_25px_60px_rgba(0,0,0,0.85)]">
      {result?.success ? (
        <div className="space-y-6 text-center">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-2xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            ✓
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Installation Linked Successfully</h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
              Your Antigravity CLI client is now linked to account <strong className="text-white font-mono">{user.email}</strong>.
            </p>
            {result.uuid && (
              <p className="mt-4 text-xs font-mono text-zinc-400 bg-black/80 py-2 px-3 rounded-lg inline-block border border-zinc-800">
                Installation UUID: <span className="text-emerald-400 font-semibold">{result.uuid}</span>
              </p>
            )}
          </div>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3.5">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 font-semibold text-xs text-zinc-950 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-[0.98]"
            >
              Go to Developer Dashboard →
            </Link>
            <button
              onClick={() => {
                setResult(null);
                setCode('');
              }}
              className="px-6 py-2.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-all"
            >
              Pair Another Machine
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePairing} className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <TechnicalEyebrow variant="emerald">Cryptographic Pairing Protocol</TechnicalEyebrow>
            <div className="text-[11px] font-mono text-zinc-400">
              Account: <span className="text-emerald-400 font-semibold">{user.email}</span>
            </div>
          </div>

          {result?.success === false && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
              {result.message}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Pairing Code or Installation UUID
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. 8F4K-92JD or UUID from ~/.agentsponsor/config.json"
              required
              className="w-full bg-black/90 border border-zinc-700/80 rounded-xl px-4 py-3 font-mono text-center text-lg text-emerald-400 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] transition-colors"
            />
            <p className="text-[11px] text-zinc-500 font-mono mt-2">
              Printed in your terminal when running <code>install.ps1</code> / <code>install.sh</code>, or found in <code>~/.agentsponsor/config.json</code>.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Device Name or Label (Optional)
            </label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="e.g. Main Workstation (Windows 11), MacBook Pro M3"
              className="w-full bg-black/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold py-3 rounded-xl text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-[0.98]"
          >
            {loading ? 'Verifying & Linking...' : 'Connect This Installation →'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ConnectPage() {
  return (
    <PageShell maxWidth="5xl">
      <MotionWrapper>
        <SectionHeader
          eyebrow="Terminal Pairing Protocol"
          title="Connect CLI Installation"
          subtitle="Link your Antigravity client to your personal account to claim impression rewards and track earnings."
        />
      </MotionWrapper>

      <MotionWrapper delay={0.15}>
        <div className="max-w-xl mx-auto space-y-8 mb-16">
          <Suspense
            fallback={
              <div className="text-center text-zinc-500 font-mono text-xs p-8 rounded-2xl border border-zinc-800 bg-[#0c0c0e]">
                Loading pairing interface...
              </div>
            }
          >
            <ConnectForm />
          </Suspense>

          <div className="text-center text-xs font-mono text-zinc-500">
            Haven&apos;t installed the CLI plugin yet?{' '}
            <Link href="/download" className="text-emerald-400 hover:underline">
              View installation command →
            </Link>
          </div>
        </div>
      </MotionWrapper>
    </PageShell>
  );
}
