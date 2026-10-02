'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyStatement() {
  return (
    <section className="py-24 md:py-36 bg-transparent relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Snoop Guarantee</span>
          </div>
          <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-widest font-semibold">
            Privacy & Trust Architecture
          </h2>
        </div>

        {/* 3 Stark High-Contrast Statements (Brilliant White Text on Deep Obsidian) */}
        <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12">
          {/* Statement 1 */}
          <div className="p-8 sm:p-10 rounded-2xl border border-zinc-800 bg-[#0c0c0e]/90 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 transition-all hover:border-zinc-700">
            <div className="shrink-0 md:w-64">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white block">
                Nothing in.
              </span>
              <span className="text-xs font-mono text-emerald-400 font-medium tracking-wide uppercase mt-1.5 block">
                Local Isolation
              </span>
            </div>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl font-normal">
              Zero prompts, codebase files, git trees, or LLM reasoning logs are ever read, buffered, or transmitted. The client plugin only reports anonymized active dwell timestamps.
            </p>
          </div>

          {/* Statement 2 */}
          <div className="p-8 sm:p-10 rounded-2xl border border-zinc-800 bg-[#0c0c0e]/90 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 transition-all hover:border-zinc-700">
            <div className="shrink-0 md:w-64">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white block">
                Nothing injected.
              </span>
              <span className="text-xs font-mono text-emerald-400 font-medium tracking-wide uppercase mt-1.5 block">
                Zero Stream Mutation
              </span>
            </div>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl font-normal">
              Sponsored messages appear strictly on the dedicated secondary status line (<code className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-emerald-400 font-mono text-xs">stack_with_default: true</code>). Never pollutes your conversation history or modifies agent output tokens.
            </p>
          </div>

          {/* Statement 3 */}
          <div className="p-8 sm:p-10 rounded-2xl border border-zinc-800 bg-[#0c0c0e]/90 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 transition-all hover:border-zinc-700">
            <div className="shrink-0 md:w-64">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white block">
                Nothing interrupted.
              </span>
              <span className="text-xs font-mono text-emerald-400 font-medium tracking-wide uppercase mt-1.5 block">
                Fail-Open Protocol
              </span>
            </div>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl font-normal">
              Sub-2ms fail-open architecture ensures that if network requests or backends drop, the plugin exits immediately with zero output. Tool execution and agent streaming never pause.
            </p>
          </div>
        </div>

        {/* Verification Strip */}
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center space-x-2 text-emerald-400">
            <span>✓</span>
            <span>Audited Open-Source Client Architecture</span>
          </div>
          <div className="text-zinc-500">
            SHA-256 Verified · 100% Client Isolation
          </div>
        </div>
      </div>
    </section>
  );
}
