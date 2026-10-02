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

export default function AdvertisersPage() {
  return (
    <PageShell maxWidth="5xl">
      <MotionWrapper>
        <SectionHeader
          eyebrow="Sponsor Organization Portal"
          title="Terminal Advertising Campaigns"
          subtitle="AgentSponsor campaign configuration and dwell impression metrics are managed inside the unified Sponsor Portal."
        />
      </MotionWrapper>

      <MotionWrapper delay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <MetricDisplay
            label="Attention Rule"
            value="100% Focused"
            subtext="Engineers actively watch the status line while agent writes code"
            variant="emerald"
            badge="Zero Blindness"
          />
          <MetricDisplay
            label="Dwell Requirement"
            value="≥ 5.0s Dwell"
            subtext="Cryptographically signed HMAC exposure verification"
            badge="Anti-Fraud"
          />
          <MetricDisplay
            label="Campaign Packages"
            value="From ₹4,999"
            subtext="Prepaid ad budgets with priority rotation tiers"
          />
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-8 text-center space-y-6 shadow-xl">
          <TechnicalEyebrow variant="emerald">Sponsor Console</TechnicalEyebrow>
          <h2 className="text-xl font-semibold text-white">Manage Live Sponsor Campaigns</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Submit new status line ad copy, configure campaign budgets, and inspect real-time dwell analytics from the main sponsor portal.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/sponsor"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] active:scale-[0.98]"
            >
              <span>Access Sponsor Portal</span>
              <span>→</span>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 text-xs font-medium transition-all"
            >
              <span>View Packages</span>
            </Link>
          </div>
        </div>
      </MotionWrapper>
    </PageShell>
  );
}
