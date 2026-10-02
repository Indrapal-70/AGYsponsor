'use client';

import React from 'react';
import Link from 'next/link';
import {
  PageShell,
  SectionHeader,
  TechnicalEyebrow,
  MetricDisplay,
  MotionWrapper,
} from '@/components/primitives';

export default function EarningsPage() {
  return (
    <PageShell maxWidth="5xl">
      <MotionWrapper>
        <SectionHeader
          eyebrow="Developer Earnings Ledger"
          title="Earnings & Payout Accounting"
          subtitle="AgentSponsor has unified developer balances and paired terminal instances inside the central Consumer Dashboard."
        />
      </MotionWrapper>

      <MotionWrapper delay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <MetricDisplay
            label="Verified Reward Rate"
            value="₹0.20"
            subtext="Per qualified 5.0s active compute dwell session"
            variant="emerald"
            badge="Per Exposure"
          />
          <MetricDisplay
            label="Withdrawal Threshold"
            value="₹50.00"
            subtext="Disbursed directly to Indian UPI VPAs"
            badge="Instant UPI"
          />
          <MetricDisplay
            label="Revenue Share"
            value="70% Developer"
            subtext="Direct developer share of gross campaign budgets"
          />
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-8 text-center space-y-6 shadow-xl">
          <TechnicalEyebrow variant="emerald">Integrated Console</TechnicalEyebrow>
          <h2 className="text-xl font-semibold text-white">Access Your Live Earnings Ledger</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            View your append-only financial records, update your Indian UPI payout account, and request instant disbursements from your main dashboard.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] active:scale-[0.98]"
            >
              <span>Go to Consumer Dashboard</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </MotionWrapper>
    </PageShell>
  );
}
