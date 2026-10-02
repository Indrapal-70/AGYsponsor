import React from 'react';

interface StatusIndicatorProps {
  label: string;
  variant?: 'emerald' | 'amber' | 'blue' | 'zinc';
  pulse?: boolean;
  className?: string;
}

export default function StatusIndicator({
  label,
  variant = 'emerald',
  pulse = false,
  className = '',
}: StatusIndicatorProps) {
  const dotColor = {
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    blue: 'bg-blue-400',
    zinc: 'bg-zinc-500',
  };

  const textColor = {
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    blue: 'text-blue-400',
    zinc: 'text-zinc-400',
  };

  return (
    <div className={`inline-flex items-center space-x-2 text-xs font-mono ${className}`}>
      <span
        className={`w-2 h-2 rounded-full ${dotColor[variant]} ${
          pulse ? 'animate-pulse' : ''
        }`}
      />
      <span className={`font-semibold ${textColor[variant]}`}>{label}</span>
    </div>
  );
}
