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

const PLANS = [
  {
    name: 'Starter Sponsor',
    slug: 'starter',
    price: '₹4,999',
    period: '/month',
    budget: '₹4,000 included ad budget',
    campaigns: '1 Active Campaign',
    creatives: '2 Creatives',
    features: [
      'Standard status line rotation',
      'Basic impressions & click analytics',
      'Target active Antigravity CLI sessions',
      'Email support within 24h',
    ],
    highlight: false,
  },
  {
    name: 'Growth Sponsor',
    slug: 'growth',
    price: '₹14,999',
    period: '/month',
    budget: '₹12,500 included ad budget',
    campaigns: '3 Active Campaigns',
    creatives: '6 Creatives',
    features: [
      'Priority rotation weighting (2x)',
      'Detailed hourly conversion breakdown',
      'A/B creative testing support',
      'Priority campaign approval (< 4h)',
      'Direct Slack/Discord channel',
    ],
    highlight: true,
  },
  {
    name: 'Scale Sponsor',
    slug: 'scale',
    price: '₹39,999',
    period: '/month',
    budget: '₹35,000 included ad budget',
    campaigns: '10 Active Campaigns',
    creatives: '20 Creatives',
    features: [
      'Max priority rotation weighting',
      'Real-time webhook reporting',
      'Custom frequency cap configuration',
      'Dedicated account manager',
      'Co-marketing & newsletter mention',
    ],
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <PageShell maxWidth="7xl">
      {/* Header Section */}
      <MotionWrapper>
        <SectionHeader
          eyebrow="Transparent System Economics"
          title="Sponsor Packages & Campaign Plans"
          subtitle="Directly reach verified AI developers in their active flow state. Predictable pricing with included monthly ad budget and zero bot traffic."
        />
      </MotionWrapper>

      {/* 3 Pricing Cards */}
      <MotionWrapper delay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {PLANS.map((plan) => (
            <div
              key={plan.slug}
              className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.highlight
                  ? 'border border-emerald-500/60 bg-[#0e0e12] shadow-[inset_0_1px_0_rgba(16,185,129,0.2),0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.1)] relative [transform:translateZ(10px)]'
                  : 'border border-zinc-800/90 bg-[#0c0c0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_30px_rgba(0,0,0,0.4)] hover:border-zinc-700'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <TechnicalEyebrow variant="emerald">RECOMMENDED FOR GROWTH</TechnicalEyebrow>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline space-x-1">
                    <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                      {plan.price}
                    </span>
                    <span className="text-zinc-400 text-xs font-mono">{plan.period}</span>
                  </div>
                  <div className="mt-2 text-xs font-mono text-emerald-400 font-medium">
                    {plan.budget}
                  </div>
                </div>

                <div className="border-t border-zinc-800/80 pt-5 space-y-3 text-xs text-zinc-300 font-mono">
                  <div className="flex justify-between py-1 border-b border-zinc-800/40">
                    <span className="text-zinc-500">Active Campaigns:</span>
                    <span className="font-semibold text-white">{plan.campaigns}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/40">
                    <span className="text-zinc-500">Ad Creatives:</span>
                    <span className="font-semibold text-white">{plan.creatives}</span>
                  </div>
                  <div className="pt-3 font-sans">
                    <span className="font-semibold text-zinc-400 uppercase text-[10px] font-mono tracking-wider block mb-2.5">
                      Included Capabilities:
                    </span>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-xs text-zinc-300">
                          <span className="text-emerald-400 shrink-0">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href={`/sponsor?plan=${plan.slug}`}
                  className={`w-full block py-3 rounded-lg text-center font-semibold text-xs transition-all active:scale-[0.98] ${
                    plan.highlight
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                      : 'border border-zinc-700/80 hover:bg-zinc-800 text-zinc-200'
                  }`}
                >
                  Configure {plan.name} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </MotionWrapper>

      {/* Developer Side Financial Economics */}
      <MotionWrapper delay={0.25}>
        <div className="border-t border-zinc-800/80 pt-16 mb-20">
          <SectionHeader
            eyebrow="Developer Economics"
            title="How Developer Earnings Are Calculated"
            subtitle="AgentSponsor operates a clear, verifiable revenue-share model with direct UPI rails."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricDisplay
              label="Accrual Rate"
              value="₹0.20"
              subtext="Credited atomically per verified 5s dwell exposure during active agent compute."
              variant="emerald"
              badge="Per Qualified Session"
            />
            <MetricDisplay
              label="Payout Minimum"
              value="₹50.00"
              subtext="Low withdrawal threshold to ensure fast liquidity for individual developers."
              badge="Threshold"
            />
            <MetricDisplay
              label="Settlement Rail"
              value="Instant UPI"
              subtext="Real-time disbursement to any valid Indian UPI VPA or NEFT/IMPS bank account."
              badge="Zero Fees"
            />
          </div>
        </div>
      </MotionWrapper>

      {/* Enterprise Custom Inquiries */}
      <MotionWrapper delay={0.35}>
        <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg font-semibold text-white">Need a Custom Enterprise Campaign?</h3>
            <p className="text-xs text-zinc-400">
              Custom frequency pacing, dedicated category exclusivity, or corporate PO billing.
            </p>
          </div>
          <Link
            href="mailto:owner@agentsponsor.com?subject=Enterprise%20Sponsorship%20Inquiry"
            className="px-6 py-2.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-xs font-medium text-zinc-200 transition whitespace-nowrap"
          >
            Contact Sales →
          </Link>
        </div>
      </MotionWrapper>
    </PageShell>
  );
}
