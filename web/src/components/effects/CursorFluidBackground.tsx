'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface FluidNode {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  speed: number;
  phase: number;
}

export default function CursorFluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Detect mobile touch screen and user reduced-motion preference
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Static ambient rendering for reduced motion or touch devices
    if (prefersReducedMotion || isTouchDevice) {
      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        40,
        width * 0.5,
        height * 0.35,
        Math.max(width, height) * 0.55
      );
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.05)');
      gradient.addColorStop(0.5, 'rgba(5, 150, 105, 0.02)');
      gradient.addColorStop(1, 'rgba(9, 9, 11, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      return;
    }

    // High-performance pointer tracking state (outside React render loop)
    const mouse = {
      x: width * 0.5,
      y: height * 0.35,
      targetX: width * 0.5,
      targetY: height * 0.35,
      lastX: width * 0.5,
      lastY: height * 0.35,
      speed: 0,
    };

    // Smooth inertia tracking with GSAP quickTo
    const setMouseX = gsap.quickTo(mouse, 'x', {
      duration: 1.4,
      ease: 'power2.out',
    });
    const setMouseY = gsap.quickTo(mouse, 'y', {
      duration: 1.4,
      ease: 'power2.out',
    });

    // 4 Organic Fluid Nodes with layered emerald hues
    const nodes: FluidNode[] = [
      {
        baseX: width * 0.45,
        baseY: height * 0.32,
        x: width * 0.45,
        y: height * 0.32,
        radius: Math.min(width, height) * 0.48,
        color: '16, 185, 129', // Emerald 500
        alpha: 0.065,
        speed: 0.0011,
        phase: 0,
      },
      {
        baseX: width * 0.55,
        baseY: height * 0.38,
        x: width * 0.55,
        y: height * 0.38,
        radius: Math.min(width, height) * 0.55,
        color: '5, 150, 105', // Emerald 600
        alpha: 0.045,
        speed: 0.0008,
        phase: Math.PI * 0.5,
      },
      {
        baseX: width * 0.38,
        baseY: height * 0.46,
        x: width * 0.38,
        y: height * 0.46,
        radius: Math.min(width, height) * 0.42,
        color: '4, 120, 87', // Emerald 700
        alpha: 0.04,
        speed: 0.0014,
        phase: Math.PI,
      },
      {
        baseX: width * 0.62,
        baseY: height * 0.28,
        x: width * 0.62,
        y: height * 0.28,
        radius: Math.min(width, height) * 0.4,
        color: '6, 78, 59', // Emerald 900
        alpha: 0.055,
        speed: 0.0006,
        phase: Math.PI * 1.5,
      },
    ];

    const handlePointerMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      // Compute cursor delta for dynamic displacement boost
      const dx = e.clientX - mouse.lastX;
      const dy = e.clientY - mouse.lastY;
      mouse.speed = Math.min(Math.sqrt(dx * dx + dy * dy), 70);
      mouse.lastX = e.clientX;
      mouse.lastY = e.clientY;

      // Dispatch to GSAP quickTo
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      nodes[0].baseX = width * 0.45;
      nodes[0].baseY = height * 0.32;
      nodes[0].radius = Math.min(width, height) * 0.48;

      nodes[1].baseX = width * 0.55;
      nodes[1].baseY = height * 0.38;
      nodes[1].radius = Math.min(width, height) * 0.55;

      nodes[2].baseX = width * 0.38;
      nodes[2].baseY = height * 0.46;
      nodes[2].radius = Math.min(width, height) * 0.42;

      nodes[3].baseX = width * 0.62;
      nodes[3].baseY = height * 0.28;
      nodes[3].radius = Math.min(width, height) * 0.4;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    let time = 0;

    // Fluid Render Loop
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Settle mouse velocity smoothly
      mouse.speed *= 0.94;

      const mouseOffsetX = (mouse.x - width * 0.5) * 0.22;
      const mouseOffsetY = (mouse.y - height * 0.35) * 0.22;

      nodes.forEach((node, i) => {
        // Natural harmonic wave motion
        const waveX = Math.sin(time * node.speed + node.phase) * (35 + i * 12);
        const waveY = Math.cos(time * node.speed * 0.85 + node.phase) * (25 + i * 8);

        // Dynamic displacement influenced by velocity
        const speedBoost = 1 + mouse.speed * 0.012;
        const targetX = node.baseX + mouseOffsetX * (0.8 + i * 0.25) + waveX * speedBoost;
        const targetY = node.baseY + mouseOffsetY * (0.8 + i * 0.25) + waveY * speedBoost;

        // Smooth spring follow
        node.x += (targetX - node.x) * 0.045;
        node.y += (targetY - node.y) * 0.045;

        // Radial gradient for each layer
        const grad = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.radius
        );

        grad.addColorStop(0, `rgba(${node.color}, ${node.alpha * 1.25})`);
        grad.addColorStop(0.5, `rgba(${node.color}, ${node.alpha * 0.45})`);
        grad.addColorStop(1, 'rgba(9, 9, 11, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{ isolation: 'isolate' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-90 transition-opacity duration-1000"
      />
      {/* Fine technical matrix grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />
    </div>
  );
}
