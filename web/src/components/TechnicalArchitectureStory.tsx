'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TechNode {
  id: string;
  stepNumber: string;
  title: string;
  subsystem: string;
  description: string;
  codeSnippet: string;
  metric: string;
}

const NODES: TechNode[] = [
  {
    id: 'node-1',
    stepNumber: '01',
    title: 'Antigravity CLI Agent State Detection',
    subsystem: 'plugin/scripts/statusline.js',
    description:
      'The lightweight client plugin receives agent state payloads from the Antigravity CLI runtime via stdin. It triggers exclusively during active states (working, thinking, tool_use) and remains completely silent when idle.',
    codeSnippet: 'stdin { "agent_state": "working", "session_id": "9f8b2c41..." }',
    metric: 'Zero CLI disruption · Pure event dispatch',
  },
  {
    id: 'node-2',
    stepNumber: '02',
    title: 'Native Status Line Rendering & Sub-2ms Fail-Open',
    subsystem: 'Antigravity statusLine API',
    description:
      'Using the official stack_with_default: true configuration, the sponsor creative renders on a dedicated secondary line below built-in tips. If the local cache is empty or the backend is offline, the process exits in under 2ms with zero output.',
    codeSnippet: 'statusLine { "stack_with_default": true, "timeout_ms": 2 }',
    metric: 'Sub-2ms worst-case exit · Never blocks tools',
  },
  {
    id: 'node-3',
    stepNumber: '03',
    title: 'Zero-Snoop Guarantee & Dwell Session Ingestion',
    subsystem: 'Telemetry & Privacy Layer',
    description:
      'The plugin never reads, buffers, or transmits user prompts, project file contents, or model thinking logs. Only anonymous heartbeat timestamps tracking active dwell time are reported to the platform.',
    codeSnippet: 'POST /v1/exposures { "installation_uuid": "...", "dwell_ms": 5820 }',
    metric: 'Zero prompt snooping · 100% private source code',
  },
  {
    id: 'node-4',
    stepNumber: '04',
    title: '5-Second Dwell Qualification & HMAC Token Signing',
    subsystem: 'Cryptographic Verification Engine',
    description:
      'An exposure is only qualified when active agent execution sustains for a minimum of 5.0 seconds. The server validates dwell integrity, checks deduplication windows, and issues a cryptographically signed HMAC-SHA256 verification token.',
    codeSnippet: 'HMAC_SHA256(secret, installation_uuid + dwell_seconds + timestamp)',
    metric: '5.0s minimum active dwell · Anti-fraud verified',
  },
  {
    id: 'node-5',
    stepNumber: '05',
    title: 'Append-Only Financial Ledger & Balance Synchronization',
    subsystem: 'Supabase PostgreSQL Database Engine',
    description:
      'The verified transaction is committed into the append-only earnings_ledger table. An atomic database trigger, sync_earnings_balances(), increments the developer available balance by ₹0.20 and deducts from the sponsor campaign budget.',
    codeSnippet: 'TRIGGER sync_earnings_balances() ON INSERT earnings_ledger',
    metric: '₹0.20 per verified exposure · Atomic ledger consistency',
  },
  {
    id: 'node-6',
    stepNumber: '06',
    title: 'Direct Indian Payment & Withdrawal Rails',
    subsystem: 'UPI & Banking Integration',
    description:
      'Developers request payouts directly to their Indian UPI ID (VPA) or bank account once their accrued balance exceeds the ₹50 threshold. Sponsors fund campaigns with seamless checkout via UPI, Net Banking, and Cards.',
    codeSnippet: 'POST /api/v1/payouts/claim { "upi_id": "developer@bank", "amount": 100 }',
    metric: '₹50 payout threshold · Instant UPI transfer',
  },
];

