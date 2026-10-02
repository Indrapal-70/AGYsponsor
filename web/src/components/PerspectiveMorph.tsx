'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PerspectiveMorph() {
  const [perspective, setPerspective] = useState<'developers' | 'sponsors'>('developers');

  return (
    <section className="py-20 md:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-xs font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Two-Sided Perspective</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
            One Unified Engine. Two Strategic Perspectives.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Switch the lens to see how AgentSponsor creates value for engineers writing code and for developer tool companies reaching active builders.
          </p>
        </div>

        {/* Perspective Toggle Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-xl bg-zinc-900 border border-zinc-800/80 shadow-lg">
            <button
              onClick={() => setPerspective('developers')}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold font-mono transition-all duration-300 ${
                perspective === 'developers'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              [ VIEWPOINT: DEVELOPER ]
            </button>
            <button
              onClick={() => setPerspective('sponsors')}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold font-mono transition-all duration-300 ${
                perspective === 'sponsors'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              [ VIEWPOINT: SPONSOR ]
            </button>
          </div>
        </div>

        {/* Dynamic Perspective Content Cards */}
        <div className="max-w-5xl mx-auto">
          {perspective === 'developers' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-300">
              <div className="p-7 rounded-2xl border border-zinc-800 bg-[#0c0c0e] flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                    Monetization
                  </span>
                  <h3 className="text-lg font-semibold text-white">Passive Revenue Stream</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    Earn ₹0.20 per qualified exposure while your Antigravity agent plans, refactors code, or runs tests in the background.
                  </p>
                </div>
                <div className="pt-3 border-t border-zinc-800/80 text-xs font-mono text-zinc-400">
                  Direct UPI transfer at ₹50
                </div>
              </div>

              <div className="p-7 rounded-2xl border border-zinc-800 bg-[#0c0c0e] flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                    CLI Integration
                  </span>
                  <h3 className="text-lg font-semibold text-white">Native Status Line UX</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    Renders cleanly in the secondary status line below native tips and automatically hides when idle. Never pollutes conversation stream.
                  </p>
                </div>
                <div className="pt-3 border-t border-zinc-800/80 text-xs font-mono text-zinc-400">
                  Antigravity 1.2.7 & 2.0 Native
                </div>
              </div>

              <div className="p-7 rounded-2xl border border-zinc-800 bg-[#0c0c0e] flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                    Privacy Guarantee
                  </span>
                  <h3 className="text-lg font-semibold text-white">Zero Prompt Snooping</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    Private code repositories remain 100% private. Only anonymous dwell session timestamps are communicated to the platform.
                  </p>
                </div>
                <div className="pt-3 border-t border-zinc-800/80 text-xs font-mono text-zinc-400">
                  Sub-2ms fail-open exit
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-300">
              <div className="p-7 rounded-2xl border border-zinc-800 bg-[#0c0c0e] flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                    High Intent Attention
                  </span>
                  <h3 className="text-lg font-semibold text-white">Focused Flow State</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    Developers actively watch their terminal status line while the agent writes code. Your message commands 100% focused attention.
                  </p>
                </div>
                <div className="pt-3 border-t border-zinc-800/80 text-xs font-mono text-zinc-400">
                  Zero banner blindness
                </div>
              </div>

              <div className="p-7 rounded-2xl border border-zinc-800 bg-[#0c0c0e] flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                    Cryptographic Dwell
                  </span>
                  <h3 className="text-lg font-semibold text-white">Verified 5s Billing</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    You are billed only for qualified dwell exposures exceeding 5 seconds of active agent execution, backed by HMAC verification.
                  </p>
                </div>
                <div className="pt-3 border-t border-zinc-800/80 text-xs font-mono text-zinc-400">
                  Zero bot traffic or fake clicks
                </div>
              </div>

              <div className="p-7 rounded-2xl border border-zinc-800 bg-[#0c0c0e] flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                    Campaign Controls
                  </span>
                  <h3 className="text-lg font-semibold text-white">Tiered Ad Budgets</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    Starter, Growth, and Scale plans starting from ₹4,999/month with included ad budget and real-time impression analytics.
                  </p>
                </div>
                <div className="pt-3 border-t border-zinc-800/80 text-xs font-mono text-zinc-400">
                  Admin approval within 4 hours
                </div>
              </div>
            </div>
          )}

          {/* Deep Navigation Anchor */}
          <div className="mt-10 text-center">
            {perspective === 'developers' ? (
              <Link
                href="/for-users"
                className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <span>Read complete developer monetization guide</span>
                <span>→</span>
              </Link>
            ) : (
              <Link
                href="/pricing"
                className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <span>View sponsor packages and pricing</span>
                <span>→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
