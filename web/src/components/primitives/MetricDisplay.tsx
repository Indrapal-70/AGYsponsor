import React from 'react';

interface MetricDisplayProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: string;
  variant?: 'emerald' | 'zinc';
  className?: string;
}

export default function MetricDisplay({
  label,
  value,
  subtext,
  badge,
  variant = 'zinc',
  className = '',
}: MetricDisplayProps) {
  return (
    <div
      className={`p-5 rounded-2xl border border-zinc-800 bg-[#0c0c0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_30px_rgba(0,0,0,0.4)] transition-all hover:border-zinc-700 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
          {label}
        </span>
        {badge && (
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {badge}
          </span>
        )}
      </div>
      <div
        className={`text-2xl sm:text-3xl font-semibold tracking-tight ${
          variant === 'emerald' ? 'text-emerald-400' : 'text-white'
        }`}
      >
        {value}
      </div>
      {subtext && (
        <div className="mt-1 text-xs text-zinc-400 leading-relaxed font-normal">
          {subtext}
        </div>
      )}
    </div>
  );
}
