import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative z-20 bg-[#09090b] border-t border-zinc-800/80 text-zinc-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/how-it-works" className="hover:text-zinc-100 transition-colors">How It Works</Link></li>
              <li><Link href="/for-users" className="hover:text-zinc-100 transition-colors">For Developers</Link></li>
              <li><Link href="/for-sponsors" className="hover:text-zinc-100 transition-colors">For Sponsors</Link></li>
              <li><Link href="/pricing" className="hover:text-zinc-100 transition-colors">Pricing & Packages</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-4">Integration</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/download" className="hover:text-zinc-100 transition-colors">Install Plugin</Link></li>
              <li><Link href="/connect" className="hover:text-zinc-100 transition-colors">Pair Terminal</Link></li>
              <li><Link href="/dashboard" className="hover:text-zinc-100 transition-colors">Consumer Dashboard</Link></li>
              <li><Link href="/sponsor" className="hover:text-zinc-100 transition-colors">Sponsor Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-4">Trust & Security</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/privacy" className="hover:text-zinc-100 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-zinc-100 transition-colors">Terms of Service</Link></li>
              <li><Link href="/security" className="hover:text-zinc-100 transition-colors">Security & Zero-Snoop</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-4">About</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Non-intrusive monetization and sponsorship platform built for Google Antigravity CLI agents.
            </p>
            <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Antigravity 1.2.7 & 2.0 Compatible</span>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800/60 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-400 gap-2">
          <p>&copy; {new Date().getFullYear()} AgentSponsor. All rights reserved.</p>
          <p className="font-mono text-zinc-400">
            Fail-Open Sub-2ms · Zero Prompt Snooping · Real UPI Rails
          </p>
        </div>
      </div>
    </footer>
  );
}

