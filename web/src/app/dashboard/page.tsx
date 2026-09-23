'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PayoutAccount {
  type: 'UPI' | 'BANK_TRANSFER';
  identifier: string;
  holderName: string;
  isVerified: boolean;
}

export default function ConsumerDashboard() {
  // State for balances (derived from immutable ledger)
  const [balance, setBalance] = useState({
    available: 124.80,
    pending: 18.40,
    totalEarned: 342.20,
    paidOut: 199.00
  });

  // State for payout account
  const [payoutAccount, setPayoutAccount] = useState<PayoutAccount>({
    type: 'UPI',
    identifier: 'developer@okhdfcbank',
    holderName: 'Indrapal Singh',
    isVerified: true
  });

  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [newAccountType, setNewAccountType] = useState<'UPI' | 'BANK_TRANSFER'>('UPI');
  const [newIdentifier, setNewIdentifier] = useState('');
  const [newHolderName, setNewHolderName] = useState('');

  // Payout request modal state
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('100');
  const [payoutStatus, setPayoutStatus] = useState<string | null>(null);

  // Installations
  const [installations, setInstallations] = useState([
    {
      id: 'inst_01',
      uuid: '9f8b2c41-7a13-4c99-b1d5-22a843ef9910',
      deviceName: 'Main WSL2 Workstation',
      os: 'Linux (WSL2 Ubuntu 24.04)',
      version: '1.0.0',
      status: 'ACTIVE',
      lastSeen: '2 minutes ago'
    },
    {
      id: 'inst_02',
      uuid: '1e4a7d90-33b1-4f81-992a-bbd6174a88f2',
      deviceName: 'MacBook Air M2',
      os: 'macOS Sonoma 14.5',
      version: '1.0.0',
      status: 'ACTIVE',
      lastSeen: 'Yesterday'
    }
  ]);

  // Ledger history
  const [ledgerEntries, setLedgerEntries] = useState([
    {
      id: 'ledg_001',
      date: '2026-09-23 22:45',
      campaign: 'CloudForge Demo',
      type: 'EXPOSURE_REWARD',
      amount: '+₹0.20',
      status: 'AVAILABLE'
    },
    {
      id: 'ledg_002',
      date: '2026-09-23 22:40',
      campaign: 'VectorScale AI',
      type: 'EXPOSURE_REWARD',
      amount: '+₹0.20',
      status: 'AVAILABLE'
    },
    {
      id: 'ledg_003',
      date: '2026-09-23 21:15',
      campaign: 'PromptShield',
      type: 'EXPOSURE_REWARD',
      amount: '+₹0.20',
      status: 'AVAILABLE'
    },
    {
      id: 'ledg_004',
      date: '2026-09-21 14:00',
      campaign: 'Platform Withdrawal',
      type: 'PAYOUT_COMPLETED',
      amount: '-₹199.00',
      status: 'PAID'
    }
  ]);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdentifier.trim()) return;

    setPayoutAccount({
      type: newAccountType,
      identifier: newIdentifier.trim(),
      holderName: newHolderName.trim() || 'Account Holder',
      isVerified: true
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

    // Deduct available balance and add ledger entry
    setBalance(prev => ({
      ...prev,
      available: parseFloat((prev.available - amountNum).toFixed(2))
    }));

    setLedgerEntries(prev => [
      {
        id: `ledg_${Date.now()}`,
        date: 'Just now',
        campaign: `Withdrawal to ${payoutAccount.identifier}`,
        type: 'PAYOUT_RESERVATION',
        amount: `-₹${amountNum.toFixed(2)}`,
        status: 'PENDING'
      },
      ...prev
    ]);

    setPayoutStatus(`Payout of ₹${amountNum.toFixed(2)} requested successfully! Processing via ${payoutAccount.type}.`);
    setTimeout(() => {
      setShowPayoutModal(false);
      setPayoutStatus(null);
    }, 2000);
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Consumer Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">
              Live earnings ledger, paired CLI installations, and India UPI/Bank payouts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/connect"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold rounded-lg transition"
            >
              + Pair New Terminal
            </Link>
            <button
              onClick={() => setShowPayoutModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg transition"
            >
              Request Withdrawal
            </button>
          </div>
        </div>

        {/* 4 Financial Metrics (Derived from Ledger) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Available Balance</span>
            <div className="text-3xl font-extrabold text-emerald-400">
              ₹{balance.available.toFixed(2)}
            </div>
            <p className="text-[11px] text-gray-500">Ready for instant payout (min ₹50)</p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Balance</span>
            <div className="text-3xl font-extrabold text-amber-400">
              ₹{balance.pending.toFixed(2)}
            </div>
            <p className="text-[11px] text-gray-500">Awaiting anti-fraud dwell verification</p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Earned</span>
            <div className="text-3xl font-extrabold text-white">
              ₹{balance.totalEarned.toFixed(2)}
            </div>
            <p className="text-[11px] text-gray-500">Lifetime gross developer share</p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Paid Out</span>
            <div className="text-3xl font-extrabold text-indigo-400">
              ₹{balance.paidOut.toFixed(2)}
            </div>
            <p className="text-[11px] text-gray-500">Successfully disbursed to UPI/Bank</p>
          </div>
        </div>

        {/* Payout Destination Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                ₹
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Payout Destination (India)</h3>
                <p className="text-xs text-gray-400">Withdrawals are processed directly to this destination</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditingAccount(!isEditingAccount)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {isEditingAccount ? 'Cancel' : 'Change Account'}
            </button>
          </div>

          {isEditingAccount ? (
            <form onSubmit={handleSaveAccount} className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-800">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Account Type</label>
                <select
                  value={newAccountType}
                  onChange={(e) => setNewAccountType(e.target.value as any)}
                  className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="UPI">UPI (VPA)</option>
                  <option value="BANK_TRANSFER">Bank Account (IFSC:Acc)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  {newAccountType === 'UPI' ? 'UPI ID (e.g. name@okhdfcbank)' : 'IFSC:Account (e.g. HDFC0001:12345)'}
                </label>
                <input
                  type="text"
                  required
                  value={newIdentifier}
                  onChange={(e) => setNewIdentifier(e.target.value)}
                  placeholder={newAccountType === 'UPI' ? 'user@upi' : 'HDFC0001234:5010023456789'}
                  className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex items-end gap-2">
                <input
                  type="text"
                  value={newHolderName}
                  onChange={(e) => setNewHolderName(e.target.value)}
                  placeholder="Account Holder Name"
                  className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-black font-bold text-xs rounded-lg whitespace-nowrap"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-gray-800 text-xs">
              <div className="flex items-center space-x-3">
                <span className="font-mono bg-gray-800 text-indigo-300 px-2 py-0.5 rounded uppercase text-[10px]">
                  {payoutAccount.type}
                </span>
                <span className="font-mono text-white">{payoutAccount.identifier}</span>
                <span className="text-gray-500">({payoutAccount.holderName})</span>
              </div>
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <span>✓</span>
                <span>Verified</span>
              </span>
            </div>
          )}
        </div>

        {/* Linked Installations Table */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
          <div className="p-5 border-b border-gray-800 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white">Linked Installations</h3>
              <p className="text-xs text-gray-400">Antigravity CLI instances paired to this account</p>
            </div>
            <Link
              href="/connect"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              + Pair Another Device
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4">Device Name</th>
                  <th className="py-3 px-4">UUID</th>
                  <th className="py-3 px-4">Platform / OS</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {installations.map((inst) => (
                  <tr key={inst.id} className="hover:bg-gray-800/20">
                    <td className="py-3.5 px-4 font-semibold text-white">{inst.deviceName}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-400">{inst.uuid.substring(0, 18)}...</td>
                    <td className="py-3.5 px-4">{inst.os}</td>
                    <td className="py-3.5 px-4 font-mono">{inst.version}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {inst.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">{inst.lastSeen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Immutable Earnings Ledger Table */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
          <div className="p-5 border-b border-gray-800">
            <h3 className="text-base font-bold text-white">Immutable Earnings Ledger</h3>
            <p className="text-xs text-gray-400">Append-only audit trail of exposures, credits, and withdrawals</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Campaign / Note</th>
                  <th className="py-3 px-4">Entry Type</th>
                  <th className="py-3 px-4">Amount (INR)</th>
                  <th className="py-3 px-4">Ledger Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {ledgerEntries.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-800/20">
                    <td className="py-3.5 px-4 text-gray-400 font-mono">{row.date}</td>
                    <td className="py-3.5 px-4 font-medium text-white">{row.campaign}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400">{row.type}</td>
                    <td className={`py-3.5 px-4 font-bold font-mono ${row.amount.startsWith('+') ? 'text-emerald-400' : 'text-indigo-400'}`}>
                      {row.amount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400' :
                        row.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Request Payout</h3>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {payoutStatus ? (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                {payoutStatus}
              </div>
            ) : (
              <form onSubmit={handleRequestPayout} className="space-y-4">
                <div>
                  <span className="block text-xs text-gray-400 mb-1">Available for Withdrawal</span>
                  <div className="text-2xl font-extrabold text-emerald-400">
                    ₹{balance.available.toFixed(2)}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
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
                    className="w-full bg-black/60 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Minimum withdrawal: ₹50.00</p>
                </div>

                <div className="p-3 bg-black/40 rounded-lg border border-gray-800 text-xs space-y-1">
                  <span className="text-gray-400">Destination:</span>
                  <div className="font-mono text-white">
                    {payoutAccount.type}: {payoutAccount.identifier}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    className="px-4 py-2 border border-gray-700 hover:bg-gray-800 text-xs rounded-lg text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={balance.available < 50}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold text-xs rounded-lg"
                  >
                    Confirm & Disburse
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
