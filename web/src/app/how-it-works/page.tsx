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

interface PipelineStep {
  id: string;
  stepNumber: string;
  title: string;
  subsystem: string;
  summary: string;
  payload: string;
  telemetry: {
    dwellRequirement: string;
    tokenSecurity: string;
    latencyImpact: string;
    payoutRate: string;
  };
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'install',
    stepNumber: '01',
    title: 'Zero-Credential Plugin Registration',
    subsystem: 'plugin/scripts/statusline.js',
    summary:
      'The standalone curl/PowerShell script verifies package integrity via SHA-256 and registers the hook at ~/.gemini/config/plugins/agentsponsor. It requires no GitHub tokens, API keys, or repository access.',
    payload: `// Plugin registration manifest\n{\n  "name": "agentsponsor",\n  "statusLine": {\n    "command": "node scripts/statusline.js",\n    "stack_with_default": true,\n    "timeout_ms": 2\n  }\n}`,
    telemetry: {
      dwellRequirement: '0s (Registration only)',
      tokenSecurity: 'Local UUID Generator',
      latencyImpact: '0ms (Static Config)',
      payoutRate: '₹0.00 (Ready)',
    },
  },
  {
    id: 'runtime',
    stepNumber: '02',
    title: 'Agent State Detection & Status Line Stacking',
    subsystem: 'Antigravity CLI Runtime',
    summary:
      'The plugin receives agent lifecycle events from the Antigravity CLI via stdin. When the agent enters active states (thinking, working, tool_use), the secondary sponsor line renders below built-in tips. When idle, it vanishes immediately.',
    payload: `// Incoming CLI stdin payload\n{\n  "agent_state": "thinking",\n  "model": "gemini-1.5-pro",\n  "session_id": "9f8b2c41-4890-4a8e",\n  "execution_seconds": 4.8\n}`,
    telemetry: {
      dwellRequirement: 'Active agent state',
      tokenSecurity: 'HMAC Pre-verification',
      latencyImpact: '< 2.0ms fail-open',
      payoutRate: 'Accruing dwell time',
    },
  },
  {
    id: 'verification',
    stepNumber: '03',
    title: '5-Second Dwell Qualification & HMAC Token Signing',
    subsystem: 'Cryptographic Verification Engine',
    summary:
      'An exposure is only qualified when active agent execution sustains for at least 5.0 continuous seconds. The server validates dwell telemetry against strict deduplication windows and issues a cryptographically signed HMAC-SHA256 token.',
    payload: `// Exposure Qualification Signature\nHMAC_SHA256(\n  secret: "0x98f2a...",\n  payload: "uuid=inst_489&dwell=5.82&ts=1727702800"\n) => "3c8a91f4e72d..."`,
    telemetry: {
      dwellRequirement: '5.0s minimum active dwell',
      tokenSecurity: 'HMAC-SHA256 Server Signature',
      latencyImpact: 'Async background dispatch',
      payoutRate: 'Exposure Qualified',
    },
  },
  {
    id: 'settlement',
    stepNumber: '04',
    title: 'Atomic Database Ledger & Direct UPI Rails',
    subsystem: 'Supabase PostgreSQL Ledger Engine',
    summary:
      'The verified token is inserted into the append-only earnings_ledger table. An atomic trigger sync_earnings_balances() credits ₹0.20 to the developer available balance and deducts from the sponsor campaign. Payouts transfer directly to Indian UPI VPAs at the ₹50 threshold.',
    payload: `// PostgreSQL Database Trigger\nCREATE TRIGGER sync_earnings_balances\nAFTER INSERT ON earnings_ledger\nFOR EACH ROW EXECUTE FUNCTION sync_balance();\n-- Available Balance: ₹124.80`,
    telemetry: {
      dwellRequirement: 'Verified complete',
      tokenSecurity: 'Append-Only Ledger',
      latencyImpact: '0ms (Asynchronous)',
      payoutRate: '₹0.20 credited / ₹50 min UPI',
    },
  },
];

