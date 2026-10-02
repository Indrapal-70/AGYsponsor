'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AudienceSplit() {
  const [activeTab, setActiveTab] = useState<'developers' | 'sponsors'>('developers');

  return (
    <section className="py-16 md:py-24 bg-[#09090b] border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Two-Sided Platform</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
            Designed for Autonomous Builders. Scaled for Tool Sponsors.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Whether you are writing code with Antigravity agents or marketing developer tools to active engineers, AgentSponsor provides a transparent exchange.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
            <button
              onClick={() => setActiveTab('developers')}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'developers'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              For Antigravity Developers
            </button>
            <button
              onClick={() => setActiveTab('sponsors')}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'sponsors'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              For Developer Tool Sponsors
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'developers' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-zinc-800 bg-[#0c0c0e] space-y-3">
                <div className="text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
                  Monetization
                </div>
                <h3 className="text-base font-semibold text-white">Passive Revenue Stream</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Earn ₹0.20 per qualified exposure while your Antigravity agent is actively planning, searching files, writing code, or running tests.
                </p>
                <div className="pt-2 text-xs font-mono text-zinc-500">
                  Direct UPI transfer at ₹50
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-zinc-800 bg-[#0c0c0e] space-y-3">
                <div className="text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
                  Integration
                </div>
                <h3 className="text-base font-semibold text-white">Native CLI Status Line</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Never injects chat bubbles, popups, or conversation text. Renders cleanly beneath built-in Antigravity tips and hides automatically when idle.
                </p>
                <div className="pt-2 text-xs font-mono text-zinc-500">
                  Antigravity 1.2.7 and 2.0
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-zinc-800 bg-[#0c0c0e] space-y-3">
                <div className="text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
                  Security
                </div>
                <h3 className="text-base font-semibold text-white">Zero Prompt Snooping</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The client plugin never reads or sends your private source code, conversation history, or LLM thinking tokens. Only dwell telemetry is sent.
                </p>
                <div className="pt-2 text-xs font-mono text-zinc-500">
                  Sub-2ms fail-open exit
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-zinc-800 bg-[#0c0c0e] space-y-3">
                <div className="text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
                  Attention
                </div>
                <h3 className="text-base font-semibold text-white">100% Focused Flow State</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Developers watch their terminal status line while the agent writes code. Your concise message captures high-intent attention in their active workflow.
                </p>
                <div className="pt-2 text-xs font-mono text-zinc-500">
                  Zero banner blindness
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-zinc-800 bg-[#0c0c0e] space-y-3">
                <div className="text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
                  Verification
                </div>
                <h3 className="text-base font-semibold text-white">Cryptographic Dwell Billing</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Only pay for qualified sessions exceeding 5 seconds of active agent execution. Backed by HMAC signatures and anti-fraud deduplication.
                </p>
                <div className="pt-2 text-xs font-mono text-zinc-500">
                  Zero bot impressions
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-zinc-800 bg-[#0c0c0e] space-y-3">
                <div className="text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
                  Control
                </div>
                <h3 className="text-base font-semibold text-white">Flexible Budget Management</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Starter, Growth, and Scale plans starting at ₹4,999/month with included ad budget. Submit creative headlines and track live click-through analytics.
                </p>
                <div className="pt-2 text-xs font-mono text-zinc-500">
                  Admin approval within 4h
                </div>
              </div>
            </div>
          )}

          {/* Action Links */}
          <div className="mt-8 text-center">
            {activeTab === 'developers' ? (
              <Link
                href="/for-users"
                className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <span>Read developer monetization guide</span>
                <span>→</span>
              </Link>
            ) : (
              <Link
                href="/for-sponsors"
                className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <span>Explore sponsor packages and portal</span>
                <span>→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
