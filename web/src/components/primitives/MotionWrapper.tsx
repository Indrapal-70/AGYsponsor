'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface MotionWrapperProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export default function MotionWrapper({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 20,
  className = '',
}: MotionWrapperProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !elRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elRef.current,
        { opacity: 0, y: yOffset },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power2.out',
        }
      );
    }, elRef);

    return () => ctx.revert();
  }, [delay, duration, yOffset]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
}
