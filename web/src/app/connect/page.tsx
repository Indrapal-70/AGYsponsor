'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ConnectForm() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [code, setCode] = useState(initialCode);
  const [deviceName, setDeviceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; uuid?: string } | null>(null);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode.toUpperCase());
    }
  }, [initialCode]);

  const handlePairing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/v1/installations/pair/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pairing_code: code.trim(),
          device_name: deviceName.trim() || 'My Developer Machine'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult({
          success: true,
          message: data.message || 'Installation linked successfully!',
          uuid: data.installation_uuid
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to claim pairing code. Please verify the code and try again.'
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'Network error occurred while connecting.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-8 shadow-xl">
      {result?.success ? (
        <div className="space-y-6 text-center">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-xl font-bold">
            ✓
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Installation Linked!</h2>
            <p className="text-sm text-gray-400 mt-2">
              Your Antigravity CLI client is now securely connected to your account.
            </p>
            {result.uuid && (
              <p className="mt-2 text-xs font-mono text-gray-500 bg-black/40 py-1.5 px-3 rounded inline-block">
                UUID: {result.uuid}
              </p>
            )}
          </div>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm text-white transition"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={() => { setResult(null); setCode(''); }}
              className="px-6 py-2.5 rounded-lg border border-gray-700 hover:bg-gray-800 text-sm text-gray-300 transition"
            >
              Pair Another Device
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePairing} className="space-y-6">
          {result?.success === false && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {result.message}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Pairing Code (from terminal)
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. 8F4K-92JD"
              maxLength={12}
              required
              className="w-full bg-black/60 border border-gray-700 rounded-lg px-4 py-3 font-mono text-center text-xl tracking-widest text-indigo-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              This code was printed in your terminal after running <code>install.sh</code>.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Device Name (Optional)
            </label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="e.g. Workstation WSL2, Laptop M3"
              className="w-full bg-black/60 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold py-3 rounded-lg text-sm transition"
          >
            {loading ? 'Verifying & Linking...' : 'Connect This Installation'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ConnectPage() {
  return (
    <div className="bg-gray-950 text-white min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Connect CLI Installation
          </h1>
          <p className="text-gray-400 text-sm">
            Enter the one-time code generated by your terminal to link your client and start collecting exposure earnings.
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-gray-500">Loading pairing interface...</div>}>
          <ConnectForm />
        </Suspense>

        <div className="text-center text-xs text-gray-500">
          Haven't installed the CLI plugin yet?{' '}
          <Link href="/download" className="text-indigo-400 hover:underline">
            View installation instructions
          </Link>
        </div>
      </div>
    </div>
  );
}
