import React from 'react';

interface TechnicalEyebrowProps {
  children: React.ReactNode;
  pulse?: boolean;
  variant?: 'emerald' | 'zinc' | 'amber' | 'cyan' | 'rose' | 'blue';
  className?: string;
}

export default function TechnicalEyebrow({
  children,
  pulse = true,
  variant = 'emerald',
  className = '',
}: TechnicalEyebrowProps) {
  const variantStyles = {
    emerald: 'border-emerald-500/25 bg-emerald-500/5 text-emerald-400',
    zinc: 'border-zinc-700/80 bg-zinc-900/60 text-zinc-300',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    rose: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  };

  const dotStyles = {
    emerald: 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]',
    zinc: 'bg-zinc-400 shadow-[0_0_6px_rgba(161,161,170,0.8)]',
    amber: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]',
    cyan: 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]',
    rose: 'bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]',
    blue: 'bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.8)]',
  };

  return (
    <div
      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-mono tracking-wide ${variantStyles[variant]} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]} ${
          pulse ? 'animate-pulse' : ''
        }`}
      />
      <span>{children}</span>
    </div>
  );
}
