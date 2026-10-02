import React from 'react';
import {
  PageShell,
  SectionHeader,
  TechnicalEyebrow,
  MotionWrapper,
} from '@/components/primitives';

export default function PrivacyPolicy() {
  return (
    <PageShell maxWidth="5xl">
      <MotionWrapper>
        <SectionHeader
          eyebrow="Privacy Policy"
          title="Zero-Snoop Privacy Guarantee"
          subtitle="Your code is yours. Your prompts are yours. AgentSponsor is engineered from first principles without compromising developer privacy or codebase security."
        />
      </MotionWrapper>

      <MotionWrapper delay={0.15}>
        <div className="space-y-8 text-zinc-300 text-sm leading-relaxed mb-12">
          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 space-y-4 shadow-lg">
            <TechnicalEyebrow variant="emerald">Strict Data Collection Invariants</TechnicalEyebrow>
            <ul className="space-y-3 pt-2">
              <li className="flex items-start space-x-3">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <div>
                  <strong className="text-white">Zero Prompts Collected:</strong> We never intercept, read, or store the prompts or instructions you send to your AI agents.
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <div>
                  <strong className="text-white">Zero Source Code Collected:</strong> Your source code never leaves your machine. We do not analyze, parse, or transmit workspace files or ASTs.
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <div>
                  <strong className="text-white">Zero Conversation Logs:</strong> We do not log the outputs, responses, or intermediate reasoning steps of your AI agents.
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold text-white">What Telemetry We Do Process</h2>
            <p className="text-zinc-400">To calculate developer earnings and manage campaigns, we collect only the absolute minimum required metadata:</p>
            <ul className="space-y-2 font-mono text-xs text-zinc-300 pl-4 border-l border-zinc-800">
              <li><strong className="text-white font-sans">Installation UUID:</strong> Anonymous identifier generated locally upon plugin registration to attribute ledger rewards.</li>
              <li><strong className="text-white font-sans">Dwell Heartbeat Timestamps:</strong> Anonymous dwell session duration to verify 5.0s active execution threshold.</li>
              <li><strong className="text-white font-sans">Payout VPA:</strong> The Indian UPI ID or Bank account you provide to disburse your accrued balance.</li>
            </ul>
          </div>

          <div className="text-xs font-mono text-zinc-500 pt-4 border-t border-zinc-800/80">
            Last updated: September 2026 · AgentSponsor Platform Privacy Architecture
          </div>
        </div>
      </MotionWrapper>
    </PageShell>
  );
}
