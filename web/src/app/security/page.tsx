import React from 'react';
import Link from 'next/link';
import {
  PageShell,
  SectionHeader,
  TechnicalEyebrow,
  MetricDisplay,
  MotionWrapper,
} from '@/components/primitives';

export default function SecurityPage() {
  return (
    <PageShell maxWidth="5xl">
      <MotionWrapper>
        <SectionHeader
          eyebrow="Zero-Snoop Guarantee"
          title="Security & Trust Architecture"
          subtitle="Engineered from first principles so your codebase, prompts, reasoning traces, and workstation stay 100% private."
        />
      </MotionWrapper>

      <MotionWrapper delay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <MetricDisplay
            label="Zero Prompt Snooping"
            value="0% Prompts Stored"
            subtext="Zero prompts, conversation trees, or model outputs are ever buffered, captured, or transmitted."
            badge="Verified"
          />
          <MetricDisplay
            label="Fail-Open Benchmark"
            value="< 2.0ms Exit"
            subtext="If the cache is cold or network fails, the plugin exits in under 2ms with zero output and zero tool lag."
            badge="Resilient"
          />
        </div>
      </MotionWrapper>

      <MotionWrapper delay={0.25}>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-7 sm:p-8 space-y-3 shadow-lg">
            <h2 className="text-base font-semibold text-white flex items-center space-x-2">
              <span className="text-emerald-400 font-mono">01.</span>
              <span>Zero Access to Prompts or Source Files</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              The AgentSponsor plugin executes strictly via Antigravity CLI lifecycle event streams and the standard <code>statusLine</code> process command. It receives metadata strictly about whether the agent is active or idle. It has zero capability or permission to parse your workspace files, git trees, model prompts, or reasoning tokens.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-7 sm:p-8 space-y-3 shadow-lg">
            <h2 className="text-base font-semibold text-white flex items-center space-x-2">
              <span className="text-emerald-400 font-mono">02.</span>
              <span>Fail-Open Architecture by Design</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              If the AgentSponsor API is ever unreachable, network requests timeout, or DNS fails, the plugin catches all exceptions and exits with code 0 in under 2ms. It never throws errors in your terminal, never stalls agent tool execution, and never interferes with your workflow.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-7 sm:p-8 space-y-3 shadow-lg">
            <h2 className="text-base font-semibold text-white flex items-center space-x-2">
              <span className="text-emerald-400 font-mono">03.</span>
              <span>Cryptographic HMAC Token Signing</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              To eliminate fake clicks and impression spam, ad exposures are governed by server-signed HMAC-SHA256 tokens. Each qualified exposure requires verified active dwell compute duration (minimum 5.0 seconds) before any reward is credited to the append-only ledger.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-7 sm:p-8 space-y-3 shadow-lg">
            <h2 className="text-base font-semibold text-white flex items-center space-x-2">
              <span className="text-emerald-400 font-mono">04.</span>
              <span>Automated SHA-256 Release Validation</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              All client release bundles are cryptographically verified via automated SHA-256 checksums during installation, ensuring developers run only tamper-proof, lightweight binaries.
            </p>
          </div>
        </div>
      </MotionWrapper>

      <MotionWrapper delay={0.35}>
        <div className="border-t border-zinc-800/80 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-zinc-500 gap-2">
          <span>Security questions or vulnerability reports:</span>
          <Link href="mailto:security@agentsponsor.com" className="text-emerald-400 hover:underline">
            security@agentsponsor.com →
          </Link>
        </div>
      </MotionWrapper>
    </PageShell>
  );
}
