'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroTransitionStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const terminalPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Initial Hero Mount Entrance Timeline
      const mountTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      mountTl
        .fromTo(
          '.hero-pill',
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.1 }
        )
        .fromTo(
          '.hero-line-1',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.4'
        )
        .fromTo(
          '.hero-line-2',
          { opacity: 0, y: 30 },
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
          terminalPreviewRef.current,
          { opacity: 0, y: 40, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power2.out' },
          '-=0.4'
        );

      // 2. Continuous Scrubbed ScrollTrigger Transition: Hero Typography -> Terminal Expansion
      if (heroContentRef.current && terminalPreviewRef.current) {
        gsap.to(heroContentRef.current, {
          y: -50,
          opacity: 0.25,
          scale: 0.96,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'center top',
            scrub: 1,
          },
        });

        gsap.to(terminalPreviewRef.current, {
          y: -20,
          scale: 1.02,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom center',
            scrub: 1.2,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 w-full">
      {/* Editorial Hero Content Block */}
      <section className="min-h-[75vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-20 pb-12 md:pt-28 md:pb-16 text-center">
        <div ref={heroContentRef} className="max-w-4xl mx-auto flex flex-col items-center">
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

          {/* CTAs */}
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

      {/* Terminal Visual Anchor Block (Connecting Hero into Terminal) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div
          ref={terminalPreviewRef}
          className="rounded-2xl border border-zinc-800/90 bg-[#0c0c0e] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden font-mono text-xs"
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
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 font-medium">statusLine API active</span>
            </div>
          </div>

          {/* Terminal Initial State Snapshot */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start space-x-2 text-zinc-300">
              <span className="text-emerald-400 font-bold shrink-0">dev@workstation</span>
              <span className="text-zinc-600 font-bold">:</span>
              <span className="text-blue-400 shrink-0">~/backend</span>
              <span className="text-zinc-400">$</span>
              <span className="text-zinc-100 font-semibold">agy "Optimize PostgreSQL indexes and verify ledger triggers"</span>
            </div>

            <div className="pl-4 border-l border-zinc-800/80 space-y-1.5 text-zinc-400 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-zinc-600">›</span>
                <span>Analyzing schema execution plans and append-only constraints...</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-zinc-600">›</span>
                <span>Evaluating sync_earnings_balances() trigger performance (0.34s)</span>
              </div>
            </div>

            {/* Antigravity Dual Status Line (Visual Centerpiece Preview) */}
            <div className="mt-6 rounded-xl border border-zinc-800 bg-black/70 p-3.5 space-y-2">
              {/* Row 1: Built-in */}
              <div className="flex items-center justify-between text-zinc-300 text-xs pb-2 border-b border-zinc-800/60">
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-emerald-400 font-bold">●</span>
                  <span className="font-semibold text-zinc-200">Thinking (4.2s)</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-400 truncate">Tips: Run /plan for architecture reviews</span>
                </div>
                <span className="text-zinc-600 text-[10px] uppercase font-sans tracking-wider shrink-0 pl-2">
                  Row 1: Built-in
                </span>
              </div>

              {/* Row 2: AgentSponsor Verified Secondary Line */}
              <div className="flex items-center justify-between text-xs pt-1 text-emerald-400">
                <div className="flex items-center space-x-2 truncate">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider shrink-0">
                    Sponsored
                  </span>
                  <span className="font-semibold text-white shrink-0">CloudForge</span>
                  <span className="text-zinc-600 shrink-0">·</span>
                  <span className="text-zinc-300 truncate">Deploy serverless AI backends with instant cold starts →</span>
                </div>
                <span className="text-emerald-400/80 text-[10px] uppercase font-sans tracking-wider shrink-0 pl-2">
                  Row 2: Plugin
                </span>
              </div>
            </div>

            {/* Micro Caption */}
            <div className="text-center pt-2 text-[11px] font-mono text-zinc-500">
              Scroll down to explore the live pinned execution cycle ↓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
