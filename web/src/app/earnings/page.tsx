'use client';
import { useState } from 'react';

export default function Earnings() {
  const [requesting, setRequesting] = useState(false);

  const handlePayout = () => {
    setRequesting(true);
    setTimeout(() => {
      alert("Payout request submitted successfully!");
      setRequesting(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Earnings & Payouts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Available Balance */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Available for Payout</h2>
          <p className="text-4xl font-bold text-green-600 mb-6">₹1,245.50</p>
          
          <button
            onClick={handlePayout}
            disabled={requesting}
            className="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50"
          >
            {requesting ? 'Processing...' : 'Request Payout'}
          </button>
          <p className="mt-2 text-xs text-gray-500 text-center">Minimum payout threshold: ₹500</p>
        </div>

        {/* Revenue Share Model */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Share Breakdown</h2>
          <p className="text-sm text-gray-600 mb-4">
            We believe developers should get the lion's share of value generated during their work.
          </p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-gray-700">Developer Share</span>
                <span className="text-indigo-600">70%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-gray-700">Platform Share</span>
                <span className="text-gray-500">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-gray-400 h-2.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Revenue Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-09-19</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Daily Ad Revenue</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+₹22.50</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Cleared</span></td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-09-18</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Daily Ad Revenue</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+₹60.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Cleared</span></td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-09-01</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Payout to Bank Account</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-₹1,000.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
