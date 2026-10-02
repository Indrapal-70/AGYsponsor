'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function InstallationProtocol() {
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

  const steps = [
    {
      num: '01',
      title: 'Install Lightweight Hook',
      desc: 'Run the public standalone curl or PowerShell installer. Unpacks into ~/.gemini/config/plugins/agentsponsor with SHA-256 verification.',
    },
    {
      num: '02',
      title: 'Pair Terminal Code',
      desc: 'Your terminal prints an 8-character single-use code (e.g. 8F4K-92JD). Enter it at /connect to link your installation to your ledger.',
    },
    {
      num: '03',
      title: 'Execute Normal Prompts',
      desc: 'Run normal Antigravity agent commands. The secondary status line appears exclusively during active execution and vanishes when idle.',
    },
    {
      num: '04',
      title: 'Accumulate & Withdraw',
      desc: 'Accrue ₹0.20 per verified 5s dwell exposure. Withdraw directly to your Indian UPI ID or bank account once reaching the ₹50 threshold.',
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-xs font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Technical Protocol</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
            Installation & Verification Sequence
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Get started in under 60 seconds. Zero git repository cloning or developer tokens required.
          </p>
        </div>

        {/* 4-Step Progressive Timeline */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-6 rounded-2xl border border-zinc-800 bg-[#0c0c0e] flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors"
            >
              <div className="space-y-2">
                <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 inline-block">
                  STEP {step.num}
                </span>
                <h3 className="text-base font-semibold text-white pt-1">{step.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Terminal Quickstart Box */}
        <div className="max-w-3xl mx-auto rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 space-y-6 shadow-2xl">
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
            <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
              SHA-256 Verified Archive
            </span>
          </div>

          {/* Code Bar */}
          <div className="relative flex items-center justify-between p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto">
            <code className="pr-4 whitespace-nowrap">{activeCommand}</code>
            <button
              onClick={handleCopy}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-sans font-medium transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          {/* Pairing Notice */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
            <div className="text-zinc-300 text-center sm:text-left">
              Have your 8-character pairing code ready?
            </div>
            <Link
              href="/connect"
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold transition-all whitespace-nowrap"
            >
              Pair Installation Now →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
