import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link href="/for-users" className="hover:text-white transition">For Developers</Link></li>
              <li><Link href="/for-sponsors" className="hover:text-white transition">For Sponsors</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing & Packages</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Integration</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/download" className="hover:text-white transition">Install Plugin</Link></li>
              <li><Link href="/connect" className="hover:text-white transition">Pair Terminal</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition">Consumer Dashboard</Link></li>
              <li><Link href="/sponsor" className="hover:text-white transition">Sponsor Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Trust & Safety</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/security" className="hover:text-white transition">Security & Zero-Snoop</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">About</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              AgentSponsor is the non-intrusive monetization and sponsorship platform built for Google Antigravity CLI agents.
            </p>
            <p className="text-xs text-emerald-400 font-mono">
              Status: Production Ready
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} AgentSponsor. All rights reserved.</p>
          <p className="mt-2 md:mt-0 font-mono text-gray-400">
            Private Release MVP · Antigravity CLI 1.2.7 Compatible
          </p>
        </div>
      </div>
    </footer>
  );
}
