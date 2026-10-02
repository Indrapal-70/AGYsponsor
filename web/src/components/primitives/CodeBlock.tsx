'use client';

import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  showCopy?: boolean;
  className?: string;
  prefix?: string;
}

export default function CodeBlock({
  code,
  language,
  showCopy = true,
  className = '',
  prefix = '$',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative flex items-center justify-between p-4 rounded-xl bg-black/80 border border-zinc-800/90 shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)] font-mono text-xs sm:text-sm text-zinc-200 overflow-x-auto ${className}`}
    >
      <div className="flex items-center space-x-2.5 truncate pr-3">
        {prefix && <span className="text-zinc-500 font-bold shrink-0 select-none">{prefix}</span>}
        <code className="text-emerald-400 font-mono truncate">{code}</code>
      </div>
      {showCopy && (
        <button
          onClick={handleCopy}
          className="shrink-0 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-sans font-medium transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      )}
    </div>
  );
}
