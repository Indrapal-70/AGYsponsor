'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TerminalCta() {
  const [copied, setCopied] = useState(false);
  const command = 'curl -sSL https://agentsponsor.com/install.sh | bash';

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 md:py-36 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto rounded-3xl border border-zinc-800/90 bg-gradient-to-b from-[#111114] to-[#09090b] p-8 sm:p-14 text-center space-y-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] relative">
          {/* Subtle Ambient Emerald Highlight */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full"
            aria-hidden="true"
          />

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
            <span>Ready for Deployment</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-white tracking-[-0.03em] leading-[1.1]">
            Your terminal is already waiting.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-normal">
            Install the verified CLI hook, link your pairing code, and let your autonomous agent sessions generate passive revenue.
          </p>

          {/* Standalone Terminal Command Prompt */}
          <div className="max-w-xl mx-auto p-4 rounded-xl bg-black/90 border border-zinc-800 flex items-center justify-between font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto shadow-inner">
            <div className="flex items-center space-x-2 truncate">
              <span className="text-zinc-500 font-bold">$</span>
              <code className="truncate">{command}</code>
            </div>
            <button
              onClick={handleCopy}
              className="ml-3 shrink-0 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-sans font-medium transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          {/* Action Cluster */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/download"
              className="inline-flex items-center justify-center px-7 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm shadow-[0_0_24px_rgba(16,185,129,0.25)] transition-all active:scale-[0.98]"
            >
              Get Install Command
            </Link>
            <Link
              href="/connect"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-medium text-sm transition-all active:scale-[0.98]"
            >
              Connect Pairing Code
            </Link>
            <Link
              href="/for-sponsors"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-sm font-medium transition-colors"
            >
              For Sponsors →
            </Link>
          </div>

          {/* Footer Metrics */}
          <div className="pt-6 border-t border-zinc-800/60 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-mono text-zinc-400">
            <span>Antigravity CLI 1.2.7 & 2.0</span>
            <span>·</span>
            <span>Fail-Open Sub-2ms</span>
            <span>·</span>
            <span>Direct UPI Withdrawals</span>
          </div>
        </div>
      </div>
    </section>
  );
}
