import Link from 'next/link';

export default function SecurityPage() {
  return (
    <div className="bg-gray-950 text-white min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full uppercase tracking-wider">
            Trust & Security Architecture
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Zero-Snoop Security Architecture
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Engineered from first principles to ensure your code, prompts, thinking traces, and environment stay completely private.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-emerald-400">🛡️</span>
              <span>1. Zero Access to Prompts or Source Code</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              The AgentSponsor plugin only executes via Antigravity's lightweight hook events (<code>PreInvocation</code>, <code>Stop</code>) and the standard <code>statusLine</code> process command. It receives metadata strictly about whether the agent is active or idle. It has zero capability or permission to parse your workspace files, git diffs, model prompt strings, or completion tokens.
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-emerald-400">⚡</span>
              <span>2. Fail-Open by Design</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              If the AgentSponsor API is ever unreachable, network requests timeout, or DNS fails, the plugin catches all exceptions and exits with code 0 immediately. It never throws errors in your terminal, never stalls an agent tool call, and never prevents you from completing your work.
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-emerald-400">🔑</span>
              <span>3. Signed HMAC Exposure Tokens</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              To prevent spoofing and fraudulent impression spam, ad exposures are governed by server-signed HMAC tokens with 1-hour expiration. Each qualified impression requires verified active dwell duration before any reward is ledgered.
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-emerald-400">🔒</span>
              <span>4. Private Source Repository & Verified Releases</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Source code is maintained in an audited, private repository. Releases are bundled and served with cryptographically published SHA-256 checksums, ensuring consumers install only tamper-proof binaries.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex justify-between items-center text-xs text-gray-500">
          <span>Security questions or vulnerability reports?</span>
          <Link href="mailto:security@agentsponsor.com" className="text-indigo-400 hover:underline">
            security@agentsponsor.com
          </Link>
        </div>
      </div>
    </div>
  );
}
