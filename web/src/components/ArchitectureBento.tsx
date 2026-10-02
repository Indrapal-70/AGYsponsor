'use client';

export default function ArchitectureBento() {
  return (
    <section className="py-16 md:py-24 bg-[#09090b] border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Core Engineering</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
            Built on Cryptographic Verification & Fail-Open Rails
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Every layer of AgentSponsor protects your terminal responsiveness, developer privacy, and ledger integrity.
          </p>
        </div>

        {/* Bento Grid (Asymmetric 3-column layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Tile 1: Zero-Snoop Guarantee (Col Span 2) */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-7 flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-sm font-bold">
                01
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  Zero-Snoop Cryptographic Dwell Verification
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  We never read, store, or transmit your prompts, file paths, codebase tokens, or model reasoning traces. The plugin only emits anonymized dwell timestamps verified with signed HMAC tokens once active execution crosses the 5-second threshold.
                </p>
              </div>
            </div>

            {/* Visual Token Card */}
            <div className="mt-6 p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 font-mono text-[11px] text-zinc-400 space-y-1.5">
              <div className="flex items-center justify-between text-zinc-500 text-[10px] pb-1 border-b border-zinc-800/60">
                <span>QUALIFIED_EXPOSURE_PAYLOAD</span>
                <span className="text-emerald-400 font-semibold">HMAC_SHA256_VERIFIED</span>
              </div>
              <div className="text-zinc-300">
                <span className="text-zinc-500">payload:</span> {`{"dwell": 6.8, "min_req": 5.0, "state": "working"}`}
              </div>
              <div className="text-zinc-500 truncate">
                <span className="text-zinc-500">signature:</span> f84b9e2...0d8a17c (server-signed)
              </div>
            </div>
          </div>

          {/* Tile 2: Sub-2ms Fail-Open (Col Span 1) */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-7 flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-zinc-200 font-mono text-sm font-bold">
                02
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">
                  Sub-2ms Fail-Open Architecture
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  If the network or backend is unreachable, the plugin exits in under 2 milliseconds with zero output. Terminal commands, tool calls, and model streams never stall.
                </p>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-black/60 border border-zinc-800/80 font-mono text-[11px] text-zinc-400">
              <div className="flex justify-between items-center text-emerald-400 font-semibold">
                <span>Worst-Case Exit:</span>
                <span>&lt; 2.0ms</span>
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">
                Zero agent blocking, zero CLI disruption
              </div>
            </div>
          </div>

          {/* Tile 3: Append-Only Immutable Ledger (Col Span 1) */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-7 flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-zinc-200 font-mono text-sm font-bold">
                03
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">
                  Immutable Append-Only Ledger
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Every exposure earns ₹0.20 credited directly into an immutable PostgreSQL ledger. Balances are synchronized atomically with full audit history.
                </p>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-black/60 border border-zinc-800/80 font-mono text-[11px] text-zinc-400">
              <div className="flex justify-between items-center text-emerald-400 font-semibold">
                <span>Exposure Rate:</span>
                <span>₹0.20 / qualified</span>
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">
                Atomic sync_earnings_balances trigger
              </div>
            </div>
          </div>

          {/* Tile 4: Indian Payment & Payout Rails (Col Span 2) */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-7 flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-sm font-bold">
                04
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  Native UPI & Bank Account Payout Rails
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Low ₹50 minimum payout threshold. Developers withdraw directly to Indian UPI VPA addresses or bank accounts. Sponsors fund campaigns via UPI, Net Banking, and Cards.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-black/60 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-500 uppercase">Payout Threshold</div>
                <div className="text-emerald-400 font-semibold text-sm mt-0.5">₹50 Minimum</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Instant UPI / Bank Transfer</div>
              </div>
              <div className="p-3 rounded-xl bg-black/60 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-500 uppercase">Sponsor Checkout</div>
                <div className="text-zinc-200 font-semibold text-sm mt-0.5">Razorpay Rails</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">UPI, Cards, Corporate Net Banking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
