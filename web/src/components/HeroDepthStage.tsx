'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const DEMO_TASK_STAGES = [
  {
    cmd: 'agy "Optimize PostgreSQL indexes and verify ledger triggers"',
    log1: 'Analyzing schema execution plans and append-only constraints...',
    log2: 'Evaluating sync_earnings_balances() trigger performance (0.34s)',
    statusRow1: 'Thinking (4.2s)',
    statusTip: 'Tips: Run /plan for architecture reviews',
    hasSponsor: true,
    sponsorName: 'CloudForge',
    sponsorCopy: 'Deploy serverless AI backends with instant cold starts →',
  },
  {
    cmd: 'agy "Run full integration test suite across payment rails"',
    log1: 'Executing default_api:run_command: pytest tests/test_payments.py',
    log2: '12 passed, 0 failed in 1.48s (Dwell qualified ≥ 5.0s)',
    statusRow1: 'Tool Use: run_command (5.8s)',
    statusTip: 'Tips: /goal for overnight test suites',
    hasSponsor: true,
    sponsorName: 'Neon DB',
    sponsorCopy: 'Serverless Postgres with instant branching for agent tests →',
  },
  {
    cmd: 'agy "Generate atomic SQL migration for Supabase ledger"',
    log1: 'Generating SQL trigger sync_earnings_balances() in queries.txt',
    log2: 'Validating append-only constraints and RLS security policies...',
    statusRow1: 'Working (8.4s)',
    statusTip: 'Tips: Type /grill-me to stress-test schema constraints',
    hasSponsor: true,
    sponsorName: 'Prisma ORM',
    sponsorCopy: 'Type-safe database client for autonomous TypeScript agents →',
  },
  {
    cmd: 'agy "Commit migration and synchronize earnings balances"',
    log1: 'Executing atomic balance sync via sync_earnings_balances()',
    log2: '+₹0.20 credited to ledger · Direct UPI payout available',
    statusRow1: 'Working (6.1s)',
    statusTip: 'Tips: View /dashboard for withdrawal history',
    hasSponsor: true,
    sponsorName: 'Supabase',
    sponsorCopy: 'Open-source Postgres with Realtime, Auth, and Storage →',
  },
  {
    cmd: 'agy',
    log1: 'Agent completed task. Ready for next prompt or command.',
    log2: 'Statusline automatically hidden with 0ms disruption.',
    statusRow1: 'Idle',
    statusTip: 'Tips: Press Tab to autocomplete slash commands',
    hasSponsor: false,
    sponsorName: '',
    sponsorCopy: '',
  },
];

