'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect user reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
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
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-10 min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32 text-center"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Editorial Eyebrow Tag */}
        <div className="hero-pill inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-xs font-mono mb-8 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
          <span>Google Antigravity CLI 1.2.7 & 2.0 Native</span>
        </div>

        {/* Editorial Display Headline (Generous Scale, 2 Lines Desktop) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.035em] text-white leading-[1.08] max-w-4xl">
          <span className="hero-line-1 block">
            Your agent is thinking.
          </span>
          <span className="hero-line-2 block text-zinc-300 font-light mt-1">
            Earn while you build.
          </span>
        </h1>

        {/* Editorial Subtext (Concise, 14 words, no em-dashes) */}
        <p className="hero-subtext mt-7 text-base sm:text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl font-normal">
          Non-intrusive sponsor lines in your CLI status bar. Zero prompt snooping with direct UPI payouts.
        </p>

        {/* High-Intent Conversion CTAs */}
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

        {/* Technical Trust Strip (Authentic Verified Guarantees) */}
        <div className="hero-trust mt-14 pt-6 border-t border-zinc-800/60 w-full max-w-2xl flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-mono text-zinc-500">
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
  );
}
