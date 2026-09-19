'use client';
import { useState } from 'react';

export default function Advertisers() {
  const [formData, setFormData] = useState({
    companyName: '',
    campaignName: '',
    headline: '',
    description: '',
    url: '',
    budget: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Campaign submitted for review!');
    setFormData({
      companyName: '',
      campaignName: '',
      headline: '',
      description: '',
      url: '',
      budget: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const campaigns = [
    { id: 1, name: 'Q3 Developer Tools Push', status: 'ACTIVE', budget: '₹50,000', spent: '₹12,450' },
    { id: 2, name: 'API Gateway Launch', status: 'PENDING_REVIEW', budget: '₹25,000', spent: '₹0' },
    { id: 3, name: 'Legacy Monitoring', status: 'PAUSED', budget: '₹10,000', spent: '₹10,000' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold leading-7 text-gray-900 sm:truncate sm:text-4xl sm:tracking-tight">
            Advertiser Portal
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Submission Form */}
        <div className="lg:col-span-1 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Create New Campaign</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
              <input type="text" name="companyName" id="companyName" required value={formData.companyName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
            </div>
            <div>
              <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700">Campaign Name</label>
              <input type="text" name="campaignName" id="campaignName" required value={formData.campaignName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
            </div>
            <div>
              <label htmlFor="headline" className="block text-sm font-medium text-gray-700">Headline (max 50 chars)</label>
              <input type="text" name="headline" id="headline" maxLength={50} required value={formData.headline} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" id="description" rows={3} required value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">Destination URL</label>
              <input type="url" name="url" id="url" required value={formData.url} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget (₹)</label>
              <input type="number" name="budget" id="budget" required min="1000" value={formData.budget} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Submit for Review
            </button>
          </form>
        </div>

        {/* Active Campaigns List */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Campaigns</h3>
          </div>
          <ul role="list" className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <li key={campaign.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">{campaign.name}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                        campaign.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {campaign.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Budget: {campaign.budget}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Spent: {campaign.spent}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
