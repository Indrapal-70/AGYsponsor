'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function QuickstartSection() {
  const [platform, setPlatform] = useState<'unix' | 'windows'>('unix');
  const [copied, setCopied] = useState(false);

  const unixCommand = 'curl -sSL https://agentsponsor.com/install.sh | bash';
  const windowsCommand = 'irm https://agentsponsor.com/install.ps1 | iex';

  const activeCommand = platform === 'unix' ? unixCommand : windowsCommand;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 md:py-24 bg-[#09090b] border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>One-Command Setup</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
            Install and Pair in 60 Seconds
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            No source repository cloning or API access tokens required. Run the standalone public installer and pair your 8-character terminal code.
          </p>
        </div>

        {/* Quickstart Box */}
        <div className="max-w-3xl mx-auto rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 space-y-6 shadow-xl">
          {/* OS Switcher */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPlatform('unix')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                  platform === 'unix'
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Linux / macOS / WSL2
              </button>
              <button
                onClick={() => setPlatform('windows')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                  platform === 'windows'
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Windows (PowerShell)
              </button>
            </div>
            <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
              SHA-256 Verified
            </span>
          </div>

          {/* Terminal Command Box */}
          <div className="relative flex items-center justify-between p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto">
            <code className="pr-4 whitespace-nowrap">{activeCommand}</code>
            <button
              onClick={handleCopy}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-sans font-medium transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          {/* 3 Step Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-1">
              <span className="font-mono text-emerald-400 font-bold">STEP 1</span>
              <p className="text-zinc-300 font-medium">Run Installer</p>
              <p className="text-[11px] text-zinc-500">Unpacks plugin into Antigravity config.</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-1">
              <span className="font-mono text-emerald-400 font-bold">STEP 2</span>
              <p className="text-zinc-300 font-medium">Copy 8-Char Code</p>
              <p className="text-[11px] text-zinc-500">Terminal prints single-use code.</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-1">
              <span className="font-mono text-emerald-400 font-bold">STEP 3</span>
              <p className="text-zinc-300 font-medium">Pair & Start Earning</p>
              <p className="text-[11px] text-zinc-500">Link your account to track ledger.</p>
            </div>
          </div>

          {/* Pairing Link Callout */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
            <div className="text-zinc-300 text-center sm:text-left">
              Already have your pairing code from your terminal?
            </div>
            <Link
              href="/connect"
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold transition-all whitespace-nowrap"
            >
              Connect Code →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
