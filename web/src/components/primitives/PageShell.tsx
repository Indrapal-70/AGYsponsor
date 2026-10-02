import React from 'react';

interface PageShellProps {
  children: React.ReactNode;
  ambientLight?: boolean;
  className?: string;
  maxWidth?: '5xl' | '6xl' | '7xl' | 'full';
}

export default function PageShell({
  children,
  ambientLight = true,
  className = '',
  maxWidth = '7xl',
}: PageShellProps) {
  const maxWidthClass = {
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  }[maxWidth];

  return (
    <div className={`relative min-h-[calc(100vh-4rem)] bg-[#09090b] text-zinc-100 overflow-x-hidden ${className}`}>
      {ambientLight && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/[0.04] blur-[120px] pointer-events-none rounded-full"
          aria-hidden="true"
        />
      )}
      <div className={`relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 ${maxWidthClass}`}>
        {children}
      </div>
    </div>
  );
}
