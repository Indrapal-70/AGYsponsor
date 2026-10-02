'use client';

import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="py-16 md:py-24 bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#111114] to-[#09090b] p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          {/* Subtle glow accent */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full"
            aria-hidden="true"
          />

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Ready to Begin</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-tight">
            Start Monetizing Your Antigravity Agent Sessions
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Install the lightweight CLI hook, connect your terminal code, and watch verified earnings accumulate in your immutable ledger.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/download"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98]"
            >
              Get Install Command
            </Link>
            <Link
              href="/for-sponsors"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-medium text-sm transition-all active:scale-[0.98]"
            >
              Explore Sponsor Portal
            </Link>
          </div>

          <div className="pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-400">
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
