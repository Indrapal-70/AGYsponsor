'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, Shield, Zap, TrendingUp, Cpu, Lock, CheckCircle2, DollarSign } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollMotionStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  const [scrollPct, setScrollPct] = useState(0);
  const [activeStage, setActiveStage] = useState('HERO_STAGE');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !stageRef.current) return;

    const cards = [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current].filter(Boolean);

    // Initial Floating Ambient Animation (gentle idle bobbing)
    cards.forEach((card, i) => {
      gsap.to(card, {
        y: `+=${12 + i * 4}`,
        rotationZ: `+=${1.2 - i * 0.8}`,
        duration: 3.5 + i * 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.4,
      });
    });

    // Master Scroll-Driven Spatial Card Orchestration (Hero & Pinned Terminal First Half)
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: '55% top', // Completes within the first half of the page
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          setScrollPct(Math.round(p * 100));

          if (p < 0.35) {
            setActiveStage('HERO_ORBIT');
          } else if (p < 0.75) {
            setActiveStage('TERMINAL_ALIGN');
          } else {
            setActiveStage('STAGE_EXIT');
          }
        },
      },
    });

    // -----------------------------------------------------------------
    // PROGRESSION: Hero Orbit (0.0 -> 0.4) -> Terminal Frame -> Smooth Lateral Slide Out (0.4 -> 1.0)
    // -----------------------------------------------------------------
    scrollTl
      // 1. Initial responsive adjustment during Hero scroll
      .to(
        card1Ref.current,
        {
          x: '-2vw',
          y: '6vh',
          rotationY: 18,
          rotationX: 6,
          scale: 0.98,
          opacity: 1,
          ease: 'power1.out',
        },
        0
      )
      .to(
        card2Ref.current,
        {
          x: '2vw',
          y: '8vh',
          rotationY: -18,
          rotationX: 6,
          scale: 0.98,
          opacity: 1,
          ease: 'power1.out',
        },
        0
      )
      .to(
        card3Ref.current,
        {
          x: '-3vw',
          y: '10vh',
          rotationY: 14,
          scale: 0.95,
          opacity: 0.95,
          ease: 'power1.out',
        },
        0
      )
      .to(
        card4Ref.current,
        {
          x: '3vw',
          y: '12vh',
          rotationY: -14,
          scale: 0.95,
          opacity: 0.95,
          ease: 'power1.out',
        },
        0
      )

      // 2. Smooth Lateral Slide Out as user finishes the first half
      .to(
        card1Ref.current,
        {
          x: '-40vw',
          y: '-10vh',
          rotationY: 40,
          rotationZ: -8,
          scale: 0.8,
          opacity: 0,
          ease: 'power2.inOut',
        },
        0.5
      )
      .to(
        card3Ref.current,
        {
          x: '-45vw',
          y: '20vh',
          rotationY: 40,
          rotationZ: 8,
          scale: 0.75,
          opacity: 0,
          ease: 'power2.inOut',
        },
        0.55
      )
      .to(
        card2Ref.current,
        {
          x: '40vw',
          y: '-8vh',
          rotationY: -40,
          rotationZ: 8,
          scale: 0.8,
          opacity: 0,
          ease: 'power2.inOut',
        },
        0.5
      )
      .to(
        card4Ref.current,
        {
          x: '45vw',
          y: '22vh',
          rotationY: -40,
          rotationZ: -8,
          scale: 0.75,
          opacity: 0,
          ease: 'power2.inOut',
        },
        0.55
      );

    return () => {
      scrollTl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 [perspective:1400px]"
      style={{ isolation: 'isolate' }}
    >
      {/* Crisp Technical Grid Background */}
      <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:48px_48px]" />

      {/* Subtle Top Status HUD */}
      <div className="absolute top-4 left-6 hidden md:flex items-center space-x-3 text-[11px] font-mono tracking-wider text-emerald-500/50">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>MOTION_STAGE // {activeStage}</span>
      </div>

      <div className="absolute top-4 right-6 hidden md:flex items-center space-x-3 text-[11px] font-mono tracking-wider text-zinc-500/60">
        <span>SCROLL_SYNC: {scrollPct.toString().padStart(3, '0')}%</span>
      </div>

      {/* ============================================================ */}
      {/* 3D FLOATING ANIMATED GLASSMORPHIC MOTION GRAPHIC CARDS       */}
      {/* ============================================================ */}

      {/* CARD 1: Live Telemetry Stream */}
      <div
        ref={card1Ref}
        className="hidden lg:block absolute top-[16%] left-[4%] xl:left-[8%] w-[260px] xl:w-[280px] rounded-xl border border-emerald-500/25 bg-zinc-950/80 backdrop-blur-md p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(16,185,129,0.08)] [transform-style:preserve-3d] transition-colors duration-500 will-change-transform"
      >
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-800/80">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-mono font-semibold text-zinc-200">CLI Telemetry</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse">
            LIVE 60FPS
          </span>
        </div>

        <div className="space-y-1.5 font-mono text-[10px]">
          <div className="flex justify-between text-zinc-400">
            <span>Dwell Timer:</span>
            <span className="text-emerald-400 font-semibold">5.4s (Qualified)</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Execution State:</span>
            <span className="text-zinc-200">Tool Use (run_command)</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Latency Overhead:</span>
            <span className="text-cyan-400 font-semibold">&lt; 1.8ms</span>
          </div>
        </div>
      </div>

      {/* CARD 2: Autonomous Sponsor Matching */}
      <div
        ref={card2Ref}
        className="hidden lg:block absolute top-[20%] right-[4%] xl:right-[8%] w-[260px] xl:w-[280px] rounded-xl border border-cyan-500/25 bg-zinc-950/80 backdrop-blur-md p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.08)] [transform-style:preserve-3d] transition-colors duration-500 will-change-transform"
      >
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-800/80">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-mono font-semibold text-zinc-200">Sponsor Matching</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 font-semibold">CPM ₹180.00</span>
        </div>

        <div className="space-y-1.5 font-mono text-[10px]">
          <div className="flex justify-between text-zinc-400">
            <span>Matched Sponsor:</span>
            <span className="text-white font-semibold">CloudForge AI</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Target Context:</span>
            <span className="text-zinc-300">TypeScript / Postgres</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Relevance Score:</span>
            <span className="text-emerald-400 font-semibold">99.4% Match</span>
          </div>
        </div>
      </div>

      {/* CARD 3: Zero-Knowledge Privacy Cryptography */}
      <div
        ref={card3Ref}
        className="hidden lg:block absolute top-[44%] left-[3%] xl:left-[6%] w-[250px] xl:w-[270px] rounded-xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] [transform-style:preserve-3d] transition-colors duration-500 will-change-transform"
      >
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-800/80">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-mono font-semibold text-zinc-200">Zero-Snoop Proof</span>
          </div>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        </div>

        <div className="space-y-1.5 font-mono text-[10px]">
          <div className="flex justify-between text-zinc-400">
            <span>HMAC-SHA256:</span>
            <span className="text-zinc-300">0x8f4c...3e1a</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Prompt Content:</span>
            <span className="text-emerald-400 font-semibold">100% UNREAD (Local)</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Audit Protocol:</span>
            <span className="text-zinc-300">Open-Source Verified</span>
          </div>
        </div>
      </div>

      {/* CARD 4: Instant Settlement & UPI Yield */}
      <div
        ref={card4Ref}
        className="hidden lg:block absolute top-[48%] right-[3%] xl:right-[6%] w-[250px] xl:w-[270px] rounded-xl border border-emerald-500/25 bg-zinc-950/80 backdrop-blur-md p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(16,185,129,0.08)] [transform-style:preserve-3d] transition-colors duration-500 will-change-transform"
      >
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-800/80">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-mono font-semibold text-zinc-200">Instant Settlement</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold">+₹0.20 / dwell</span>
        </div>

        <div className="space-y-1.5 font-mono text-[10px]">
          <div className="flex justify-between text-zinc-400">
            <span>Payout Rail:</span>
            <span className="text-zinc-200">Direct UPI & RazorpayX</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Threshold Minimum:</span>
            <span className="text-emerald-400 font-semibold">₹0.00 (Zero Min)</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Ledger Integrity:</span>
            <span className="text-cyan-400 font-semibold">Append-Only Postgres</span>
          </div>
        </div>
      </div>
    </div>
  );
}
