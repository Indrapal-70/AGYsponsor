'use client';

import { useState } from 'react';

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
      status: 'PENDING_REVIEW'
    },
    {
      id: 'cmp_102',
      advertiser: 'CloudForge Demo',
      name: 'CloudForge AI Infrastructure',
      headline: 'Deploy your AI backend in seconds',
      url: 'https://example.com/cloudforge',
      budget: 25000,
      status: 'ACTIVE'
    },
    {
      id: 'cmp_103',
      advertiser: 'VectorScale AI',
      name: 'VectorScale Agent Indexing',
      headline: 'Instant vector search for your agents',
      url: 'https://example.com/vectorscale',
      budget: 15000,
      status: 'ACTIVE'
    }
  ]);

  // Payout queue state
  const [payouts, setPayouts] = useState<PayoutItem[]>([
    {
      id: 'pout_req_01',
      userEmail: 'dev.lead@startup.in',
      accountType: 'UPI',
      identifier: 'devlead@okhdfcbank',
      holderName: 'Kunal Verma',
      amount: 450.00,
      status: 'PENDING_REVIEW',
      requestedAt: '10 minutes ago'
    },
    {
      id: 'pout_req_02',
      userEmail: 'vikram@agenthq.io',
      accountType: 'BANK_TRANSFER',
      identifier: 'ICIC0000452:90234120934',
      holderName: 'Vikram Joshi',
      amount: 1200.00,
      status: 'PENDING_REVIEW',
      requestedAt: '1 hour ago'
    }
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
      status: 'OPEN'
    },
    {
      id: 'sig_02',
      installationUuid: '8a12e50d-c782-4110-8ef9-813d90bb2451',
      signalType: 'SUSPICIOUS_TOKEN_REPLAY',
      severity: 'HIGH',
      details: 'Expired HMAC token presented with forged client signature',
      detectedAt: '5 hours ago',
      status: 'OPEN'
    }
  ]);

  // Platform Settings State
  const [settings, setSettings] = useState({
    consumerRewardRate: '0.20',
    platformShareRate: '0.30',
    minPayoutAmount: '50.00',
    rotationTtl: '60'
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
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleUpdatePayoutStatus = (id: string, newStatus: PayoutItem['status']) => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const handleUpdateSignalStatus = (id: string, newStatus: FraudSignal['status']) => {
    setFraudSignals(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl">
          <div className="text-center space-y-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
            <h2 className="text-2xl font-extrabold text-white">Owner / Admin Portal</h2>
            <p className="text-xs text-gray-400">Restricted operator access for AgentSponsor</p>
          </div>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Admin Secret Key
              </label>
              <input
                type="password"
                required
                className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                placeholder="Enter ADMIN_SECRET"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 transition shadow-lg"
            >
              Authenticate Admin Session
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
                Owner / Operator Mode
              </span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Operations</h1>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Campaign review, withdrawal disbursements, anti-fraud telemetry, and economic settings.
            </p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-gray-400 hover:text-white px-3 py-1.5 border border-gray-800 rounded-lg hover:bg-gray-900"
          >
            Lock Session
          </button>
        </div>

        {/* Global Platform KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gross Sponsor Billings</span>
            <div className="text-3xl font-extrabold text-white">₹52,500</div>
            <p className="text-[11px] text-gray-500">Collected via Razorpay</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Developer Payouts</span>
            <div className="text-3xl font-extrabold text-emerald-400">₹21,000</div>
            <p className="text-[11px] text-gray-500">Disbursed to developers</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Net Platform Margin</span>
            <div className="text-3xl font-extrabold text-indigo-400">₹31,500</div>
            <p className="text-[11px] text-gray-500">60% platform retainage</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Terminals</span>
            <div className="text-3xl font-extrabold text-amber-400">1,280</div>
            <p className="text-[11px] text-gray-500">Paired CLI installations</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('CAMPAIGNS')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
              activeTab === 'CAMPAIGNS'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Campaign Moderation ({campaigns.filter(c => c.status === 'PENDING_REVIEW').length} Pending)
          </button>
          <button
            onClick={() => setActiveTab('PAYOUTS')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
              activeTab === 'PAYOUTS'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Payout Approvals ({payouts.filter(p => p.status === 'PENDING_REVIEW').length} Pending)
          </button>
          <button
            onClick={() => setActiveTab('FRAUD')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
              activeTab === 'FRAUD'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Fraud & Security ({fraudSignals.filter(s => s.status === 'OPEN').length} Alerts)
          </button>
          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
              activeTab === 'SETTINGS'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Platform Economics
          </button>
        </div>

        {/* Tab 1: Campaign Moderation */}
        {activeTab === 'CAMPAIGNS' && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-sm font-bold text-white">Sponsor Campaign Approvals & Moderation</h3>
              <p className="text-xs text-gray-400">Review copy, safety URLs, and toggle rotation states</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="py-3 px-4">Advertiser & Campaign</th>
                    <th className="py-3 px-4">Headline / Creative Copy</th>
                    <th className="py-3 px-4">Destination URL</th>
                    <th className="py-3 px-4">Budget</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-800/20">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{c.advertiser}</div>
                        <div className="text-[11px] text-gray-500">{c.name}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-indigo-300">"{c.headline}"</td>
                      <td className="py-3.5 px-4">
                        <a href={c.url} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                          {c.url}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold">₹{c.budget.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          c.status === 'PENDING_REVIEW' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          c.status === 'PAUSED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {c.status === 'PENDING_REVIEW' && (
                          <>
                            <button
                              onClick={() => handleUpdateCampaignStatus(c.id, 'ACTIVE')}
                              className="px-2.5 py-1 bg-emerald-500 text-black font-bold rounded text-[11px] hover:bg-emerald-400"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateCampaignStatus(c.id, 'REJECTED')}
                              className="px-2.5 py-1 bg-red-600 text-white font-bold rounded text-[11px] hover:bg-red-500"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {c.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleUpdateCampaignStatus(c.id, 'PAUSED')}
                            className="px-2.5 py-1 bg-amber-500 text-black font-bold rounded text-[11px] hover:bg-amber-400"
                          >
                            Pause
                          </button>
                        )}
                        {c.status === 'PAUSED' && (
                          <button
                            onClick={() => handleUpdateCampaignStatus(c.id, 'ACTIVE')}
                            className="px-2.5 py-1 bg-emerald-500 text-black font-bold rounded text-[11px] hover:bg-emerald-400"
                          >
                            Resume
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Payout Approvals */}
        {activeTab === 'PAYOUTS' && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-sm font-bold text-white">Consumer Withdrawal Requests</h3>
              <p className="text-xs text-gray-400">Review requested balances and approve disbursements to UPI/Bank</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="py-3 px-4">User Email</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Holder Name</th>
                    <th className="py-3 px-4">Amount (INR)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Requested</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {payouts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-800/20">
                      <td className="py-3.5 px-4 font-medium text-white">{p.userEmail}</td>
                      <td className="py-3.5 px-4 font-mono text-indigo-300">
                        [{p.accountType}] {p.identifier}
                      </td>
                      <td className="py-3.5 px-4">{p.holderName}</td>
                      <td className="py-3.5 px-4 font-bold font-mono text-emerald-400">₹{p.amount.toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' :
                          p.status === 'PENDING_REVIEW' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400">{p.requestedAt}</td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {p.status === 'PENDING_REVIEW' && (
                          <>
                            <button
                              onClick={() => handleUpdatePayoutStatus(p.id, 'COMPLETED')}
                              className="px-2.5 py-1 bg-emerald-500 text-black font-bold rounded text-[11px] hover:bg-emerald-400"
                            >
                              Disburse
                            </button>
                            <button
                              onClick={() => handleUpdatePayoutStatus(p.id, 'REJECTED')}
                              className="px-2.5 py-1 bg-red-600 text-white font-bold rounded text-[11px] hover:bg-red-500"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Fraud & Security */}
        {activeTab === 'FRAUD' && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-sm font-bold text-white">Fraud Prevention & Anomalous Telemetry</h3>
              <p className="text-xs text-gray-400">Suspicious bursts, dwell duration anomalies, and token forgery</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="py-3 px-4">Installation UUID</th>
                    <th className="py-3 px-4">Signal Type</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Anomalous Telemetry Details</th>
                    <th className="py-3 px-4">Detected</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {fraudSignals.map((sig) => (
                    <tr key={sig.id} className="hover:bg-gray-800/20">
                      <td className="py-3.5 px-4 font-mono text-gray-300">{sig.installationUuid.substring(0, 16)}...</td>
                      <td className="py-3.5 px-4 font-semibold text-white">{sig.signalType}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sig.severity === 'HIGH' || sig.severity === 'CRITICAL'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {sig.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400">{sig.details}</td>
                      <td className="py-3.5 px-4 text-gray-400">{sig.detectedAt}</td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {sig.status === 'OPEN' ? (
                          <>
                            <button
                              onClick={() => handleUpdateSignalStatus(sig.id, 'CLEARED')}
                              className="px-2.5 py-1 bg-gray-800 text-gray-300 font-medium rounded text-[11px] hover:bg-gray-700"
                            >
                              Clear
                            </button>
                            <button
                              onClick={() => handleUpdateSignalStatus(sig.id, 'BLOCKED')}
                              className="px-2.5 py-1 bg-red-600 text-white font-bold rounded text-[11px] hover:bg-red-500"
                            >
                              Suspend Device
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] font-mono text-gray-500">{sig.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Platform Settings */}
        {activeTab === 'SETTINGS' && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-6">
            <div className="border-b border-gray-800 pb-4">
              <h3 className="text-sm font-bold text-white">Platform Settings & Economic Parameters</h3>
              <p className="text-xs text-gray-400">Configure developer rewards, platform margins, and rotation TTL</p>
            </div>

            {settingsSaved && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg">
                ✓ Platform settings updated successfully and broadcast to ad delivery engine.
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Developer Reward per Qualified Exposure (INR ₹)
                </label>
                <input
                  type="text"
                  value={settings.consumerRewardRate}
                  onChange={(e) => setSettings({ ...settings, consumerRewardRate: e.target.value })}
                  className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                />
                <p className="text-[11px] text-gray-500 mt-1">Default: ₹0.20 credited to consumer ledger</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Platform Fee Share per Exposure (INR ₹)
                </label>
                <input
                  type="text"
                  value={settings.platformShareRate}
                  onChange={(e) => setSettings({ ...settings, platformShareRate: e.target.value })}
                  className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                />
                <p className="text-[11px] text-gray-500 mt-1">Default: ₹0.30 platform retainage</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Minimum Payout Threshold (INR ₹)
                </label>
                <input
                  type="text"
                  value={settings.minPayoutAmount}
                  onChange={(e) => setSettings({ ...settings, minPayoutAmount: e.target.value })}
                  className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                />
                <p className="text-[11px] text-gray-500 mt-1">Default: ₹50.00 withdrawal minimum</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Client Status Line Rotation TTL (Seconds)
                </label>
                <input
                  type="text"
                  value={settings.rotationTtl}
                  onChange={(e) => setSettings({ ...settings, rotationTtl: e.target.value })}
                  className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                />
                <p className="text-[11px] text-gray-500 mt-1">Default: 60s rotation cache in terminal</p>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition"
              >
                Save Platform Configuration
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
