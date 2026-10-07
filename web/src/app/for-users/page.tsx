'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PageShell,
  SectionHeader,
  TechnicalEyebrow,
  TerminalSurface,
  CodeBlock,
  StatusIndicator,
  MetricDisplay,
  MotionWrapper,
} from '@/components/primitives';

export default function ForUsersPage() {
  const [activeTab, setActiveTab] = useState<'workflow' | 'privacy' | 'payouts'>('workflow');

  return (
    <PageShell maxWidth="7xl">
      {/* Header Section */}
      <MotionWrapper>
        <SectionHeader
          eyebrow="Developer Workflow & Monetization"
          title="Monetize Your Agent Development Flow"
          subtitle="A completely passive revenue stream built into the Antigravity CLI status line. Zero code snooping, fail-open sub-2ms reliability, and direct UPI withdrawals."
        />
      </MotionWrapper>

      {/* Interactive Workflow Tabs */}
      <MotionWrapper delay={0.15}>
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-xl bg-zinc-900 border border-zinc-800/80 shadow-lg">
            <button
              onClick={() => setActiveTab('workflow')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
                activeTab === 'workflow'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              [ 01. WORKFLOW ]
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
                activeTab === 'privacy'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              [ 02. ZERO-SNOOP PRIVACY ]
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
                activeTab === 'payouts'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              [ 03. UPI PAYOUT RAILS ]
            </button>
          </div>
        </div>
      </MotionWrapper>

      {/* Dynamic Tab Panel */}
      <MotionWrapper delay={0.25}>
        {activeTab === 'workflow' && (
          <div className="space-y-8 mb-20">
            <TerminalSurface
              title="Antigravity CLI Dual Status Line Lifecycle"
              statusText="statusLine active"
            >
              <div className="space-y-4">
                <div className="flex items-start space-x-2 text-zinc-300 font-mono text-xs">
                  <span className="text-emerald-400 font-bold shrink-0">dev@workstation</span>
                  <span className="text-zinc-600 font-bold">:</span>
                  <span className="text-blue-400 shrink-0">~/backend</span>
                  <span className="text-zinc-400">$</span>
                  <span className="text-zinc-100 font-semibold">
                    agy "Generate Supabase ledger triggers and sync_earnings_balances() functions"
                  </span>
                </div>

                <div className="pl-4 border-l border-zinc-800/80 space-y-1.5 text-zinc-400 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-zinc-600">›</span>
                    <span>Analyzing schema constraints and append-only trigger mechanics...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-zinc-600">›</span>
                    <span>Active compute dwell: 6.4s (Threshold ≥ 5.0s satisfied)</span>
                  </div>
                </div>

                {/* Status Line Preview */}
                <div className="mt-4 rounded-xl border border-zinc-800 bg-black/80 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-zinc-300 text-xs pb-2 border-b border-zinc-800/60">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-emerald-400 font-bold">●</span>
                      <span className="font-semibold text-zinc-200">Thinking (6.4s)</span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-400 truncate">Tips: Type /plan for architecture review</span>
                    </div>
                    <span className="text-zinc-600 text-[10px] uppercase font-sans">Row 1: Built-in</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-emerald-400">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider shrink-0">
                        Sponsored
                      </span>
                      <span className="font-semibold text-white">Prisma ORM</span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-300 truncate">Type-safe database client for autonomous TypeScript agents →</span>
                    </div>
                    <span className="text-emerald-400/80 text-[10px] uppercase font-sans">Row 2: Plugin</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>Ledger Action: <span className="text-emerald-400 font-semibold">+₹0.20 Credited</span></span>
                  <span>Available Balance: <span className="text-zinc-200 font-semibold">₹124.80</span></span>
                </div>
              </div>
            </TerminalSurface>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricDisplay
                label="Per Qualified Dwell"
                value="₹0.20"
                subtext="Credited atomically into your personal ledger on 5s active dwell."
                variant="emerald"
                badge="Per Session"
              />
              <MetricDisplay
                label="CLI Performance"
                value="< 2.0ms"
                subtext="Zero perceptible latency. Fails open immediately if cache is cold."
                badge="Fail-Open"
              />
              <MetricDisplay
                label="Minimum Withdrawal"
                value="₹50.00"
                subtext="Direct transfer to your Indian UPI VPA ID or verified bank account."
                badge="Instant UPI"
              />
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6 mb-20">
            <div className="p-8 rounded-2xl border border-zinc-800 bg-[#0c0c0e] space-y-6 shadow-xl">
              <div className="flex items-center space-x-2">
                <TechnicalEyebrow variant="emerald">Cryptographic Privacy Invariant</TechnicalEyebrow>
                <StatusIndicator label="100% Private" variant="emerald" pulse />
              </div>
              <h3 className="text-2xl font-semibold text-white tracking-tight">
                Your Source Code Never Leaves Your Machine
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
                The AgentSponsor CLI plugin operates as an isolated telemetry reporter. It only listens to session lifecycle state changes and heartbeat timestamps from Antigravity CLI.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="text-xs font-mono text-emerald-400 font-semibold mb-1">01. Prompts & Queries</div>
                  <div className="text-xs text-zinc-400">Zero user prompts, questions, or instructions are ever captured or logged.</div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="text-xs font-mono text-emerald-400 font-semibold mb-1">02. Project Files & ASTs</div>
                  <div className="text-xs text-zinc-400">Zero workspace file contents, git commits, or directory structures are touched.</div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="text-xs font-mono text-emerald-400 font-semibold mb-1">03. Model Reasoning</div>
                  <div className="text-xs text-zinc-400">Zero model reasoning tokens or internal thought trees are transmitted.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="space-y-6 mb-20">
            <div className="p-8 rounded-2xl border border-zinc-800 bg-[#0c0c0e] space-y-6 shadow-xl">
              <div className="flex items-center space-x-2">
                <TechnicalEyebrow variant="emerald">Direct Payment Rails</TechnicalEyebrow>
                <StatusIndicator label="Instant Settlements" variant="emerald" />
              </div>
              <h3 className="text-2xl font-semibold text-white tracking-tight">
                Seamless Withdrawals to Indian Bank & UPI Accounts
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
                Once your verified balance crosses the ₹50 minimum threshold, request an instant payout directly from your dashboard to any valid Indian UPI VPA (e.g. <code>developer@okhdfcbank</code>) or direct bank transfer.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="text-xs font-mono text-emerald-400 font-semibold">UPI Virtual Payment Address</div>
                  <div className="text-xs text-zinc-400">Google Pay, PhonePe, Paytm, or BHIM UPI IDs supported with sub-60s settlement.</div>
                </div>
                <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="text-xs font-mono text-emerald-400 font-semibold">Direct NEFT/IMPS Bank Rail</div>
                  <div className="text-xs text-zinc-400">Standard Indian bank accounts (Account Number + IFSC) supported for larger batch disbursements.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </MotionWrapper>

      {/* Quickstart Onboarding */}
      <MotionWrapper delay={0.35}>
        <div className="rounded-3xl border border-zinc-800 bg-[#0c0c0e] p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <TechnicalEyebrow>60-Second Installation</TechnicalEyebrow>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
            Install the Verified Hook & Connect Today
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Run the public curl command, copy your 8-character terminal pairing code, and link your installation to your personal earnings dashboard.
          </p>
          <div className="max-w-md mx-auto pt-2">
            <CodeBlock code="curl -sSL https://ag-ysponsor.vercel.app/install.sh | bash" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/download"
              className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all active:scale-[0.98]"
            >
              Installation Options
            </Link>
            <Link
              href="/connect"
              className="px-6 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-medium transition-all"
            >
              Enter Pairing Code →
            </Link>
          </div>
        </div>
      </MotionWrapper>
    </PageShell>
  );
}
