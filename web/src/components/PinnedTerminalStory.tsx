'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PhaseData {
  index: string;
  phaseLabel: string;
  prompt: string;
  logs: string[];
  row1Text: string;
  row1Tip: string;
  hasSponsor: boolean;
  sponsorName: string;
  sponsorCopy: string;
  dwellSeconds: number;
  dwellQualified: boolean;
  ledgerAction: string;
  ledgerBalance: string;
}

const PHASES: PhaseData[] = [
  {
    index: '01',
    phaseLabel: '1. Thinking State',
    prompt: 'agy "Refactor auth middleware to support HMAC verification"',
    logs: [
      'Parsing AST for src/middleware/auth.ts',
      'Evaluating token rotation and replay prevention strategies...',
    ],
    row1Text: 'Thinking (3.2s)',
    row1Tip: 'Tips: Run /plan for architecture reviews',
    hasSponsor: true,
    sponsorName: 'CloudForge',
    sponsorCopy: 'Deploy serverless AI backends with instant cold starts →',
    dwellSeconds: 3.2,
    dwellQualified: false,
    ledgerAction: 'Session Active (Dwell < 5s)',
    ledgerBalance: '₹124.60',
  },
  {
    index: '02',
    phaseLabel: '2. Tool Execution',
    prompt: 'agy "Run full integration test suite across payment rails"',
    logs: [
      'Executing default_api:run_command: pytest tests/test_payments.py',
      '12 passed, 0 failed in 1.48s',
    ],
    row1Text: 'Tool Use: run_command (5.4s)',
    row1Tip: 'Tips: /goal to run comprehensive overnight test suites',
    hasSponsor: true,
    sponsorName: 'Neon DB',
    sponsorCopy: 'Serverless Postgres with instant branching for agent tests →',
    dwellSeconds: 5.4,
    dwellQualified: true,
    ledgerAction: 'HMAC_SHA256 Token Signed',
    ledgerBalance: '₹124.60',
  },
  {
    index: '03',
    phaseLabel: '3. Working & Dwell Qualification',
    prompt: 'agy "Generate atomic SQL migration for Supabase ledger balances"',
    logs: [
      'Generating SQL trigger sync_earnings_balances() in queries.txt',
      'Validating append-only constraints and RLS security policies...',
    ],
    row1Text: 'Working (8.2s)',
    row1Tip: 'Tips: Type /grill-me to stress-test your schema constraints',
    hasSponsor: true,
    sponsorName: 'Prisma ORM',
    sponsorCopy: 'Type-safe database client for autonomous TypeScript agents →',
    dwellSeconds: 8.2,
    dwellQualified: true,
    ledgerAction: 'Exposure Qualified (≥ 5s Active)',
    ledgerBalance: '₹124.60',
  },
  {
    index: '04',
    phaseLabel: '4. Immutable Ledger Entry',
    prompt: 'agy "Commit migration and synchronize earnings balances"',
    logs: [
      'Executing atomic balance sync via sync_earnings_balances()',
      'Append-only record created in table earnings_ledger',
    ],
    row1Text: 'Working (9.6s)',
    row1Tip: 'Tips: View /dashboard for withdrawal history',
    hasSponsor: true,
    sponsorName: 'Prisma ORM',
    sponsorCopy: 'Type-safe database client for autonomous TypeScript agents →',
    dwellSeconds: 9.6,
    dwellQualified: true,
    ledgerAction: '+₹0.20 Credited to Ledger',
    ledgerBalance: '₹124.80 (Available)',
  },
  {
    index: '05',
    phaseLabel: '5. Idle State (Automatic Disappearance)',
    prompt: 'agy',
    logs: [
      'Agent completed task. Ready for next instruction or /help.',
    ],
    row1Text: 'Idle',
    row1Tip: 'Tips: Press Tab to autocomplete slash commands',
    hasSponsor: false,
    sponsorName: '',
    sponsorCopy: '',
    dwellSeconds: 0,
    dwellQualified: false,
    ledgerAction: 'Status Line Closed (0ms disruption)',
    ledgerBalance: '₹124.80',
  },
];