export default function HowItWorksPage() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const activeStep = PIPELINE_STEPS[activeStepIndex];

  return (
    <PageShell maxWidth="7xl">
      {/* Header Section */}
      <MotionWrapper>
        <SectionHeader
          eyebrow="Interactive System Architecture"
          title="How AgentSponsor Monetizes Compute Time"
          subtitle="Explore the four-stage lifecycle connecting Antigravity CLI event hooks, cryptographic 5-second dwell qualification, and atomic ledger settlements."
        />
      </MotionWrapper>

      {/* Interactive System Pipeline Stage */}
      <MotionWrapper delay={0.15}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          {/* Step Selector & Pipeline Stream (Left Column) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider px-1 pb-1">
              Select Architecture Stage
            </div>
            {PIPELINE_STEPS.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-start space-x-4 ${
                    isActive
                      ? 'bg-[#0e0e12] border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.12)] [transform:translateX(6px)]'
                      : 'bg-[#0c0c0e] border-zinc-800/80 hover:border-zinc-700 text-zinc-400'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 border ${
                      isActive
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {step.stepNumber}
                  </div>
                  <div className="space-y-1 truncate">
                    <div
                      className={`text-sm font-semibold truncate ${
                        isActive ? 'text-white' : 'text-zinc-300'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500 truncate">
                      {step.subsystem}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Deep Inspection (Right Column) */}
          <div className="lg:col-span-7 space-y-6">
            <TerminalSurface
              title={`${activeStep.subsystem} · Stage ${activeStep.stepNumber}`}
              statusText="architecture verified"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                  <TechnicalEyebrow variant="emerald">
                    STAGE {activeStep.stepNumber}: {activeStep.title}
                  </TechnicalEyebrow>
                  <StatusIndicator label="Verified" variant="emerald" pulse />
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                  {activeStep.summary}
                </p>

                {/* Sunken Code/Payload Inspection */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Protocol Payload / Trigger Logic
                  </div>
                  <pre className="p-4 rounded-xl bg-black/90 border border-zinc-800/90 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                    <code>{activeStep.payload}</code>
                  </pre>
                </div>

                {/* Real-time Telemetry Verification Grid */}
                <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">Dwell Rule</div>
                    <div className="text-xs font-semibold text-zinc-200 mt-0.5 truncate">
                      {activeStep.telemetry.dwellRequirement}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">Cryptographic Layer</div>
                    <div className="text-xs font-semibold text-emerald-400 mt-0.5 truncate">
                      {activeStep.telemetry.tokenSecurity}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">CLI Latency</div>
                    <div className="text-xs font-semibold text-zinc-200 mt-0.5 truncate">
                      {activeStep.telemetry.latencyImpact}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">Ledger Payout</div>
                    <div className="text-xs font-semibold text-emerald-400 mt-0.5 truncate">
                      {activeStep.telemetry.payoutRate}
                    </div>
                  </div>
                </div>
              </div>
            </TerminalSurface>
          </div>
        </div>
      </MotionWrapper>

      {/* Key Architectural Principles (3 Column Depth Cards) */}
      <MotionWrapper delay={0.3}>
        <div className="border-t border-zinc-800/80 pt-16 mb-20">
          <SectionHeader
            eyebrow="Core Trust Invariants"
            title="Non-Negotiable System Principles"
            subtitle="Built from the ground up for strict privacy, maximum reliability, and frictionless developer experience."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricDisplay
              label="Zero-Snoop Guarantee"
              value="0% Files Transmitted"
              subtext="Codebase contents, user prompts, git histories, and model reasoning logs never leave your workstation."
              badge="Private"
            />
            <MetricDisplay
              label="Reliability Benchmark"
              value="< 2.0ms Fail-Open"
              subtext="If the local ad cache is cold or the server drops, the plugin immediately terminates with zero output and zero tool delays."
              badge="Fail-Open"
            />
            <MetricDisplay
              label="Financial Settlement"
              value="₹0.20 / Exposure"
              subtext="Server-signed HMAC tokens ensure payout qualification is transparently backed by genuine 5s compute dwell."
              variant="emerald"
              badge="UPI Rails"
            />
          </div>
        </div>
      </MotionWrapper>

      {/* Procedural Next Steps CTA */}
      <MotionWrapper delay={0.4}>
        <div className="rounded-3xl border border-zinc-800 bg-[#0c0c0e] p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <TechnicalEyebrow>Next Step</TechnicalEyebrow>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
            Ready to hook your Antigravity CLI?
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Install the verified standalone hook, link your 8-character terminal code, and begin earning while your agents plan and code.
          </p>
          <div className="max-w-md mx-auto pt-2">
            <CodeBlock code="curl -sSL https://agentsponsor.com/install.sh | bash" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/download"
              className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all active:scale-[0.98]"
            >
              View Installation Options
            </Link>
            <Link
              href="/connect"
              className="px-6 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-medium transition-all"
            >
              Pair 8-Character Code →
            </Link>
          </div>
        </div>
      </MotionWrapper>
    </PageShell>
  );
}
