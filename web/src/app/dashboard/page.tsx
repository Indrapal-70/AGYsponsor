'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PageShell,
  TechnicalEyebrow,
  MetricDisplay,
  StatusIndicator,
  MotionWrapper,
} from '@/components/primitives';

interface PayoutAccount {
  type: 'UPI' | 'BANK_TRANSFER';
  identifier: string;
  holderName: string;
  isVerified: boolean;
}

export default function ConsumerDashboard() {
  const [balance, setBalance] = useState({
    available: 124.8,
    pending: 18.4,
    totalEarned: 342.2,
    paidOut: 199.0,
  });

  const [payoutAccount, setPayoutAccount] = useState<PayoutAccount>({
    type: 'UPI',
    identifier: 'developer@okhdfcbank',
    holderName: 'Indrapal Singh',
    isVerified: true,
  });

  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [newAccountType, setNewAccountType] = useState<'UPI' | 'BANK_TRANSFER'>('UPI');
  const [newIdentifier, setNewIdentifier] = useState('');
  const [newHolderName, setNewHolderName] = useState('');

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('100');
  const [payoutStatus, setPayoutStatus] = useState<string | null>(null);

  const [installations, setInstallations] = useState([
    {
      id: 'inst_01',
      uuid: '9f8b2c41-7a13-4c99-b1d5-22a843ef9910',
      deviceName: 'Main WSL2 Workstation',
      os: 'Linux (WSL2 Ubuntu 24.04)',
      version: '1.0.0',
      status: 'ACTIVE',
      lastSeen: '2 minutes ago',
    },
    {
      id: 'inst_02',
      uuid: '1e4a7d90-33b1-4f81-992a-bbd6174a88f2',
      deviceName: 'MacBook Air M2',
      os: 'macOS Sonoma 14.5',
      version: '1.0.0',
      status: 'ACTIVE',
      lastSeen: 'Yesterday',
    },
  ]);

  const [ledgerEntries, setLedgerEntries] = useState([
    {
      id: 'ledg_001',
      date: '2026-09-23 22:45',
      campaign: 'CloudForge Demo',
      type: 'EXPOSURE_REWARD',
      amount: '+₹0.20',
      status: 'AVAILABLE',
    },
    {
      id: 'ledg_002',
      date: '2026-09-23 22:40',
      campaign: 'VectorScale AI',
      type: 'EXPOSURE_REWARD',
      amount: '+₹0.20',
      status: 'AVAILABLE',
    },
    {
      id: 'ledg_003',
      date: '2026-09-23 21:15',
      campaign: 'PromptShield',
      type: 'EXPOSURE_REWARD',
      amount: '+₹0.20',
      status: 'AVAILABLE',
    },
    {
      id: 'ledg_004',
      date: '2026-09-21 14:00',
      campaign: 'Platform Withdrawal',
      type: 'PAYOUT_COMPLETED',
      amount: '-₹199.00',
      status: 'PAID',
    },
  ]);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdentifier.trim()) return;

    setPayoutAccount({
      type: newAccountType,
      identifier: newIdentifier.trim(),
      holderName: newHolderName.trim() || 'Account Holder',
      isVerified: true,
    });
    setIsEditingAccount(false);
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payoutAmount);
    if (isNaN(amountNum) || amountNum < 50) {
      alert('Minimum withdrawal threshold is ₹50.00');
      return;
    }
    if (amountNum > balance.available) {
      alert('Requested amount exceeds available balance.');
      return;
    }

    setBalance((prev) => ({
      ...prev,
      available: parseFloat((prev.available - amountNum).toFixed(2)),
    }));

    setLedgerEntries((prev) => [
      {
        id: `ledg_${Date.now()}`,
        date: 'Just now',
        campaign: `Withdrawal to ${payoutAccount.identifier}`,
        type: 'PAYOUT_RESERVATION',
        amount: `-₹${amountNum.toFixed(2)}`,
        status: 'PENDING',
      },
      ...prev,
    ]);

    setPayoutStatus(`Payout of ₹${amountNum.toFixed(2)} requested successfully! Processing via ${payoutAccount.type}.`);
    setTimeout(() => {
      setShowPayoutModal(false);
      setPayoutStatus(null);
    }, 2000);
  };

  return (
    <PageShell maxWidth="7xl">
      <MotionWrapper>
        {/* Top Operational Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/80 pb-6 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <TechnicalEyebrow variant="emerald">Developer Console</TechnicalEyebrow>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                Earnings & Installations
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Live ledger accounting, verified dwell rewards, and direct Indian UPI rails.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/connect"
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-mono font-medium rounded-lg transition-all"
            >
              + Pair New Terminal
            </Link>
            <button
              onClick={() => setShowPayoutModal(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98]"
            >
              Request Withdrawal →
            </button>
          </div>
        </div>
      </MotionWrapper>

      {/* 4 Key Metrics */}
      <MotionWrapper delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <MetricDisplay
            label="Available Balance"
            value={`₹${balance.available.toFixed(2)}`}
            subtext="Ready for instant payout (min ₹50)"
            variant="emerald"
            badge="Liquid"
          />
          <MetricDisplay
            label="Pending Verification"
            value={`₹${balance.pending.toFixed(2)}`}
            subtext="Awaiting anti-fraud dwell confirmation"
            badge="Dwell Pending"
          />
          <MetricDisplay
            label="Gross Lifetime Earned"
            value={`₹${balance.totalEarned.toFixed(2)}`}
            subtext="Cumulative gross developer share"
          />
          <MetricDisplay
            label="Disbursed to UPI / Bank"
            value={`₹${balance.paidOut.toFixed(2)}`}
            subtext="Successfully transferred to destination"
          />
        </div>
      </MotionWrapper>

      {/* Payout Destination Setting Card */}
      <MotionWrapper delay={0.2}>
        <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                ₹
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Payout Destination (India Rails)</h3>
                <p className="text-xs text-zinc-400">Withdrawals are transferred directly to this verified endpoint</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditingAccount(!isEditingAccount)}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 font-medium"
            >
              {isEditingAccount ? 'Cancel' : 'Edit Account'}
            </button>
          </div>

          {isEditingAccount ? (
            <form onSubmit={handleSaveAccount} className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-800">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Account Type</label>
                <select
                  value={newAccountType}
                  onChange={(e) => setNewAccountType(e.target.value as any)}
                  className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="UPI">UPI (VPA)</option>
                  <option value="BANK_TRANSFER">Bank Account (IFSC:Acc)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  {newAccountType === 'UPI' ? 'UPI ID (e.g. name@okhdfcbank)' : 'IFSC:Account'}
                </label>
                <input
                  type="text"
                  required
                  value={newIdentifier}
                  onChange={(e) => setNewIdentifier(e.target.value)}
                  placeholder={newAccountType === 'UPI' ? 'user@upi' : 'HDFC0001234:5010023456789'}
                  className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-end gap-2">
                <input
                  type="text"
                  value={newHolderName}
                  onChange={(e) => setNewHolderName(e.target.value)}
                  placeholder="Account Holder Name"
                  className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg whitespace-nowrap"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between bg-black/70 p-3.5 rounded-xl border border-zinc-800/90 text-xs font-mono">
              <div className="flex items-center space-x-3">
                <span className="bg-zinc-800 text-emerald-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-emerald-500/20">
                  {payoutAccount.type}
                </span>
                <span className="text-white font-semibold">{payoutAccount.identifier}</span>
                <span className="text-zinc-500 font-sans">({payoutAccount.holderName})</span>
              </div>
              <StatusIndicator label="Verified Endpoint" variant="emerald" />
            </div>
          )}
        </div>
      </MotionWrapper>

      {/* Linked Installations Table */}
      <MotionWrapper delay={0.3}>
        <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] overflow-hidden mb-8 shadow-lg">
          <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-white">Linked Terminal Installations</h3>
              <p className="text-xs text-zinc-400">Antigravity CLI instances generating dwell telemetry</p>
            </div>
            <Link href="/connect" className="text-xs font-mono text-emerald-400 hover:text-emerald-300 font-medium">
              + Pair Another Device
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#111114] text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4 font-sans font-semibold">Device Name</th>
                  <th className="py-3 px-4">UUID</th>
                  <th className="py-3 px-4 font-sans font-semibold">Platform</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 font-sans font-semibold">Last Seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {installations.map((inst) => (
                  <tr key={inst.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-medium text-white">{inst.deviceName}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{inst.uuid.substring(0, 18)}...</td>
                    <td className="py-3.5 px-4 font-sans text-zinc-300">{inst.os}</td>
                    <td className="py-3.5 px-4 text-emerald-400">{inst.version}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {inst.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-zinc-400">{inst.lastSeen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </MotionWrapper>

      {/* Immutable Earnings Ledger Table */}
      <MotionWrapper delay={0.4}>
        <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] overflow-hidden mb-12 shadow-lg">
          <div className="p-5 border-b border-zinc-800">
            <h3 className="text-sm font-semibold text-white">Immutable Earnings Ledger</h3>
            <p className="text-xs text-zinc-400">Append-only audit trail of exposures, credits, and withdrawals</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#111114] text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 font-sans font-semibold">Campaign / Activity</th>
                  <th className="py-3 px-4">Entry Type</th>
                  <th className="py-3 px-4">Amount (INR)</th>
                  <th className="py-3 px-4">Ledger Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {ledgerEntries.map((row) => (
                  <tr key={row.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3.5 px-4 text-zinc-400">{row.date}</td>
                    <td className="py-3.5 px-4 font-sans font-medium text-white">{row.campaign}</td>
                    <td className="py-3.5 px-4 text-[11px] text-zinc-400">{row.type}</td>
                    <td
                      className={`py-3.5 px-4 font-bold ${
                        row.amount.startsWith('+') ? 'text-emerald-400' : 'text-zinc-300'
                      }`}
                    >
                      {row.amount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.status === 'AVAILABLE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : row.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </MotionWrapper>

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-white">Request Payout Disbursement</h3>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="text-zinc-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            {payoutStatus ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                {payoutStatus}
              </div>
            ) : (
              <form onSubmit={handleRequestPayout} className="space-y-4">
                <div>
                  <span className="block text-xs font-mono text-zinc-400 mb-1">Available Balance</span>
                  <div className="text-2xl font-semibold text-emerald-400">
                    ₹{balance.available.toFixed(2)}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    Withdrawal Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max={balance.available}
                    step="0.01"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    required
                    className="w-full bg-black/80 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <p className="text-[11px] text-zinc-500 font-mono mt-1">Minimum withdrawal threshold: ₹50.00</p>
                </div>

                <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 text-xs space-y-1 font-mono">
                  <span className="text-zinc-500 uppercase text-[10px]">Destination:</span>
                  <div className="text-white">
                    {payoutAccount.type}: {payoutAccount.identifier}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 text-xs rounded-lg text-zinc-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={balance.available < 50}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-semibold text-xs rounded-lg shadow-sm transition-all"
                  >
                    Confirm & Transfer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </PageShell>
  );
}
