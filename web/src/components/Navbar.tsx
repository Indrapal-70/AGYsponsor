'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isLinkActive = (path: string) => {
    return pathname === path || (path !== '/' && pathname?.startsWith(path));
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-950 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 font-black text-xl tracking-tight text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AgentSponsor</span>
            </Link>

            <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-300">
              <Link 
                href="/how-it-works" 
                className={`hover:text-white transition-colors ${isLinkActive('/how-it-works') ? 'text-indigo-400 font-semibold' : ''}`}
              >
                How It Works
              </Link>
              <Link 
                href="/for-users" 
                className={`hover:text-white transition-colors ${isLinkActive('/for-users') ? 'text-indigo-400 font-semibold' : ''}`}
              >
                For Developers
              </Link>
              <Link 
                href="/for-sponsors" 
                className={`hover:text-white transition-colors ${isLinkActive('/for-sponsors') ? 'text-indigo-400 font-semibold' : ''}`}
              >
                For Sponsors
              </Link>
              <Link 
                href="/pricing" 
                className={`hover:text-white transition-colors ${isLinkActive('/pricing') ? 'text-indigo-400 font-semibold' : ''}`}
              >
                Pricing
              </Link>
              <Link 
                href="/download" 
                className={`hover:text-white transition-colors ${isLinkActive('/download') ? 'text-indigo-400 font-semibold' : ''}`}
              >
                Install
              </Link>
              <Link 
                href="/connect" 
                className={`hover:text-white transition-colors ${isLinkActive('/connect') ? 'text-emerald-400 font-semibold' : ''}`}
              >
                Connect CLI
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-sm">
            <Link 
              href="/dashboard" 
              className="hidden lg:inline-flex text-gray-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-800"
            >
              Consumer
            </Link>
            <Link 
              href="/sponsor" 
              className="hidden lg:inline-flex text-gray-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-800"
            >
              Sponsor Portal
            </Link>
            <Link 
              href="/admin" 
              className="text-xs text-amber-400 hover:text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded bg-amber-500/10"
            >
              Admin
            </Link>
            <Link 
              href="/login" 
              className="text-gray-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-800 font-medium"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md font-medium shadow-sm transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
