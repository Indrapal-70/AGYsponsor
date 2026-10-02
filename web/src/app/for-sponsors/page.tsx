'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PageShell,
  SectionHeader,
  TechnicalEyebrow,
  TerminalSurface,
  StatusIndicator,
  MetricDisplay,
  MotionWrapper,
} from '@/components/primitives';

export default function ForSponsorsPage() {
  const [budgetTier, setBudgetTier] = useState<'starter' | 'growth' | 'scale'>('growth');

  const tierDetails = {
    starter: {
      name: 'Starter Package',
      price: '₹4,999',
      includedExposures: '12,500',
      rate: '₹0.40/exposure',
      support: 'Standard approval (< 12h)',
      rotation: 'Shared Rotation Pool',
    },
    growth: {
      name: 'Growth Package',
      price: '₹14,999',
      includedExposures: '45,000',
      rate: '₹0.33/exposure',
      support: 'Priority review (< 4h)',
      rotation: 'High Priority Weighting',
    },
    scale: {
      name: 'Scale Package',
      price: '₹39,999',
      includedExposures: '140,000',
      rate: '₹0.28/exposure',
      support: 'Dedicated account manager',
      rotation: 'Dominant Category Exclusivity',
    },
  };

  const selectedTier = tierDetails[budgetTier];

  return (
    <PageShell maxWidth="7xl">
      {/* Header Section */}
      <MotionWrapper>
        <SectionHeader
          eyebrow="Developer Attention & Acquisition"
          title="Reach Active AI Engineers in Deep Flow State"
          subtitle="Place your cloud infrastructure, developer tool, SDK, or database directly in front of software engineers while their Antigravity autonomous agents execute tasks."
        />
      </MotionWrapper>

      {/* 3 Value Pillars */}
      <MotionWrapper delay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <MetricDisplay
            label="Attention Quality"
            value="100% Terminal Focus"
            subtext="Engineers actively watch the status line while their agent is writing code. Zero banner blindness or ad-blocker drop-off."
            badge="Zero Blindness"
          />
          <MetricDisplay
            label="Verification Rule"
            value="≥ 5.0s Active Dwell"
            subtext="Billed strictly when agent compute sustains for at least 5 seconds, validated by server-signed cryptographic HMAC tokens."
            variant="emerald"
            badge="Anti-Fraud"
          />
          <MetricDisplay
            label="Reporting Precision"
            value="Real-Time Telemetry"
            subtext="Track impressions, dwell duration percentiles, unique workstations, and link click-throughs directly in your portal."
            badge="Verified"
          />
        </div>
      </MotionWrapper>

      {/* Interactive Terminal Creative Preview */}
      <MotionWrapper delay={0.25}>
        <div className="mb-20">
          <SectionHeader
            eyebrow="Terminal Placement Preview"
            title="How Your Sponsored Line Appears in the CLI"
            subtitle="Renders cleanly in the secondary status line below built-in tips with native Antigravity CLI typography."
            align="left"
          />

          <TerminalSurface
            title="Antigravity CLI · Developer Terminal View"
            statusText="live campaign rotation"
          >
            <div className="space-y-4">
              <div className="flex items-start space-x-2 text-zinc-300 font-mono text-xs">
                <span className="text-emerald-400 font-bold shrink-0">dev@workstation</span>
                <span className="text-zinc-600 font-bold">:</span>
                <span className="text-blue-400 shrink-0">~/saas-backend</span>
                <span className="text-zinc-400">$</span>
                <span className="text-zinc-100 font-semibold">
                  agy "Benchmark vector database retrieval latency across 1M embedding chunks"
                </span>
              </div>

              <div className="pl-4 border-l border-zinc-800/80 space-y-1.5 text-zinc-400 text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-600">›</span>
                  <span>Executing pinecone_query with HNSW cosine similarity index...</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-600">›</span>
                  <span>Dwell time elapsed: 7.2s (HMAC Token Signed)</span>
                </div>
              </div>

              {/* Status Line Preview */}
              <div className="mt-4 rounded-xl border border-zinc-800 bg-black/80 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-zinc-300 text-xs pb-2 border-b border-zinc-800/60">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-emerald-400 font-bold">●</span>
                    <span className="font-semibold text-zinc-200">Tool Execution: pinecone_query (7.2s)</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-400 truncate">Tips: Type /plan for query optimization</span>
                  </div>
                  <span className="text-zinc-600 text-[10px] uppercase font-sans">Row 1: Built-in</span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-400">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider shrink-0">
                      Sponsored
                    </span>
                    <span className="font-semibold text-white">YourBrand AI</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-300 truncate">Ultra-fast serverless vectors with zero cold starts →</span>
                  </div>
                  <span className="text-emerald-400/80 text-[10px] uppercase font-sans">Row 2: Plugin</span>
                </div>
              </div>
            </div>
          </TerminalSurface>
        </div>
      </MotionWrapper>

      {/* Campaign Tier Simulator */}
      <MotionWrapper delay={0.35}>
        <div className="border-t border-zinc-800/80 pt-16 mb-20">
          <SectionHeader
            eyebrow="Campaign Budget Simulator"
            title="Transparent, High-Volume Campaign Packages"
            subtitle="Fund your ad budget with instant UPI, Cards, or Net Banking checkout. All campaigns undergo administrative safety review."
          />

          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1.5 rounded-xl bg-zinc-900 border border-zinc-800/80 shadow-lg">
              <button
                onClick={() => setBudgetTier('starter')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
                  budgetTier === 'starter'
                    ? 'bg-emerald-500 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Starter (₹4,999)
              </button>
              <button
                onClick={() => setBudgetTier('growth')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
                  budgetTier === 'growth'
                    ? 'bg-emerald-500 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Growth (₹14,999)
              </button>
              <button
                onClick={() => setBudgetTier('scale')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
                  budgetTier === 'scale'
                    ? 'bg-emerald-500 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Scale (₹39,999)
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedTier.name}</h3>
                <div className="text-xs text-zinc-400 mt-1">Direct terminal status line distribution</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-semibold text-emerald-400">{selectedTier.price}</div>
                <div className="text-[11px] font-mono text-zinc-500">Includes complete monthly ad spend</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-zinc-500 uppercase text-[10px]">Included Exposures</div>
                <div className="text-white font-semibold text-sm mt-1">{selectedTier.includedExposures}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-zinc-500 uppercase text-[10px]">Effective Rate</div>
                <div className="text-emerald-400 font-semibold text-sm mt-1">{selectedTier.rate}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-zinc-500 uppercase text-[10px]">Approval SLA</div>
                <div className="text-white font-semibold text-sm mt-1">{selectedTier.support}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-zinc-500 uppercase text-[10px]">Rotation Weight</div>
                <div className="text-emerald-400 font-semibold text-sm mt-1">{selectedTier.rotation}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-zinc-800 gap-4">
              <div className="text-xs text-zinc-400">
                Ready to submit your creative and target active Antigravity developers?
              </div>
              <Link
                href="/pricing"
                className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all shadow-sm"
              >
                Launch Campaign →
              </Link>
            </div>
          </div>
        </div>
      </MotionWrapper>
    </PageShell>
  );
}
