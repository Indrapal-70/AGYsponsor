import Link from 'next/link';

export default function ForUsersPage() {
  return (
    <div className="bg-gray-950 text-white min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full uppercase tracking-wider">
            Developer Monetization
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Monetize Your Agent Development Time
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get paid transparently while your Antigravity agent plans, writes code, and runs tests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-3">
            <h3 className="text-lg font-bold text-white">💰 Transparent Revenue Split</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Earn ₹0.20 per qualified exposure whenever your agent is actively working on complex coding tasks. The platform publishes clear reward accounting directly into your personal ledger.
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-3">
            <h3 className="text-lg font-bold text-white">⚡ Zero Interruption or Lag</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              The status line executes asynchronously and fails open in under 2ms. Tool execution, agent streaming, and terminal shortcuts are never delayed or modified.
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-3">
            <h3 className="text-lg font-bold text-white">🔒 Zero Prompt Snooping</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              The plugin does not read or send your user prompts, file paths, conversation logs, or LLM thinking text. Only heartbeat dwell timestamps are communicated.
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-3">
            <h3 className="text-lg font-bold text-white">🏦 Fast Payouts (UPI / Bank)</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Low ₹50 payout threshold. Add your UPI ID (e.g. <code>username@okhdfcbank</code>) or Indian bank account to withdraw your accrued earnings anytime.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Ready to begin?</h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Install the plugin, run your first agent command, and connect your terminal in less than 60 seconds.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/download"
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm text-white transition"
            >
              Get Install Command
            </Link>
            <Link
              href="/connect"
              className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 font-semibold text-sm text-emerald-400 transition"
            >
              Enter Pairing Code
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
