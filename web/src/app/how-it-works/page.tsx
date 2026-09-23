import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="bg-gray-950 text-white min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            How AgentSponsor Works
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A privacy-first, non-intrusive revenue loop bridging AI developers and reputable developer tools.
          </p>
        </div>

        {/* 4-Step Diagram */}
        <div className="space-y-8">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 flex flex-col md:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shrink-0 text-lg">
              1
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white">One-Line Public CLI Install</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Developers run a public curl/powershell command that verifies package integrity and registers the lightweight hook plugin into <code>~/.gemini/config/plugins/agentsponsor</code>. No git repository access or access tokens are needed.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 flex flex-col md:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold shrink-0 text-lg">
              2
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white">Non-Intrusive Status Line Rendering</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Using Antigravity CLI's native <code>statusLine</code> configuration (with <code>stack_with_default: true</code>), a sponsored single line renders beneath built-in tips exclusively during active agent states (<code>thinking</code>, <code>working</code>, <code>tool_use</code>). When idle, the line automatically vanishes.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 flex flex-col md:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0 text-lg">
              3
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white">Cryptographically Qualified Exposures</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                The server issues signed HMAC exposure tokens. When active dwell time meets the required duration (minimum 5 seconds), a qualified exposure is verified, deduplicated, and attributed to the campaign spend and developer ledger.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 flex flex-col md:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0 text-lg">
              4
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white">Immutable Ledger & Direct Payouts</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Earnings are accrued into an append-only database ledger. Developers can withdraw directly to their Indian UPI ID or Bank Account once their balance exceeds ₹50.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-10 text-center">
          <Link
            href="/download"
            className="inline-block px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 font-bold text-sm text-white rounded-xl shadow-lg transition"
          >
            Get Started Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