export default function PinnedTerminalStory() {
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const terminalCardRef = useRef<HTMLDivElement>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isMobile || !pinSectionRef.current || !pinContainerRef.current) return;

    const ctx = gsap.context(() => {
      // Pinned GSAP ScrollTrigger timeline
      const totalPhases = PHASES.length;

      ScrollTrigger.create({
        trigger: pinSectionRef.current,
        start: 'top top',
        end: `+=${totalPhases * 650}px`,
        pin: pinContainerRef.current,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const phaseIdx = Math.min(
            Math.floor(progress * totalPhases),
            totalPhases - 1
          );
          setCurrentPhaseIndex(phaseIdx);

          // Spatial Exit: As scroll nears the end of the pinned section, terminal recedes into z-space
          if (terminalCardRef.current && progress > 0.82) {
            const exitProgress = (progress - 0.82) / 0.18;
            gsap.to(terminalCardRef.current, {
              scale: 1 - exitProgress * 0.08,
              y: -exitProgress * 40,
              opacity: 1 - exitProgress * 0.4,
              duration: 0.1,
              overwrite: 'auto',
            });
          } else if (terminalCardRef.current) {
            gsap.to(terminalCardRef.current, {
              scale: 1,
              y: 0,
              opacity: 1,
              duration: 0.1,
              overwrite: 'auto',
            });
          }
        },
      });
    }, pinSectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  const activePhase = PHASES[currentPhaseIndex];

  return (
    <section ref={pinSectionRef} className="relative z-10 w-full bg-transparent">
      <div
        ref={pinContainerRef}
        className="min-h-screen flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-xs font-mono mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Scroll-Driven Product Story</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
            How AgentSponsor Monetizes Compute Time
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Scroll down to watch the live lifecycle unfold across active agent execution, 5-second HMAC dwell qualification, and atomic ledger credit.
          </p>
        </div>

        {/* Phase Stepper Pills (Interactive on Mobile & visual indicator on Desktop) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 max-w-4xl mx-auto">
          {PHASES.map((p, idx) => {
            const isCurrent = currentPhaseIndex === idx;
            return (
              <button
                key={p.index}
                onClick={() => setCurrentPhaseIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isCurrent
                    ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-sm'
                    : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <span className="opacity-70 mr-1.5">{p.index}</span>
                <span>{p.phaseLabel}</span>
              </button>
            );
          })}
        </div>

        {/* The Animated Terminal Centerpiece Container with 2.5D Physical Depth */}
        <div
          ref={terminalCardRef}
          className="w-full max-w-4xl mx-auto rounded-2xl border border-zinc-800 bg-[#0c0c0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden font-mono text-xs transition-transform will-change-transform"
        >
          {/* Title Bar */}
          <div className="px-4 py-3 bg-[#111114] border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="ml-2 text-zinc-400 text-xs font-sans">
                Antigravity CLI 1.2.7 / 2.0 · ~/workspace/project
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 font-medium">statusLine active</span>
            </div>
          </div>

          {/* Dynamic Content Panel */}
          <div className="p-6 sm:p-8 space-y-4">
            {/* Command */}
            <div className="flex items-start space-x-2 text-zinc-300">
              <span className="text-emerald-400 font-bold shrink-0">dev@workstation</span>
              <span className="text-zinc-600 font-bold">:</span>
              <span className="text-blue-400 shrink-0">~/backend</span>
              <span className="text-zinc-400">$</span>
              <span className="text-zinc-100 font-semibold break-all">{activePhase.prompt}</span>
            </div>

            {/* Logs */}
            <div className="pl-4 border-l border-zinc-800/80 space-y-1.5 text-zinc-400 text-xs transition-opacity duration-300">
              {activePhase.logs.map((log, lIdx) => (
                <div key={lIdx} className="flex items-center space-x-2">
                  <span className="text-zinc-600">›</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            {/* Dual Status Line */}
            <div className="mt-6 rounded-xl border border-zinc-800 bg-black/70 p-3.5 space-y-2">
              {/* Row 1: Built-in status / tips */}
              <div className="flex items-center justify-between text-zinc-300 text-xs pb-2 border-b border-zinc-800/60">
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-emerald-400 font-bold">●</span>
                  <span className="font-semibold text-zinc-200">{activePhase.row1Text}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-400 truncate">{activePhase.row1Tip}</span>
                </div>
                <span className="text-zinc-600 text-[10px] uppercase font-sans tracking-wider shrink-0 pl-2">
                  Row 1: Built-in
                </span>
              </div>

              {/* Row 2: Secondary Status Line */}
              <div className="min-h-[22px] flex items-center transition-all duration-300">
                {activePhase.hasSponsor ? (
                  <div className="flex items-center justify-between text-xs text-emerald-400 w-full">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider shrink-0">
                        Sponsored
                      </span>
                      <span className="font-semibold text-white shrink-0">{activePhase.sponsorName}</span>
                      <span className="text-zinc-600 shrink-0">·</span>
                      <span className="text-zinc-300 truncate">{activePhase.sponsorCopy}</span>
                    </div>
                    <span className="text-emerald-400/80 text-[10px] uppercase font-sans tracking-wider shrink-0 pl-2">
                      Row 2: Plugin
                    </span>
                  </div>
                ) : (
                  <div className="text-zinc-600 text-xs italic">
                    [AgentSponsor statusLine automatically hidden during idle state]
                  </div>
                )}
              </div>
            </div>

            {/* Live Telemetry & Verification Badges */}
            <div className="mt-4 pt-3 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-zinc-900/40 p-2 rounded-lg border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 uppercase">Active Dwell</div>
                <div className={`font-semibold ${activePhase.dwellSeconds >= 5 ? 'text-emerald-400' : 'text-zinc-200'}`}>
                  {activePhase.dwellSeconds > 0 ? `${activePhase.dwellSeconds}s (5s req)` : '0s'}
                </div>
              </div>
              <div className="bg-zinc-900/40 p-2 rounded-lg border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 uppercase">HMAC Integrity</div>
                <div className={`font-semibold ${activePhase.dwellQualified ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  {activePhase.dwellQualified ? 'HMAC_VERIFIED' : 'PENDING_DWELL'}
                </div>
              </div>
              <div className="bg-zinc-900/40 p-2 rounded-lg border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 uppercase">Ledger Action</div>
                <div className="font-semibold text-zinc-200 truncate">{activePhase.ledgerAction}</div>
              </div>
              <div className="bg-zinc-900/40 p-2 rounded-lg border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 uppercase">Ledger Balance</div>
                <div className="font-semibold text-emerald-400">{activePhase.ledgerBalance}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
