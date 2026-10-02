'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type AgentState = 'thinking' | 'tool_use' | 'working' | 'idle';

interface StateScenario {
  state: AgentState;
  stateLabel: string;
  command: string;
  actionLog: string[];
  row1Status: string;
  row1Tip: string;
  sponsorActive: boolean;
  sponsorBrand: string;
  sponsorHeadline: string;
  dwellTime: number;
  ledgerCredit: string;
}

const SCENARIOS: Record<AgentState, StateScenario> = {
  thinking: {
    state: 'thinking',
    stateLabel: 'Thinking',
    command: 'agy "Refactor auth middleware to support HMAC verification"',
    actionLog: [
      'Parsing AST for src/middleware/auth.ts',
      'Evaluating token rotation and replay prevention strategies...',
    ],
    row1Status: 'Thinking (4.2s)',
    row1Tip: 'Tips: Run /plan for multi-step architecture reviews',
    sponsorActive: true,
    sponsorBrand: 'CloudForge',
    sponsorHeadline: 'Deploy serverless AI backends with instant cold starts →',
    dwellTime: 4.2,
    ledgerCredit: 'Qualifying (5s min)',
  },
  tool_use: {
    state: 'tool_use',
    stateLabel: 'Tool Execution',
    command: 'agy "Run full integration test suite across payment rails"',
    actionLog: [
      'Executing default_api:run_command: pytest tests/test_payments.py',
      '12 passed, 0 failed in 1.48s',
    ],
    row1Status: 'Tool Use: run_command (6.8s)',
    row1Tip: 'Tips: Use /goal to run comprehensive overnight test suites',
    sponsorActive: true,
    sponsorBrand: 'Neon DB',
    sponsorHeadline: 'Serverless Postgres with instant branching for agent tests →',
    dwellTime: 6.8,
    ledgerCredit: '+₹0.20 Verified (HMAC)',
  },
  working: {
    state: 'working',
    stateLabel: 'Writing Code',
    command: 'agy "Generate atomic SQL migration for Supabase ledger balances"',
    actionLog: [
      'Generating SQL trigger sync_earnings_balances() in queries.txt',
      'Validating append-only constraints and RLS security policies...',
    ],
    row1Status: 'Working (8.1s)',
    row1Tip: 'Tips: Type /grill-me to stress-test your schema constraints',
    sponsorActive: true,
    sponsorBrand: 'Prisma ORM',
    sponsorHeadline: 'Type-safe database client for autonomous TypeScript agents →',
    dwellTime: 8.1,
    ledgerCredit: '+₹0.20 Verified (HMAC)',
  },
  idle: {
    state: 'idle',
    stateLabel: 'Idle (Sponsor Hidden)',
    command: 'agy',
    actionLog: [
      'Ready for next prompt. Type your instructions or /help.',
    ],
    row1Status: 'Idle',
    row1Tip: 'Tips: Press Tab to autocomplete slash commands',
    sponsorActive: false,
    sponsorBrand: '',
    sponsorHeadline: '',
    dwellTime: 0,
    ledgerCredit: 'No active session',
  },
};

