import Link from 'next/link';

export default function ForSponsorsPage() {
  return (
    <div className="bg-gray-950 text-white min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full uppercase tracking-wider">
            Sponsorship & Developer Marketing
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Reach Active AI Developers in Their Flow State
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get your developer tooling, infrastructure, API, or cloud platform in front of engineers while their autonomous agents are executing tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-3">
            <h3 className="text-base font-bold text-white">🎯 High Intent Attention</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Developers watch their terminal status line while the agent plans and writes code. Your one-line message commands 100% focused attention.
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-3">
            <h3 className="text-base font-bold text-white">🛡️ Verified Dwell Verification</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              We charge only for qualified dwell exposures (minimum 5s active agent work) with cryptographic HMAC tokens and anti-fraud validation.
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-3">
            <h3 className="text-base font-bold text-white">📊 Transparent Analytics</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Track impression counts, unique developer installations, click-through rates, and daily budget burn with precision.
            </p>
          </div>
        </div>

        {/* Sponsor Workflow */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">Simple 3-Step Campaign Launch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <span className="text-xs font-mono text-indigo-400 font-bold">STEP 01</span>
              <h4 className="font-semibold text-white">Select a Plan & Fund Budget</h4>
              <p className="text-xs text-gray-400">Choose Starter, Growth, or Custom packages with seamless UPI / Net Banking / Card checkout.</p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono text-purple-400 font-bold">STEP 02</span>
              <h4 className="font-semibold text-white">Submit Ad Creative</h4>
              <p className="text-xs text-gray-400">Specify your company name, concise 80-character headline, and destination landing URL.</p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono text-emerald-400 font-bold">STEP 03</span>
              <h4 className="font-semibold text-white">Admin Approval & Live Rotation</h4>
              <p className="text-xs text-gray-400">Our platform team validates URL safety and approves the campaign for multi-ad rotation across terminals.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            href="/pricing"
            className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm text-white text-center transition"
          >
            View Sponsor Packages
          </Link>
          <Link
            href="/sponsor"
            className="px-8 py-3.5 rounded-xl border border-gray-700 hover:bg-gray-800 font-bold text-sm text-gray-200 text-center transition"
          >
            Access Sponsor Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
