'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/supabase/auth-context';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isSponsor, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path || (path !== '/' && pathname?.startsWith(path));
  };

  const navLinks = [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'For Developers', href: '/for-users' },
    { label: 'For Sponsors', href: '/for-sponsors' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Install', href: '/download' },
    { label: 'Connect CLI', href: '/connect' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm tracking-tight text-zinc-100 group-hover:text-white transition-colors">
                  AgentSponsor
                </span>
                <span className="text-[10px] font-mono text-zinc-500 leading-none">
                  Antigravity CLI
                </span>
              </div>
            </Link>

            {/* Desktop Primary Nav Links */}
            <div className="hidden lg:flex items-center space-x-1 pl-4 border-l border-zinc-800/80">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/dashboard"
              className={`text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                isActive('/dashboard')
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/sponsor"
              className={`text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                isActive('/sponsor')
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 font-semibold'
                  : isSponsor
                  ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              {isSponsor ? '★ Sponsor Portal' : 'Sponsor Portal'}
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-[11px] font-mono font-medium text-amber-400/90 hover:text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg bg-amber-500/10 transition-colors"
              >
                Admin
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-zinc-800">
                <span className="text-[11px] font-mono text-zinc-400 max-w-[120px] truncate" title={user.email}>
                  {user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-zinc-400 hover:text-rose-400 px-2 py-1 rounded hover:bg-zinc-800/80 transition-colors font-mono"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-xs font-medium text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800/80 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98]"
                >
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/download"
              className="bg-emerald-500 text-zinc-950 px-2.5 py-1 rounded-md text-xs font-semibold"
            >
              Install
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 focus:outline-none"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#09090b] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-xs font-medium ${
                  isActive(link.href)
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-zinc-300 hover:bg-zinc-800/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap gap-2 text-xs">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
            >
              Dashboard
            </Link>
            <Link
              href="/sponsor"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400"
            >
              Sponsor Portal
            </Link>
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400"
              >
                Sign Out ({user.email})
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded bg-zinc-800 text-white"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded bg-emerald-500 text-zinc-950 font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
