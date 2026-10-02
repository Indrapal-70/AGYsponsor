'use client';

import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  decay: number;
  hue: number;
  angle: number;
  angularSpeed: number;
}

export default function HeroGasOrb({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Physics & Motion State
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, isInside: false };
    const bubble = {
      x: -1000,
      y: -1000,
      vx: 0,
      vy: 0,
      radius: 56, // Generous volumetric gaseous scale
      alpha: 0,
      targetAlpha: 0,
      smoothHeading: 0,
      smoothStretch: 0,
      time: 0,
    };

    let lastMoveTime = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    const particles: Particle[] = [];
    const MAX_PARTICLES = 80;

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        if (!mouse.isInside) {
          mouse.isInside = true;
          bubble.x = x;
          bubble.y = y;
        }
        mouse.targetX = x;
        mouse.targetY = y;

        const distMoved = Math.hypot(x - lastMouseX, y - lastMouseY);
        if (distMoved > 1.2) {
          lastMoveTime = performance.now();
          bubble.targetAlpha = 0.95;
        }

        lastMouseX = x;
        lastMouseY = y;
      } else {
        mouse.isInside = false;
        bubble.targetAlpha = 0;
      }
    };

    const handleMouseLeave = () => {
      mouse.isInside = false;
      bubble.targetAlpha = 0;
    };

    const createPuff = (x: number, y: number, vx: number, vy: number, speed: number) => {
      if (particles.length >= MAX_PARTICLES) return;

      const spread = 1.0;
      const baseRadius = 22 + Math.min(speed * 2.0, 48);

      // Opposing velocity + calm upward gas drift
      const pVx = -vx * 0.25 + (Math.random() - 0.5) * spread;
      const pVy = -vy * 0.25 + (Math.random() - 0.5) * spread - 0.15;

      particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: pVx,
        vy: pVy,
        radius: baseRadius * 0.5,
        maxRadius: baseRadius * (2.2 + Math.random() * 0.8),
        alpha: 0.4 * bubble.alpha,
        decay: 0.012 + Math.random() * 0.014,
        hue: 155 + Math.random() * 25, // Emerald #10b981 to Cyan-Mint #06b6d4
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.018,
      });
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;
      bubble.time += dt;

      ctx.clearRect(0, 0, width, height);

      // 1. Idle Detection & Lingering Vapor Fade
      const timeSinceMove = now - lastMoveTime;
      const isStill = timeSinceMove > 300 || !mouse.isInside;
      if (isStill) {
        bubble.targetAlpha = 0;
      }

      // Smooth alpha transition
      if (bubble.alpha < bubble.targetAlpha) {
        bubble.alpha = Math.min(bubble.targetAlpha, bubble.alpha + dt * 4.0);
      } else if (bubble.alpha > bubble.targetAlpha) {
        bubble.alpha = Math.max(0, bubble.alpha - dt * 1.4); // Slow lingering vapor dispersion
      }

      // 2. Physics & Inertia Update
      if (mouse.isInside) {
        const dx = mouse.targetX - bubble.x;
        const dy = mouse.targetY - bubble.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 0.5 && isStill) {
          bubble.vx = 0;
          bubble.vy = 0;
          bubble.x = mouse.targetX;
          bubble.y = mouse.targetY;
        } else {
          const spring = 0.11;
          const friction = 0.82;

          bubble.vx = (bubble.vx + dx * spring) * friction;
          bubble.vy = (bubble.vy + dy * spring) * friction;

          bubble.x += bubble.vx;
          bubble.y += bubble.vy;
        }

        const currentSpeed = Math.hypot(bubble.vx, bubble.vy);

        // Smooth angle and stretch transitions without jitter
        if (currentSpeed > 0.8) {
          const targetHeading = Math.atan2(bubble.vy, bubble.vx);
          let angleDiff = targetHeading - bubble.smoothHeading;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          bubble.smoothHeading += angleDiff * Math.min(dt * 10, 1);

          const targetStretch = Math.min(currentSpeed * 0.035, 0.55);
          bubble.smoothStretch += (targetStretch - bubble.smoothStretch) * Math.min(dt * 8, 1);

          // Spawn gas vapor trail puffs when moving
          if (bubble.alpha > 0.08) {
            const spawnCount = Math.min(Math.floor(currentSpeed / 2.0) + 1, 3);
            for (let i = 0; i < spawnCount; i++) {
              createPuff(bubble.x, bubble.y, bubble.vx, bubble.vy, currentSpeed);
            }
          }
        } else {
          bubble.smoothStretch += (0 - bubble.smoothStretch) * Math.min(dt * 6, 1);
        }
      }

      // 3. Render Trail Particles (Diffused Gas Vapor / Smoke Puffs)
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.radius += (p.maxRadius - p.radius) * 0.05;
        p.alpha -= p.decay;
        p.angle += p.angularSpeed;

        if (p.alpha <= 0.005) {
          particles.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `hsla(${p.hue}, 80%, 60%, ${p.alpha * 0.5})`);
        grad.addColorStop(0.4, `hsla(${p.hue}, 70%, 45%, ${p.alpha * 0.25})`);
        grad.addColorStop(1, `hsla(${p.hue + 10}, 60%, 35%, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // 4. Render Pure Volumetric Gas Body (No hard specular ball, 100% soft ethereal vapor)
      if (bubble.alpha > 0.005) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        const calmBreath = Math.sin(bubble.time * 1.8) * 2.5;
        const baseRadius = bubble.radius + calmBreath;

        ctx.translate(bubble.x, bubble.y);
        ctx.rotate(bubble.smoothHeading);
        ctx.scale(1 + bubble.smoothStretch, 1 - bubble.smoothStretch * 0.5);

        // 4a. Outermost Ambient Gas Mist (Reaches ~380px diameter)
        const outerMist = ctx.createRadialGradient(0, 0, 0, 0, 0, baseRadius * 3.4);
        outerMist.addColorStop(0, `rgba(16, 185, 129, ${0.30 * bubble.alpha})`);
        outerMist.addColorStop(0.4, `rgba(6, 182, 212, ${0.15 * bubble.alpha})`);
        outerMist.addColorStop(0.75, `rgba(16, 185, 129, ${0.05 * bubble.alpha})`);
        outerMist.addColorStop(1, 'rgba(16, 185, 129, 0)');

        ctx.fillStyle = outerMist;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 3.4, 0, Math.PI * 2);
        ctx.fill();

        // 4b. Mid Volumetric Gas Cloud Layer
        const midCloud = ctx.createRadialGradient(0, 0, 0, 0, 0, baseRadius * 2.0);
        midCloud.addColorStop(0, `rgba(52, 211, 153, ${0.45 * bubble.alpha})`);
        midCloud.addColorStop(0.45, `rgba(16, 185, 129, ${0.25 * bubble.alpha})`);
        midCloud.addColorStop(0.85, `rgba(5, 150, 105, ${0.08 * bubble.alpha})`);
        midCloud.addColorStop(1, 'rgba(5, 150, 105, 0)');

        ctx.fillStyle = midCloud;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 2.0, 0, Math.PI * 2);
        ctx.fill();

        // 4c. Soft Gaseous Center Mass (Soft diffused green/cyan vapor, completely free of shiny specular dots)
        const innerGas = ctx.createRadialGradient(0, 0, 0, 0, 0, baseRadius * 1.1);
        innerGas.addColorStop(0, `rgba(110, 231, 183, ${0.55 * bubble.alpha})`);
        innerGas.addColorStop(0.5, `rgba(52, 211, 153, ${0.35 * bubble.alpha})`);
        innerGas.addColorStop(1, 'rgba(16, 185, 129, 0)');

        ctx.fillStyle = innerGas;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 1.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
