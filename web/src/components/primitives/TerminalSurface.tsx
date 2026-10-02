'use client';

import React from 'react';

interface TerminalSurfaceProps {
  children: React.ReactNode;
  title?: string;
  statusText?: string;
  className?: string;
  depthStyle?: boolean;
}

export default function TerminalSurface({
  children,
  title = 'Antigravity CLI 1.2.7 / 2.0 · ~/workspace/project',
  statusText = 'statusLine active',
  className = '',
  depthStyle = true,
}: TerminalSurfaceProps) {
  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-[#0c0c0e] overflow-hidden font-mono text-xs ${
        depthStyle
          ? 'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_25px_60px_rgba(0,0,0,0.85)]'
          : 'shadow-xl'
      } ${className}`}
    >
      {/* Terminal Title Bar */}
      <div className="px-4 py-3 bg-[#111114] border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <div className="flex items-center space-x-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 text-zinc-400 text-xs font-sans truncate">
            {title}
          </span>
        </div>
        {statusText && (
          <div className="flex items-center space-x-2 text-[11px] shrink-0 pl-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-medium hidden sm:inline">{statusText}</span>
          </div>
        )}
      </div>

      {/* Terminal Content Panel */}
      <div className="p-6 sm:p-8 space-y-4">
        {children}
      </div>
    </div>
  );
}
