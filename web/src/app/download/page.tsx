import Link from 'next/link';

export default function DownloadPage() {
  return (
    <div className="bg-gray-950 text-white min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full uppercase tracking-wider">
            Public Release v1.0.0
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Install AgentSponsor Plugin
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Install directly into your Antigravity CLI environment in seconds. No GitHub access, developer tokens, or repository cloning required.
          </p>
        </div>

        {/* Linux / macOS / WSL */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Linux / macOS / WSL2</span>
            </h2>
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">bash / zsh</span>
          </div>
          <div className="bg-black/60 rounded-lg p-4 font-mono text-sm text-indigo-300 border border-gray-800 flex items-center justify-between overflow-x-auto">
            <code>curl -sSL https://agentsponsor.com/install.sh | bash</code>
          </div>
          <p className="text-xs text-gray-500">
            Downloads packaged release archive, verifies SHA-256 checksum, unpacks to ~/.gemini/config/plugins/agentsponsor, and configures statusLine.
          </p>
        </div>

        {/* Windows PowerShell */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Windows</span>
            </h2>
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">PowerShell</span>
          </div>
          <div className="bg-black/60 rounded-lg p-4 font-mono text-sm text-emerald-300 border border-gray-800 flex items-center justify-between overflow-x-auto">
            <code>irm https://agentsponsor.com/install.ps1 | iex</code>
          </div>
          <p className="text-xs text-gray-500">
            Native Windows installation supporting PowerShell 5.1+ and PowerShell Core.
          </p>
        </div>

        {/* Pairing notice */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-emerald-300">Have your 8-character pairing code?</h3>
            <p className="text-xs text-gray-400 mt-1">
              Your terminal will display a short code (e.g. <code>8F4K-92JD</code>) upon install. Link it to your account to track earnings.
            </p>
          </div>
          <Link
            href="/connect"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs rounded-lg transition whitespace-nowrap"
          >
            Pair Installation →
          </Link>
        </div>

        {/* Verification and Security specs */}
        <div className="border-t border-gray-800 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-400">
          <div>
            <span className="font-semibold text-gray-200">Release Integrity:</span>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Checksum: SHA-256 automated verification</li>
              <li>Payload size: &lt; 50 KB bundled</li>
              <li>Node runtime: 18.x or 20.x or 22.x</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-gray-200">Antigravity Compatibility:</span>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Antigravity CLI: 1.0.0 through 1.2.7+</li>
              <li>Status line mode: <code>stack_with_default: true</code></li>
              <li>Fail-open: Zero disruption if backend is offline</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
