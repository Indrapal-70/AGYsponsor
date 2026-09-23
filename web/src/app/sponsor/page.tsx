'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Campaign {
  id: string;
  name: string;
  advertiserName: string;
  headline: string;
  destinationUrl: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  totalBudget: number;
  remainingBudget: number;
  impressions: number;
  clicks: number;
}

export default function SponsorPortal() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'cmp_001',
      name: 'CloudForge AI GPU Infrastructure',
      advertiserName: 'CloudForge Demo',
      headline: 'Deploy your AI backend in seconds',
      destinationUrl: 'https://example.com/cloudforge',
      status: 'ACTIVE',
      totalBudget: 5000,
      remainingBudget: 3420,
      impressions: 3160,
      clicks: 89
    },
    {
      id: 'cmp_002',
      name: 'VectorScale Developer Launch',
      advertiserName: 'VectorScale AI',
      headline: 'Instant vector search for your agents',
      destinationUrl: 'https://example.com/vectorscale',
      status: 'ACTIVE',
      totalBudget: 15000,
      remainingBudget: 11840,
      impressions: 6320,
      clicks: 142
    },
    {
      id: 'cmp_003',
      name: 'PromptShield Firewall Beta',
      advertiserName: 'PromptShield',
      headline: 'Real-time prompt injection firewall',
      destinationUrl: 'https://example.com/promptshield',
      status: 'PENDING_REVIEW',
      totalBudget: 2500,
      remainingBudget: 2500,
      impressions: 0,
      clicks: 0
    }
  ]);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState<Campaign | null>(null);
  const [fundAmount, setFundAmount] = useState('5000');
  const [fundSuccess, setFundSuccess] = useState(false);

  // New campaign form state
  const [newName, setNewName] = useState('');
  const [newAdvertiser, setNewAdvertiser] = useState('');
  const [newHeadline, setNewHeadline] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newBudget, setNewBudget] = useState('5000');

  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalBudgetFunded = campaigns.reduce((acc, c) => acc + c.totalBudget, 0);
  const totalRemaining = campaigns.reduce((acc, c) => acc + c.remainingBudget, 0);
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAdvertiser.trim() || !newHeadline.trim() || !newUrl.trim()) return;

    const budgetNum = parseFloat(newBudget) || 2000;
    const newCamp: Campaign = {
      id: `cmp_${Date.now()}`,
      name: newName.trim(),
      advertiserName: newAdvertiser.trim(),
      headline: newHeadline.trim(),
      destinationUrl: newUrl.trim(),
      status: 'PENDING_REVIEW',
      totalBudget: budgetNum,
      remainingBudget: budgetNum,
      impressions: 0,
      clicks: 0
    };

    setCampaigns([newCamp, ...campaigns]);
    setShowCreateModal(false);
    setNewName('');
    setNewAdvertiser('');
    setNewHeadline('');
    setNewUrl('');
  };

  const handleFundCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showFundModal) return;

    const addAmount = parseFloat(fundAmount);
    if (isNaN(addAmount) || addAmount <= 0) return;

    // Simulate verified payment capture
    setCampaigns(prev => prev.map(c => {
      if (c.id === showFundModal.id) {
        return {
          ...c,
          totalBudget: c.totalBudget + addAmount,
          remainingBudget: c.remainingBudget + addAmount
        };
      }
      return c;
    }));

    setFundSuccess(true);
    setTimeout(() => {
      setFundSuccess(false);
      setShowFundModal(null);
    }, 1500);
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                Sponsor Organization
              </span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Sponsor Portal</h1>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Manage terminal sponsorship campaigns, budget pacing, and developer engagement.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-lg transition"
            >
              Subscription Packages
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg transition"
            >
              + Create Campaign
            </button>
          </div>
        </div>

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Impressions Delivered</span>
            <div className="text-3xl font-extrabold text-white">
              {totalImpressions.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">100% verified dwell exposures</p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Clicks & Dwell CTR</span>
            <div className="text-3xl font-extrabold text-indigo-400">
              {totalClicks} <span className="text-sm font-normal text-gray-400">({ctr}%)</span>
            </div>
            <p className="text-[11px] text-gray-500">Destination link clicks</p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Budget Funded</span>
            <div className="text-3xl font-extrabold text-white">
              ₹{totalBudgetFunded.toLocaleString()}
            </div>
            <p className="text-[11px] text-gray-500">Gross prepaid campaign budget</p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Remaining Balance</span>
            <div className="text-3xl font-extrabold text-emerald-400">
              ₹{totalRemaining.toLocaleString()}
            </div>
            <p className="text-[11px] text-gray-500">Available delivery credits</p>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="rounded-xl border border-gray-800 bg-black/40 p-6 space-y-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
            Terminal Status Line Preview (How Active Campaigns Render)
          </span>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 font-mono text-xs text-gray-300 space-y-2">
            <div className="text-gray-500">Working (4.1s) · Running bash build command...</div>
            <div className="text-indigo-300 font-medium">
              <span className="text-amber-400 font-bold">Sponsored · CloudForge Demo</span>
              <span className="text-gray-400 mx-2">—</span>
              <span>Deploy your AI backend in seconds →</span>
            </div>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
          <div className="p-5 border-b border-gray-800 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white">Your Campaigns</h3>
              <p className="text-xs text-gray-400">Active status line ad rotation and budgets</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              + Add Campaign
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4">Campaign Name & Headline</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Remaining / Total</th>
                  <th className="py-3 px-4">Impressions</th>
                  <th className="py-3 px-4">Clicks</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-gray-800/20">
                    <td className="py-3.5 px-4 space-y-1">
                      <div className="font-semibold text-white">{camp.name}</div>
                      <div className="text-[11px] text-indigo-300 font-mono">
                        {camp.advertiserName}: {camp.headline}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        camp.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        camp.status === 'PENDING_REVIEW' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-gray-800 text-gray-400'
                      }`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-emerald-400 font-bold">₹{camp.remainingBudget}</span>
                      <span className="text-gray-500"> / ₹{camp.totalBudget}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{camp.impressions.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono">{camp.clicks}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setShowFundModal(camp)}
                        className="px-3 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded font-medium text-[11px] transition"
                      >
                        Add Budget
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-lg w-full space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Create New Sponsor Campaign</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Q4 Developer Tooling Promotion"
                  className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Advertiser / Company Name (max 30 chars)
                </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={newAdvertiser}
                  onChange={(e) => setNewAdvertiser(e.target.value)}
                  placeholder="e.g. CloudForge AI"
                  className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Status Line Headline (max 80 chars)
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={newHeadline}
                  onChange={(e) => setNewHeadline(e.target.value)}
                  placeholder="e.g. Fast GPU infrastructure built for agent workloads"
                  className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Destination URL (must be valid https://)
                </label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://cloudforge.dev/agents"
                  className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Initial Campaign Budget (INR ₹)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  required
                  className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="p-3 bg-black/40 rounded-lg border border-gray-800 text-[11px] text-gray-400">
                Notice: All new campaigns undergo fast safety review (URL checks & brand verification) before entering the live delivery rotation.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-700 hover:bg-gray-800 text-xs rounded-lg text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-lg"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fund Campaign Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Add Budget to Campaign</h3>
              <button
                onClick={() => setShowFundModal(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {fundSuccess ? (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center font-bold">
                ✓ Payment confirmed! ₹{fundAmount} added to campaign budget.
              </div>
            ) : (
              <form onSubmit={handleFundCampaign} className="space-y-4">
                <div>
                  <span className="text-xs text-gray-400 block mb-1">Target Campaign:</span>
                  <div className="text-sm font-semibold text-white">{showFundModal.name}</div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Top-Up Amount (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    required
                    className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>

                <div className="p-3 bg-black/40 rounded-lg border border-gray-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Gateway:</span>
                    <span className="font-mono text-indigo-400">Razorpay / UPI / NetBanking</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Environment:</span>
                    <span className="font-mono text-emerald-400">Production Ready</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFundModal(null)}
                    className="px-4 py-2 border border-gray-700 hover:bg-gray-800 text-xs rounded-lg text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-lg"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
