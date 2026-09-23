import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-16 lg:px-8 border-b border-gray-800">
        <div className="mx-auto max-w-4xl py-24 sm:py-32 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-6">
            <span>✨ Native Antigravity CLI Status Line Integration</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            Your agent is thinking. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400">
              Earn while you build.
            </span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
            AgentSponsor displays non-intrusive, verified sponsor lines in your terminal status bar while your agent works. Earn passive revenue with zero prompt snooping.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/download" 
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 transition"
            >
              Install CLI Plugin
            </Link>
            <Link 
              href="/connect" 
              className="rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 px-6 py-3 text-sm font-semibold text-emerald-400 transition"
            >
              Connect Terminal Code
            </Link>
            <Link 
              href="/for-sponsors" 
              className="rounded-lg border border-gray-700 px-6 py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-900 transition"
            >
              For Sponsors →
            </Link>
          </div>
        </div>

        {/* Status Line Terminal Preview */}
        <div className="mx-auto max-w-3xl pb-24">
          <div className="rounded-xl border border-gray-800 bg-gray-900/90 shadow-2xl overflow-hidden font-mono text-xs">
            <div className="px-4 py-3 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="text-gray-500 font-sans text-xs">Antigravity CLI 1.2.7 — Active Session</span>
              <span className="text-emerald-400 font-mono text-xs">● Connected</span>
            </div>
            
            <div className="p-6 space-y-3">
              <div className="text-gray-400">
                <span className="text-emerald-400">user@dev</span>:<span className="text-indigo-400">~/project</span>$ agy "Optimize database query performance"
              </div>
              <div className="text-gray-500 pl-4 border-l border-gray-800 space-y-1">
                <p>Analyzing schema indexes and query execution plans...</p>
                <p>Reading postgres execution statistics (0.42s)</p>
              </div>

              {/* Status bar mock */}
              <div className="mt-6 pt-3 border-t border-gray-800/80 space-y-1 bg-black/40 p-3 rounded">
                <div className="text-gray-400 flex items-center justify-between">
                  <span>Thinking (3.2s) · Tips: Run /help to explore all commands</span>
                  <span className="text-gray-600 text-[10px]">Antigravity CLI</span>
                </div>
                <div className="text-indigo-300 font-medium flex items-center space-x-2">
                  <span className="text-amber-400 font-bold">Sponsored · CloudForge Demo</span>
                  <span className="text-gray-400">—</span>
                  <span className="text-gray-300">Deploy your AI backend in seconds →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Value Pillars */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/40">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Native Status Line UX</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Never interrupts your agent or conversation stream. Renders cleanly beneath built-in Antigravity tips using official status-line APIs.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/40">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Zero-Snoop Guarantee</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              We never collect your prompts, source code, files, or agent thinking output. Only anonymous dwell timestamps are reported.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/40">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Real UPI / Bank Payouts</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Accumulate verified earnings in your immutable ledger. Withdraw directly to your Indian UPI ID or bank account once reaching ₹50 threshold.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
