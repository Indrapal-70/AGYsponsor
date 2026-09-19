'use client';
import { useState } from 'react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretKey, setSecretKey] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKey === 'admin123') { // Mock authentication
      setIsAuthenticated(true);
    } else {
      alert('Invalid secret key');
    }
  };

  const campaigns = [
    { id: 1, company: 'DevCorp', name: 'Q3 Developer Tools Push', status: 'ACTIVE', budget: '₹50,000' },
    { id: 2, company: 'CloudNet', name: 'API Gateway Launch', status: 'PENDING_REVIEW', budget: '₹25,000' },
    { id: 3, company: 'MonitorIt', name: 'Legacy Monitoring', status: 'PAUSED', budget: '₹10,000' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Portal</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="secretKey" className="sr-only">Secret Key</label>
              <input
                id="secretKey"
                name="secretKey"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter admin secret key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
            </div>
            <div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Access Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* System Analytics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Installations</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">1,204</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Impressions</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">84,520</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Platform Revenue (₹)</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">₹45,200</dd>
          </div>
        </div>
      </div>

      {/* Campaign Moderation */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Campaign Moderation</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.budget}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                        campaign.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {campaign.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {campaign.status === 'PENDING_REVIEW' && (
                        <>
                          <button className="text-green-600 hover:text-green-900">Approve</button>
                          <button className="text-red-600 hover:text-red-900">Reject</button>
                        </>
                      )}
                      {campaign.status === 'ACTIVE' && (
                        <button className="text-yellow-600 hover:text-yellow-900">Pause</button>
                      )}
                      {campaign.status === 'PAUSED' && (
                        <button className="text-green-600 hover:text-green-900">Resume</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
