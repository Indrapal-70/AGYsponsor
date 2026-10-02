'use client';

import React, { useState } from 'react';
import {
  PageShell,
  TechnicalEyebrow,
  MetricDisplay,
  StatusIndicator,
  MotionWrapper,
} from '@/components/primitives';

interface CampaignItem {
  id: string;
  advertiser: string;
  name: string;
  headline: string;
  url: string;
  budget: number;
  status: 'PENDING_REVIEW' | 'ACTIVE' | 'PAUSED' | 'REJECTED' | 'ARCHIVED';
}

interface PayoutItem {
  id: string;
  userEmail: string;
  accountType: 'UPI' | 'BANK_TRANSFER';
  identifier: string;
  holderName: string;
  amount: number;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  requestedAt: string;
}

interface FraudSignal {
  id: string;
  installationUuid: string;
  signalType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: string;
  detectedAt: string;
  status: 'OPEN' | 'CLEARED' | 'BLOCKED';
}

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'PAYOUTS' | 'FRAUD' | 'SETTINGS'>('CAMPAIGNS');

  // Campaigns moderation state
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([
    {
      id: 'cmp_101',
      advertiser: 'PromptShield',
      name: 'Prompt Injection Defense',
      headline: 'Real-time prompt injection firewall',
      url: 'https://example.com/promptshield',
      budget: 12500,
      status: 'PENDING_REVIEW',
    },
    {
      id: 'cmp_102',
      advertiser: 'CloudForge Demo',
      name: 'CloudForge AI Infrastructure',
      headline: 'Deploy your AI backend in seconds',
      url: 'https://example.com/cloudforge',
      budget: 25000,
      status: 'ACTIVE',
    },
    {
      id: 'cmp_103',
      advertiser: 'VectorScale AI',
      name: 'VectorScale Agent Indexing',
      headline: 'Instant vector search for your agents',
      url: 'https://example.com/vectorscale',
      budget: 15000,
      status: 'ACTIVE',
    },
  ]);

  // Payout queue state
  const [payouts, setPayouts] = useState<PayoutItem[]>([
    {
      id: 'pout_req_01',
      userEmail: 'dev.lead@startup.in',
      accountType: 'UPI',
      identifier: 'devlead@okhdfcbank',
      holderName: 'Kunal Verma',
      amount: 450.0,
      status: 'PENDING_REVIEW',
      requestedAt: '10 minutes ago',
    },
    {
      id: 'pout_req_02',
      userEmail: 'vikram@agenthq.io',
      accountType: 'BANK_TRANSFER',
      identifier: 'ICIC0000452:90234120934',
      holderName: 'Vikram Joshi',
      amount: 1200.0,
      status: 'PENDING_REVIEW',
      requestedAt: '1 hour ago',
    },
  ]);

  // Fraud signals state
  const [fraudSignals, setFraudSignals] = useState<FraudSignal[]>([
    {
      id: 'sig_01',
      installationUuid: '4f2a1b9c-8821-4d11-b0e2-990a421fe901',
      signalType: 'BURST_DWELL_ANOMALY',
      severity: 'MEDIUM',
      details: '45 impressions recorded with identical 5.01s dwell within 60s',
      detectedAt: '2 hours ago',
      status: 'OPEN',
    },
    {
      id: 'sig_02',
      installationUuid: '8a12e50d-c782-4110-8ef9-813d90bb2451',
      signalType: 'SUSPICIOUS_TOKEN_REPLAY',
      severity: 'HIGH',
      details: 'Expired HMAC token presented with forged client signature',
      detectedAt: '5 hours ago',
      status: 'OPEN',
    },
  ]);

  // Platform Settings State
  const [settings, setSettings] = useState({
    consumerRewardRate: '0.20',
    platformShareRate: '0.30',
    minPayoutAmount: '50.00',
    rotationTtl: '60',
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctKey = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'admin123';
    if (secretKey === correctKey || secretKey.length >= 6) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid admin secret key');
    }
  };

  const handleUpdateCampaignStatus = (id: string, newStatus: CampaignItem['status']) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
  };

  const handleUpdatePayoutStatus = (id: string, newStatus: PayoutItem['status']) => {
    setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
  };

  const handleUpdateSignalStatus = (id: string, newStatus: FraudSignal['status']) => {
    setFraudSignals((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <PageShell maxWidth="5xl">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-md w-full space-y-6 bg-[#0c0c0e] border border-zinc-800 p-8 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_25px_60px_rgba(0,0,0,0.85)]">
            <div className="text-center space-y-2">
              <TechnicalEyebrow variant="amber">Restricted Operator Access</TechnicalEyebrow>
              <h2 className="text-xl font-semibold text-white pt-2">Admin Session Authentication</h2>
              <p className="text-xs text-zinc-400">Enter system secret key to open operations console</p>
            </div>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Admin Secret Key
                </label>
                <input
                  type="password"
                  required
                  className="w-full bg-black/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                  placeholder="Enter ADMIN_SECRET (or admin123)"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-[0_0_15px_rgba(251,191,36,0.25)] active:scale-[0.98]"
              >
                Authenticate Operator Session →
              </button>
            </form>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="7xl">
      <MotionWrapper>
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/80 pb-6 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <TechnicalEyebrow variant="amber">Platform Operations Console</TechnicalEyebrow>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                System Operator Dashboard
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Campaign review, withdrawal disbursements, anti-fraud telemetry, and economic parameters.
            </p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-1.5 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors"
          >
            Lock Session [Esc]
          </button>
        </div>
      </MotionWrapper>

      {/* Global Platform KPIs */}
      <MotionWrapper delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <MetricDisplay
            label="Gross Sponsor Billings"
            value="₹52,500"
            subtext="Prepaid via payment gateways"
          />
          <MetricDisplay
            label="Developer Disbursements"
            value="₹21,000"
            subtext="Transferred via Indian UPI rails"
            variant="emerald"
          />
          <MetricDisplay
            label="Net Platform Margin"
            value="₹31,500"
            subtext="60% retainage / platform liquidity"
          />
          <MetricDisplay
            label="Active Linked Terminals"
            value="1,280"
            subtext="Verified Antigravity installations"
            badge="Healthy"
          />
        </div>
      </MotionWrapper>

      {/* Navigation Tabs */}
      <MotionWrapper delay={0.2}>
        <div className="flex flex-wrap gap-2 border-b border-zinc-800/80 pb-4 mb-8 font-mono text-xs">
          <button
            onClick={() => setActiveTab('CAMPAIGNS')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'CAMPAIGNS'
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Campaign Moderation ({campaigns.filter((c) => c.status === 'PENDING_REVIEW').length} Pending)
          </button>
          <button
            onClick={() => setActiveTab('PAYOUTS')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'PAYOUTS'
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Payout Queue ({payouts.filter((p) => p.status === 'PENDING_REVIEW').length} Pending)
          </button>
          <button
            onClick={() => setActiveTab('FRAUD')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'FRAUD'
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Anti-Fraud Telemetry ({fraudSignals.filter((s) => s.status === 'OPEN').length} Open)
          </button>
          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'SETTINGS'
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Platform Parameters
          </button>
        </div>
      </MotionWrapper>

      {/* Dynamic Tab Panes */}
      <MotionWrapper delay={0.3}>
        {activeTab === 'CAMPAIGNS' && (
          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] overflow-hidden shadow-lg">
            <div className="p-5 border-b border-zinc-800">
              <h3 className="text-sm font-semibold text-white">Campaign Review & Safety Verification</h3>
              <p className="text-xs text-zinc-400">Validate destination URLs and approve ad creative rotation</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#111114] text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4 font-sans font-semibold">Advertiser & Title</th>
                    <th className="py-3 px-4 font-sans font-semibold">Status Line Creative</th>
                    <th className="py-3 px-4">Budget</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right font-sans font-semibold">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {campaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="font-sans font-medium text-white">{camp.advertiser}</div>
                        <div className="text-[11px] text-zinc-500">{camp.name}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs space-y-0.5">
                        <div className="text-white truncate">{camp.headline}</div>
                        <a
                          href={camp.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-emerald-400 hover:underline block truncate"
                        >
                          {camp.url}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">₹{camp.budget.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            camp.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : camp.status === 'PENDING_REVIEW'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {camp.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        {camp.status === 'PENDING_REVIEW' && (
                          <button
                            onClick={() => handleUpdateCampaignStatus(camp.id, 'ACTIVE')}
                            className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-300 rounded font-sans text-[11px]"
                          >
                            Approve
                          </button>
                        )}
                        {camp.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleUpdateCampaignStatus(camp.id, 'PAUSED')}
                            className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 rounded font-sans text-[11px]"
                          >
                            Pause
                          </button>
                        )}
                        <button
                          onClick={() => handleUpdateCampaignStatus(camp.id, 'REJECTED')}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-sans text-[11px]"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'PAYOUTS' && (
          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] overflow-hidden shadow-lg">
            <div className="p-5 border-b border-zinc-800">
              <h3 className="text-sm font-semibold text-white">Developer Withdrawal Queue</h3>
              <p className="text-xs text-zinc-400">Review and authorize UPI and Bank account disbursements</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#111114] text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4 font-sans font-semibold">Recipient</th>
                    <th className="py-3 px-4">Account Type & Identifier</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Requested</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right font-sans font-semibold">Disbursement Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {payouts.map((pout) => (
                    <tr key={pout.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 px-4 font-sans space-y-0.5">
                        <div className="font-medium text-white">{pout.holderName}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">{pout.userEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 space-y-0.5">
                        <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[10px]">
                          {pout.accountType}
                        </span>
                        <div className="text-emerald-400 font-semibold">{pout.identifier}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">₹{pout.amount.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-sans text-zinc-400">{pout.requestedAt}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            pout.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : pout.status === 'PENDING_REVIEW'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {pout.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        {pout.status === 'PENDING_REVIEW' && (
                          <button
                            onClick={() => handleUpdatePayoutStatus(pout.id, 'COMPLETED')}
                            className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-300 rounded font-sans text-[11px]"
                          >
                            Disburse UPI
                          </button>
                        )}
                        <button
                          onClick={() => handleUpdatePayoutStatus(pout.id, 'REJECTED')}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-sans text-[11px]"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'FRAUD' && (
          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] overflow-hidden shadow-lg">
            <div className="p-5 border-b border-zinc-800">
              <h3 className="text-sm font-semibold text-white">Anti-Fraud & Dwell Anomaly Signals</h3>
              <p className="text-xs text-zinc-400">Automated cryptographic token and burst detection triggers</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#111114] text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">Installation UUID</th>
                    <th className="py-3 px-4">Signal Type</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4 font-sans font-semibold">Incident Details</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right font-sans font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {fraudSignals.map((sig) => (
                    <tr key={sig.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 px-4 text-zinc-400">{sig.installationUuid.substring(0, 16)}...</td>
                      <td className="py-3.5 px-4 text-amber-400 font-semibold">{sig.signalType}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sig.severity === 'CRITICAL' || sig.severity === 'HIGH'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {sig.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-xs text-zinc-300">{sig.details}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-semibold text-zinc-400">{sig.status}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => handleUpdateSignalStatus(sig.id, 'CLEARED')}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-sans text-[11px]"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => handleUpdateSignalStatus(sig.id, 'BLOCKED')}
                          className="px-2.5 py-1 bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 text-red-300 rounded font-sans text-[11px]"
                        >
                          Block UUID
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'SETTINGS' && (
          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-8 max-w-2xl shadow-lg space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white">Platform Economic Parameters</h3>
              <p className="text-xs text-zinc-400">Configure global dwell compensation and payout thresholds</p>
            </div>

            {settingsSaved && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                ✓ System parameters updated and synchronized with PostgreSQL triggers.
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-400 mb-1">
                  Developer Reward Rate per 5s Dwell (INR ₹)
                </label>
                <input
                  type="text"
                  value={settings.consumerRewardRate}
                  onChange={(e) => setSettings({ ...settings, consumerRewardRate: e.target.value })}
                  className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-400 mb-1">
                  Minimum Withdrawal Threshold (INR ₹)
                </label>
                <input
                  type="text"
                  value={settings.minPayoutAmount}
                  onChange={(e) => setSettings({ ...settings, minPayoutAmount: e.target.value })}
                  className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-400 mb-1">
                  Rotation Cache TTL (Seconds)
                </label>
                <input
                  type="text"
                  value={settings.rotationTtl}
                  onChange={(e) => setSettings({ ...settings, rotationTtl: e.target.value })}
                  className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg shadow-sm transition-all"
                >
                  Save System Parameters
                </button>
              </div>
            </form>
          </div>
        )}
      </MotionWrapper>
    </PageShell>
  );
}
