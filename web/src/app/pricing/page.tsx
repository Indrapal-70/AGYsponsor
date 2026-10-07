'use client';

import React, { useState } from 'react';
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
    price: '₹499',
    period: '/campaign',
    impressions: '1,250',
    budget: '₹499 included ad budget',
    campaigns: '1 Active Campaign',
    creatives: '2 Creatives',
    features: [
      '1,250+ verified 5s developer impressions',
      'Standard status line rotation',
      'Basic impressions & click analytics',
      'Direct developer terminal clicks',
      'Fast approval (< 12h)',
    ],
    highlight: false,
  },
  {
    name: 'Growth Sponsor',
    slug: 'growth',
    price: '₹1,999',
    period: '/campaign',
    impressions: '5,500',
    budget: '₹1,999 included ad budget (+10% bonus)',
    campaigns: '3 Active Campaigns',
    creatives: '6 Creatives',
    features: [
      '5,500+ verified 5s developer impressions',
      'Priority rotation weighting (2x)',
      'Detailed daily conversion breakdown',
      'A/B creative testing support',
      'Priority approval (< 4h)',
    ],
    highlight: true,
  },
  {
    name: 'Pro Scale',
    slug: 'scale',
    price: '₹4,999',
    period: '/campaign',
    impressions: '15,000',
    budget: '₹4,999 included ad budget (+20% bonus)',
    campaigns: '10 Active Campaigns',
    creatives: '20 Creatives',
    features: [
      '15,000+ verified 5s developer impressions',
      'Max priority rotation weighting (4x)',
      'Real-time webhook reporting',
      'Hourly performance telemetry',
      'Dedicated account support',
    ],
    highlight: false,
  },
];

export default function PricingPage() {
  const [customAmount, setCustomAmount] = useState<number>(1000);

  // Calculate dynamic impressions & metrics based on custom budget
  const calculateMetrics = (amount: number) => {
    const validAmount = Math.max(199, isNaN(amount) ? 199 : amount);
    // Unit rate with volume tier discounts
    let unitRate = 0.40;
    if (validAmount >= 5000) unitRate = 0.33;
    else if (validAmount >= 2000) unitRate = 0.36;

    const impressions = Math.floor(validAmount / unitRate);
    const estimatedClicks = Math.floor(impressions * 0.024); // 2.4% avg CTR
    const estimatedReach = Math.floor(impressions * 0.65); // 65% unique workstation ratio

    return {
      impressions,
      estimatedClicks,
      estimatedReach,
      unitRate: unitRate.toFixed(2),
      cpm: (unitRate * 1000).toFixed(0),
    };
  };

  const metrics = calculateMetrics(customAmount);

  return (
    <PageShell maxWidth="7xl">
      {/* Header Section */}
      <MotionWrapper>
        <SectionHeader
          eyebrow="Accessible Developer Marketing"
          title="Affordable Sponsor Packages & Custom Campaigns"
          subtitle="Directly reach verified AI developers in their active flow state. Predictable pay-per-impression pricing with zero bot traffic and instant UPI funding."
        />
      </MotionWrapper>

      {/* 3 Pricing Cards */}
      <MotionWrapper delay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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
                  <TechnicalEyebrow variant="emerald">MOST POPULAR</TechnicalEyebrow>
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
                    ⚡ {plan.impressions} Verified Terminal Impressions
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
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
                  href={`/sponsor?plan=${plan.slug}&budget=${plan.price.replace('₹', '').replace(',', '')}`}
                  className={`w-full block py-3 rounded-lg text-center font-semibold text-xs transition-all active:scale-[0.98] ${
                    plan.highlight
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.25)] font-bold'
                      : 'border border-zinc-700/80 hover:bg-zinc-800 text-zinc-200'
                  }`}
                >
                  Launch {plan.name} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </MotionWrapper>

      {/* CUSTOM BUDGET & IMPRESSION CALCULATOR */}
      <MotionWrapper delay={0.2}>
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#0e0e12] to-[#070709] p-8 sm:p-12 mb-20 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(16,185,129,0.15)]">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
              <span>Custom Campaign Calculator</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
              Calculate Exact Impressions for Any Budget
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Start with as low as <strong className="text-emerald-400">₹199</strong>. Real-time estimate of qualified terminal impressions and developer reach.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Amount Input & Slider */}
            <div className="space-y-4 bg-black/60 p-6 rounded-2xl border border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                  Custom Budget Amount (INR ₹):
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-emerald-400 font-mono">₹</span>
                  <input
                    type="number"
                    min="199"
                    step="100"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                    className="w-36 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono text-base font-bold focus:outline-none focus:border-emerald-500 text-right"
                  />
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="199"
                max="25000"
                step="100"
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
              />

              {/* Quick Preset Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs font-mono">
                <span className="text-zinc-500 text-[11px]">Presets:</span>
                {[299, 499, 999, 1999, 4999, 10000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setCustomAmount(preset)}
                    className={`px-3 py-1 rounded-md transition-all ${
                      customAmount === preset
                        ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                        : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    ₹{preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">Estimated Impressions</span>
                <div className="text-xl font-bold text-emerald-400">
                  ~{metrics.impressions.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-400">≥ 5s verified dwell</div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">Est. Developer Clicks</span>
                <div className="text-xl font-bold text-white">
                  ~{metrics.estimatedClicks.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-400">Avg. 2.4% CTR</div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">Effective Rate</span>
                <div className="text-xl font-bold text-cyan-400">
                  ₹{metrics.unitRate}
                </div>
                <div className="text-[10px] text-zinc-400">₹{metrics.cpm} CPM equivalent</div>
              </div>
            </div>

            {/* Launch Custom Campaign CTA */}
            <div className="pt-2 text-center">
              <Link
                href={`/sponsor?budget=${customAmount}`}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98]"
              >
                Launch Custom Campaign with ₹{customAmount.toLocaleString()} →
              </Link>
            </div>
          </div>
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
    </PageShell>
  );
}