export default function HeroDepthStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const typographyRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const statusLineRef = useRef<HTMLDivElement>(null);

  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % DEMO_TASK_STAGES.length);
    }, 3600);
    return () => clearInterval(interval);
  }, []);

  const currentStage = DEMO_TASK_STAGES[stageIndex];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!containerRef.current || !sceneRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Initial Hero Mount Entrance Timeline
      if (!prefersReducedMotion) {
        const mountTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        mountTl
          .fromTo(
            '.hero-pill',
            { opacity: 0, y: -12 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.1 }
          )
          .fromTo(
            '.hero-line-1',
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.8 },
            '-=0.4'
          )
          .fromTo(
            '.hero-line-2',
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.8 },
            '-=0.6'
          )
          .fromTo(
            '.hero-subtext',
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6 },
            '-=0.4'
          )
          .fromTo(
            '.hero-actions',
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5 },
            '-=0.3'
          )
          .fromTo(
            '.hero-trust',
            { opacity: 0 },
            { opacity: 1, duration: 0.6 },
            '-=0.2'
          )
          .fromTo(
            terminalRef.current,
            { opacity: 0, y: 50, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power2.out' },
            '-=0.5'
          );
      }

      // 2. High-Performance 2.5D Cursor Depth Controller (Desktop Non-Reduced-Motion only)
      if (!prefersReducedMotion && !isTouchDevice && sceneRef.current && typographyRef.current && terminalRef.current) {
        // quickTo interpolators for rotation and layered translations
        const setSceneRotX = gsap.quickTo(sceneRef.current, 'rotationX', { duration: 1.2, ease: 'power2.out' });
        const setSceneRotY = gsap.quickTo(sceneRef.current, 'rotationY', { duration: 1.2, ease: 'power2.out' });

        const setTypeX = gsap.quickTo(typographyRef.current, 'x', { duration: 1.1, ease: 'power2.out' });
        const setTypeY = gsap.quickTo(typographyRef.current, 'y', { duration: 1.1, ease: 'power2.out' });

        const setTermX = gsap.quickTo(terminalRef.current, 'x', { duration: 1.4, ease: 'power2.out' });
        const setTermY = gsap.quickTo(terminalRef.current, 'y', { duration: 1.4, ease: 'power2.out' });

        const setStatusX = statusLineRef.current
          ? gsap.quickTo(statusLineRef.current, 'x', { duration: 1.6, ease: 'power2.out' })
          : null;
        const setStatusY = statusLineRef.current
          ? gsap.quickTo(statusLineRef.current, 'y', { duration: 1.6, ease: 'power2.out' })
          : null;

        const handleMouseMove = (e: MouseEvent) => {
          const normX = (e.clientX / window.innerWidth - 0.5) * 2;
          const normY = (e.clientY / window.innerHeight - 0.5) * 2;

          // Subtle angular tilt (Strict limit: max 2.2 deg rotX, 2.8 deg rotY)
          setSceneRotY(normX * 2.5);
          setSceneRotX(-normY * 1.8);

          // Layered parallax rate multipliers
          // Layer 2: Typography (Subtle 0.4x)
          setTypeX(normX * 7);
          setTypeY(normY * 5);

          // Layer 4: Terminal Window (Prominent 1.0x)
          setTermX(normX * 16);
          setTermY(normY * 12);

          // Layer 5: Terminal Secondary Status Line (1.25x micro shift)
          if (setStatusX && setStatusY) {
            setStatusX(normX * 22);
            setStatusY(normY * 16);
          }
        };

        const handleMouseLeave = () => {
          // Gently return to origin when cursor exits window
          setSceneRotX(0);
          setSceneRotY(0);
          setTypeX(0);
          setTypeY(0);
          setTermX(0);
          setTermY(0);
          if (setStatusX && setStatusY) {
            setStatusX(0);
            setStatusY(0);
          }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseleave', handleMouseLeave);
        };
      }

      // 3. Scroll-Driven 2.5D Layer Velocity Progression (Scrubbed ScrollTrigger)
      if (!prefersReducedMotion && typographyRef.current && terminalRef.current) {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });

        // Layer 2: Typography recedes backwards into z-space (0.45x relative scroll velocity)
        scrollTl.to(
          typographyRef.current,
          {
            yPercent: -25,
            opacity: 0.15,
            scale: 0.96,
            ease: 'none',
          },
          0
        );

        // Layer 4: Terminal Centerpiece moves forward into focal point (1.00x velocity)
        scrollTl.to(
          terminalRef.current,
          {
            yPercent: -15,
            scale: 1.03,
            boxShadow: '0 40px 90px rgba(0,0,0,0.95), 0 0 40px rgba(16,185,129,0.06)',
            ease: 'none',
          },
          0
        );

        // Layer 5: Terminal Dual Status Line elevated micro-focus
        if (statusLineRef.current) {
          scrollTl.to(
            statusLineRef.current,
            {
              yPercent: -8,
              borderColor: 'rgba(16,185,129,0.4)',
              ease: 'none',
            },
            0
          );
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full overflow-hidden [perspective:1200px]"
    >
      {/* Shared 2.5D Perspective Scene */}
      <div
        ref={sceneRef}
        className="relative z-10 w-full [transform-style:preserve-3d] will-change-transform"
      >
        {/* Layer 2: Editorial Typography Block (translateZ: 20px) */}
        <section
          ref={typographyRef}
          className="min-h-[75vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-20 pb-12 md:pt-28 md:pb-16 text-center [transform:translateZ(20px)]"
        >
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            {/* Platform Tag */}
            <div className="hero-pill inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-xs font-mono mb-8 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
              <span>Google Antigravity CLI 1.2.7 & 2.0 Native</span>
            </div>

            {/* Editorial Display Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.035em] text-white leading-[1.08] max-w-4xl">
              <span className="hero-line-1 block">
                Your agent is thinking.
              </span>
              <span className="hero-line-2 block text-zinc-300 font-light mt-1">
                Earn while you build.
              </span>
            </h1>

            {/* Editorial Subtext */}
            <p className="hero-subtext mt-7 text-base sm:text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl font-normal">
              Non-intrusive sponsor lines in your CLI status bar. Zero prompt snooping with direct UPI payouts.
            </p>

            {/* High-Intent Conversion Actions */}
            <div className="hero-actions mt-10 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/download"
                className="inline-flex items-center justify-center px-7 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm shadow-[0_0_24px_rgba(16,185,129,0.25)] transition-all active:scale-[0.98]"
              >
                Install CLI Plugin
              </Link>
              <Link
                href="/connect"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-medium text-sm transition-all active:scale-[0.98]"
              >
                Pair Terminal Code
              </Link>
              <Link
                href="/for-sponsors"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-sm font-medium transition-colors"
              >
                For Sponsors →
              </Link>
            </div>

            {/* Technical Trust Strip */}
            <div className="hero-trust mt-12 pt-6 border-t border-zinc-800/60 w-full max-w-2xl flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-mono text-zinc-500">
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400">✓</span>
                <span>Zero-Snoop Guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400">✓</span>
                <span>Fail-Open Sub-2ms</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400">✓</span>
                <span>Direct UPI Rails</span>
              </div>
            </div>
          </div>
        </section>

        {/* Layer 4: Dimensional Terminal Centerpiece (translateZ: 50px) */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 [transform:translateZ(50px)]">
          <div
            ref={terminalRef}
            className="rounded-2xl border border-zinc-800/90 bg-[#0c0c0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_70px_rgba(0,0,0,0.85)] overflow-hidden font-mono text-xs will-change-transform"
          >
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
                <span className={`w-2 h-2 rounded-full ${currentStage.hasSponsor ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`}></span>
                <span className={`font-medium ${currentStage.hasSponsor ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {currentStage.hasSponsor ? 'statusLine active (task running)' : 'idle (statusLine hidden)'}
                </span>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-start space-x-2 text-zinc-300">
                <span className="text-emerald-400 font-bold shrink-0">dev@workstation</span>
                <span className="text-zinc-600 font-bold">:</span>
                <span className="text-blue-400 shrink-0">~/backend</span>
                <span className="text-zinc-400">$</span>
                <span className="text-zinc-100 font-semibold">{currentStage.cmd}</span>
              </div>

              <div className="pl-4 border-l border-zinc-800/80 space-y-1.5 text-zinc-400 text-xs transition-all duration-300">
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-600">›</span>
                  <span>{currentStage.log1}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-600">›</span>
                  <span>{currentStage.log2}</span>
                </div>
              </div>

              {/* Layer 5: Antigravity Dual Status Line (translateZ: 70px) */}
              <div
                ref={statusLineRef}
                className="mt-6 rounded-xl border border-zinc-800 bg-black/75 p-3.5 space-y-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_30px_rgba(0,0,0,0.5)] [transform:translateZ(20px)]"
              >
                {/* Row 1: Built-in status / tips */}
                <div className="flex items-center justify-between text-zinc-300 text-xs pb-2 border-b border-zinc-800/60">
                  <div className="flex items-center space-x-2 truncate">
                    <span className={`font-bold ${currentStage.hasSponsor ? 'text-emerald-400' : 'text-zinc-600'}`}>●</span>
                    <span className="font-semibold text-zinc-200">{currentStage.statusRow1}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-400 truncate">{currentStage.statusTip}</span>
                  </div>
                  <span className="text-zinc-600 text-[10px] uppercase font-sans tracking-wider shrink-0 pl-2">
                    Row 1: Built-in
                  </span>
                </div>

                {/* Row 2: Secondary Sponsored Line (Only appears when task is running) */}
                <div className="min-h-[22px] flex items-center transition-all duration-300">
                  {currentStage.hasSponsor ? (
                    <div className="flex items-center justify-between text-xs pt-0.5 text-emerald-400 w-full">
                      <div className="flex items-center space-x-2 truncate">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider shrink-0">
                          Sponsored
                        </span>
                        <span className="font-semibold text-white shrink-0">{currentStage.sponsorName}</span>
                        <span className="text-zinc-600 shrink-0">·</span>
                        <span className="text-zinc-300 truncate">{currentStage.sponsorCopy}</span>
                      </div>
                      <span className="text-emerald-400/80 text-[10px] uppercase font-sans tracking-wider shrink-0 pl-2">
                        Row 2: Plugin
                      </span>
                    </div>
                  ) : (
                    <div className="text-zinc-600 text-xs italic py-0.5">
                      [AgentSponsor statusLine automatically hidden during idle state]
                    </div>
                  )}
                </div>
              </div>

              {/* Micro Caption */}
              <div className="text-center pt-2 text-[11px] font-mono text-zinc-500">
                Live simulation · Automatically rotates active sponsors during tasks & hides when idle
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
