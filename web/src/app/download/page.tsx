'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PageShell,
  SectionHeader,
  TechnicalEyebrow,
  CodeBlock,
  StatusIndicator,
  MotionWrapper,
} from '@/components/primitives';

export default function DownloadPage() {
  const [platform, setPlatform] = useState<'unix' | 'windows'>('unix');

  const unixCommand = 'curl -sSL https://ag-ysponsor.vercel.app/install.sh | bash';
  const windowsCommand = 'irm https://ag-ysponsor.vercel.app/install.ps1 | iex';

  return (
    <PageShell maxWidth="5xl">
      {/* Header Section */}
      <MotionWrapper>
        <SectionHeader
          eyebrow="Public Release v1.0.0"
          title="Install AgentSponsor CLI Plugin"
          subtitle="Deploy directly into your Antigravity CLI environment in seconds. Zero GitHub tokens, developer credentials, or repository cloning required."
        />
      </MotionWrapper>

      {/* Platform Switcher & Code Well */}
      <MotionWrapper delay={0.15}>
        <div className="rounded-2xl border border-zinc-800/90 bg-[#0c0c0e] p-6 sm:p-8 space-y-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_25px_60px_rgba(0,0,0,0.85)] mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800/80 pb-4 gap-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPlatform('unix')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  platform === 'unix'
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/40 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Linux / macOS / WSL2
              </button>
              <button
                onClick={() => setPlatform('windows')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  platform === 'windows'
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/40 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Windows (PowerShell)
              </button>
            </div>
            <StatusIndicator label="SHA-256 Verified" variant="emerald" />
          </div>

          <div className="space-y-3">
            <div className="text-xs font-mono text-zinc-400">
              Run this single command in your terminal:
            </div>
            <CodeBlock
              code={platform === 'unix' ? unixCommand : windowsCommand}
              prefix={platform === 'unix' ? '$' : 'PS>'}
            />
            <p className="text-xs text-zinc-500 font-mono">
              Downloads packaged archive, verifies SHA-256 checksum, registers hook at{' '}
              <code>~/.gemini/config/plugins/agentsponsor</code>, and configures statusLine.
            </p>
          </div>
        </div>
      </MotionWrapper>

      {/* Terminal Pairing Notice Card */}
      <MotionWrapper delay={0.25}>
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 shadow-[0_0_30px_rgba(16,185,129,0.06)]">
          <div className="space-y-1">
            <TechnicalEyebrow variant="emerald">Next Step</TechnicalEyebrow>
            <h3 className="text-base font-semibold text-white pt-1">
              Have your 8-character pairing code ready?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-lg font-normal">
              Your terminal will display a single-use code (e.g. <code>8F4K-92JD</code>) upon install. Link it to your account to collect earnings.
            </p>
          </div>
          <Link
            href="/connect"
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs rounded-lg transition-all whitespace-nowrap shadow-[0_0_15px_rgba(16,185,129,0.25)] active:scale-[0.98]"
          >
            Pair Installation →
          </Link>
        </div>
      </MotionWrapper>

      {/* Technical Specifications */}
      <MotionWrapper delay={0.35}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono text-zinc-400 mb-12">
          <div className="p-6 rounded-2xl bg-[#0c0c0e] border border-zinc-800/80 space-y-3 shadow-lg">
            <span className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] block pb-2 border-b border-zinc-800">
              Release Integrity & Packaging:
            </span>
            <ul className="space-y-1.5 text-zinc-400">
              <li>Checksum: Automated SHA-256 archive validation</li>
              <li>Bundle Size: &lt; 50 KB self-contained</li>
              <li>Node Runtime: 18.x / 20.x / 22.x LTS</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-[#0c0c0e] border border-zinc-800/80 space-y-3 shadow-lg">
            <span className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] block pb-2 border-b border-zinc-800">
              Antigravity Compatibility:
            </span>
            <ul className="space-y-1.5 text-zinc-400">
              <li>CLI Versions: 1.0.0 through 1.2.7 and 2.0 Native</li>
              <li>Status Mode: stack_with_default: true</li>
              <li>Fail-Open: Sub-2ms immediate exit on cold cache</li>
            </ul>
          </div>
        </div>
      </MotionWrapper>
    </PageShell>
  );
}