export default function TechnicalArchitectureStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Create ScrollTrigger triggers for each card to highlight the active node
      NODES.forEach((node, i) => {
        ScrollTrigger.create({
          trigger: `#${node.id}`,
          start: 'top center+=100',
          end: 'bottom center-=100',
          onEnter: () => setActiveNodeIndex(i),
          onEnterBack: () => setActiveNodeIndex(i),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-xs font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Technical Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
            How the System Works Under the Hood
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            From CLI lifecycle event dispatch to cryptographic dwell verification and atomic ledger settlement.
          </p>
        </div>

        {/* 2-Column Architecture Layout: Left Sticky Pipeline / Right Progression */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          {/* Left Column: Sticky Node Stream with Progressive SVG Line (Desktop) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 space-y-4 p-6 rounded-2xl border border-zinc-800/90 bg-[#0c0c0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.7)]">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                  System Pipeline Stream
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  {activeNodeIndex + 1} / {NODES.length}
                </span>
              </div>

              {/* Progressive SVG Connection Stream */}
              <div className="relative pl-6 space-y-3 font-mono text-xs">
                {/* Background Connecting Rail */}
                <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-zinc-800/80 rounded-full" />
                
                {/* Active Dynamic Progress Fill */}
                <div
                  className="absolute left-[11px] top-3 w-[2px] bg-gradient-to-b from-emerald-500 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{
                    height: `${(activeNodeIndex / (NODES.length - 1)) * 100}%`,
                    boxShadow: '0 0 10px rgba(16,185,129,0.8)',
                  }}
                />

                {NODES.map((n, idx) => {
                  const isActive = activeNodeIndex === idx;
                  const isPassed = activeNodeIndex > idx;
                  return (
                    <div
                      key={n.id}
                      className={`relative p-3 rounded-xl transition-all duration-300 flex items-center justify-between ${
                        isActive
                          ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-semibold shadow-[0_0_20px_rgba(16,185,129,0.12)] [transform:translateX(4px)]'
                          : isPassed
                          ? 'text-zinc-300 bg-zinc-900/30 border border-zinc-800/40'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {/* Node Connection Anchor */}
                      <span
                        className={`absolute -left-[19px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                          isActive
                            ? 'bg-emerald-400 border-[#09090b] shadow-[0_0_10px_rgba(16,185,129,0.9)] scale-110'
                            : isPassed
                            ? 'bg-emerald-600 border-[#09090b]'
                            : 'bg-[#0c0c0e] border-zinc-700'
                        }`}
                      />

                      <div className="flex items-center space-x-2 truncate">
                        <span className="truncate">{n.title.split(' ').slice(0, 3).join(' ')}</span>
                      </div>
                      <span className="text-[10px] opacity-70 ml-2 font-mono shrink-0">{n.stepNumber}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Active Subsystem:</span>
                <span className="text-emerald-400 font-semibold truncate max-w-[170px] text-right">
                  {NODES[activeNodeIndex].subsystem}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Progressive Technical Detail Cards */}
          <div className="lg:col-span-8 space-y-8">
            {NODES.map((node, index) => {
              const isActive = activeNodeIndex === index;
              return (
                  <div
                    key={node.id}
                    id={node.id}
                    className={`p-7 sm:p-8 rounded-2xl border transition-all duration-300 ${
                      isActive
                        ? 'bg-[#0e0e12] border-emerald-500/40 shadow-[inset_0_1px_0_rgba(16,185,129,0.2),0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(16,185,129,0.08)] [transform:translateZ(15px)]'
                        : 'bg-[#0c0c0e] border-zinc-800/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_30px_rgba(0,0,0,0.4)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700/80 text-emerald-400">
                        STAGE {node.stepNumber}
                      </span>
                      <span className="text-xs font-mono text-zinc-500 truncate">
                        {node.subsystem}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-3">
                      {node.title}
                    </h3>

                    <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                      {node.description}
                    </p>

                    {/* Sunken Code Well with Depth Inset */}
                    <div className="p-3.5 rounded-xl bg-black/80 border border-zinc-800/90 shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)] font-mono text-xs text-zinc-300 overflow-x-auto mb-4">
                      <code>{node.codeSnippet}</code>
                    </div>

                    {/* Verified Metric Badge */}
                    <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                      <span>✓</span>
                      <span>{node.metric}</span>
                    </div>
                  </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