export default function TerminalShowcase() {
  const [activeState, setActiveState] = useState<AgentState>('working');
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const sponsorRowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS[activeState];

  // Auto-cycle through states if autoplay is enabled
  useEffect(() => {
    if (!autoPlay) return;

    const states: AgentState[] = ['working', 'thinking', 'tool_use', 'idle'];
    const timer = setInterval(() => {
      setActiveState((prev) => {
        const nextIdx = (states.indexOf(prev) + 1) % states.length;
        return states[nextIdx];
      });
    }, 5500);

    return () => clearInterval(timer);
  }, [autoPlay]);

  // GSAP animation for status line row transition
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !sponsorRowRef.current) return;

    const ctx = gsap.context(() => {
      if (scenario.sponsorActive) {
        gsap.fromTo(
          sponsorRowRef.current,
          { opacity: 0, height: 0, y: -4 },
          { opacity: 1, height: 'auto', y: 0, duration: 0.35, ease: 'power2.out' }
        );
      } else {
        gsap.to(sponsorRowRef.current, {
          opacity: 0,
          height: 0,
          duration: 0.25,
          ease: 'power2.in',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [activeState, scenario.sponsorActive]);

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-[#09090b] border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Live Mechanism Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
            How AgentSponsor Renders in Antigravity CLI
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Stacked cleanly underneath native tips using the official secondary status line API. Appears during active execution, hides automatically when idle.
          </p>
        </div>

        {/* Interactive State Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 max-w-4xl mx-auto mb-6 bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            {(Object.keys(SCENARIOS) as AgentState[]).map((stateKey) => {
              const item = SCENARIOS[stateKey];
              const isSelected = activeState === stateKey;
              return (
                <button
                  key={stateKey}
                  onClick={() => {
                    setActiveState(stateKey);
                    setAutoPlay(false); // Pause auto-rotation on user manual click
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  {stateKey === 'idle' ? 'State: idle' : `State: ${stateKey}`}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-3 px-2 text-xs font-mono text-zinc-400">
            <span>Autoplay:</span>
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                autoPlay
                  ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-zinc-800/40 text-zinc-500 border border-zinc-700/50'
              }`}
            >
              {autoPlay ? 'Live Cycling' : 'Paused'}
            </button>
          </div>
        </div>

        {/* Main Terminal Window */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-zinc-800 bg-[#0c0c0e] shadow-2xl overflow-hidden font-mono text-xs">
          {/* Terminal Title Bar */}
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
              <span className="text-emerald-400 font-medium">statusLine API active</span>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 space-y-4">
            {/* Prompt Command */}
            <div className="flex items-start space-x-2 text-zinc-300">
              <span className="text-emerald-400 font-bold shrink-0">dev@workstation</span>
              <span className="text-zinc-600 font-bold">:</span>
              <span className="text-blue-400 shrink-0">~/backend</span>
              <span className="text-zinc-400">$</span>
              <span className="text-zinc-100 font-semibold break-all">{scenario.command}</span>
            </div>

            {/* Agent execution log */}
            <div className="pl-4 border-l border-zinc-800/80 space-y-1.5 text-zinc-400 text-xs">
              {scenario.actionLog.map((log, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-zinc-600">›</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            {/* Antigravity Dual Status Line Container */}
            <div className="mt-8 rounded-xl border border-zinc-800 bg-black/60 p-3.5 space-y-2">
              {/* Row 1: Built-in Antigravity Status Line */}
              <div className="flex items-center justify-between text-zinc-300 text-xs pb-2 border-b border-zinc-800/60">
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-emerald-400 font-bold">●</span>
                  <span className="font-semibold text-zinc-200">{scenario.row1Status}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-400 truncate">{scenario.row1Tip}</span>
                </div>
                <span className="text-zinc-600 text-[10px] uppercase font-sans tracking-wider shrink-0 pl-2">
                  Row 1: Built-in
                </span>
              </div>

              {/* Row 2: AgentSponsor Secondary Status Line (stack_with_default: true) */}
              <div ref={sponsorRowRef} className="overflow-hidden">
                {scenario.sponsorActive ? (
                  <div className="flex items-center justify-between text-xs pt-1 text-emerald-400">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider shrink-0">
                        Sponsored
                      </span>
                      <span className="font-semibold text-white shrink-0">{scenario.sponsorBrand}</span>
                      <span className="text-zinc-600 shrink-0">·</span>
                      <span className="text-zinc-300 truncate">{scenario.sponsorHeadline}</span>
                    </div>
                    <span className="text-emerald-400/80 text-[10px] uppercase font-sans tracking-wider shrink-0 pl-2">
                      Row 2: Plugin
                    </span>
                  </div>
                ) : (
                  <div className="text-zinc-600 text-xs italic py-1">
                    [AgentSponsor statusLine automatically hidden during idle state]
                  </div>
                )}
              </div>
            </div>

            {/* Telemetry & Ledger Qualification Panel */}
            <div className="mt-4 pt-3 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-zinc-900/40 p-2 rounded-lg border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 uppercase">Agent State</div>
                <div className="font-semibold text-zinc-200">{scenario.stateLabel}</div>
              </div>
              <div className="bg-zinc-900/40 p-2 rounded-lg border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 uppercase">Active Dwell</div>
                <div className="font-semibold text-zinc-200">{scenario.dwellTime > 0 ? `${scenario.dwellTime}s (5s req)` : '0s'}</div>
              </div>
              <div className="bg-zinc-900/40 p-2 rounded-lg border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 uppercase">Ledger Reward</div>
                <div className={`font-semibold ${scenario.dwellTime >= 5 ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  {scenario.ledgerCredit}
                </div>
              </div>
              <div className="bg-zinc-900/40 p-2 rounded-lg border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 uppercase">Privacy Guard</div>
                <div className="font-semibold text-emerald-400">Zero-Snoop Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
