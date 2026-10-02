'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/supabase/auth-context';
import {
  PageShell,
  TechnicalEyebrow,
  MetricDisplay,
  TerminalSurface,
  MotionWrapper,
} from '@/components/primitives';

interface CampaignRecord {
  campaign_id: string;
  name: string;
  advertiser_name: string;
  headline: string;
  description?: string;
  destination_url: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'REJECTED' | 'ARCHIVED';
  total_budget: number;
  remaining_budget: number;
  total_spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  created_at: string;
  start_date?: string;
  end_date?: string;
}

interface DailyDataPoint {
  date_str: string;
  impressions: number;
  clicks: number;
}

interface AnalyticsSummary {
  total_impressions: number;
  total_clicks: number;
  total_budget_funded: number;
  total_budget_remaining: number;
  total_spent: number;
  ctr: number;
  active_campaigns_count: number;
  pending_campaigns_count: number;
}

export default function SponsorPortal() {
  const { user, loading: authLoading, isSponsor, sponsorOrg, refreshAuth } = useAuth();

  // Active section tab: 'campaigns' (Section A) or 'impressions' (Section B)
  const [activeTab, setActiveTab] = useState<'campaigns' | 'impressions'>('campaigns');

  // Sponsor Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);

  // Section A: Campaign Creation State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [campName, setCampName] = useState('');
  const [advertiserName, setAdvertiserName] = useState('');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [totalBudget, setTotalBudget] = useState('5000');
  const [dailyBudget, setDailyBudget] = useState('1000');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Section B & Data State
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [dailySeries, setDailySeries] = useState<DailyDataPoint[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary>({
    total_impressions: 0,
    total_clicks: 0,
    total_budget_funded: 0,
    total_budget_remaining: 0,
    total_spent: 0,
    ctr: 0,
    active_campaigns_count: 0,
    pending_campaigns_count: 0,
  });
  const [dataLoading, setDataLoading] = useState(false);

  // Fallback demo dataset if offline or local mock mode without Supabase connection
  const loadFallbackData = useCallback(() => {
    const demoCamps: CampaignRecord[] = [
      {
        campaign_id: 'cmp_mock_001',
        name: 'CloudForge AI GPU Infrastructure',
        advertiser_name: 'CloudForge Demo',
        headline: 'Deploy your AI backend in seconds',
        description: 'Serverless GPU cluster built for autonomous agent workloads.',
        destination_url: 'https://cloudforge.example.com',
        status: 'ACTIVE',
        total_budget: 10000,
        remaining_budget: 7420,
        total_spent: 2580,
        impressions: 6450,
        clicks: 142,
        ctr: 2.20,
        created_at: new Date().toISOString(),
      },
      {
        campaign_id: 'cmp_mock_002',
        name: 'VectorDB High-Velocity Indexing',
        advertiser_name: 'VectorScale',
        headline: 'Sub-millisecond vector retrieval for agents',
        description: 'Scale pgvector memory embeddings instantly.',
        destination_url: 'https://vectorscale.example.com',
        status: 'PENDING_REVIEW',
        total_budget: 5000,
        remaining_budget: 5000,
        total_spent: 0,
        impressions: 0,
        clicks: 0,
        ctr: 0.00,
        created_at: new Date().toISOString(),
      },
    ];

    const demoSeries: DailyDataPoint[] = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date_str: d.toISOString().split('T')[0],
        impressions: Math.floor(600 + Math.random() * 500),
        clicks: Math.floor(15 + Math.random() * 20),
      };
    });

    setCampaigns(demoCamps);
    setDailySeries(demoSeries);
    setSummary({
      total_impressions: 6450,
      total_clicks: 142,
      total_budget_funded: 15000,
      total_budget_remaining: 12420,
      total_spent: 2580,
      ctr: 2.20,
      active_campaigns_count: 1,
      pending_campaigns_count: 1,
    });
  }, []);

  // Fetch campaign telemetry from RPC `get_sponsor_impressions`
  const fetchSponsorData = useCallback(async () => {
    if (!sponsorOrg?.id) {
      loadFallbackData();
      return;
    }

    setDataLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_sponsor_impressions', {
        p_org_id: sponsorOrg.id,
      });

      if (error) {
        console.warn('get_sponsor_impressions RPC returned error, using fallback:', error.message);
        loadFallbackData();
      } else if (data) {
        setCampaigns(data.campaigns || []);
        setDailySeries(data.daily_series || []);
        setSummary(data.summary || {
          total_impressions: 0,
          total_clicks: 0,
          total_budget_funded: 0,
          total_budget_remaining: 0,
          total_spent: 0,
          ctr: 0,
          active_campaigns_count: 0,
          pending_campaigns_count: 0,
        });
      }
    } catch (err) {
      console.error('Failed to fetch sponsor impressions:', err);
      loadFallbackData();
    } finally {
      setDataLoading(false);
    }
  }, [sponsorOrg?.id, loadFallbackData]);

  useEffect(() => {
    if (user && isSponsor) {
      fetchSponsorData();
    } else if (user && !isSponsor && !authLoading) {
      setShowOnboarding(true);
    }
  }, [user, isSponsor, authLoading, fetchSponsorData]);

  // Handle Sponsor Onboarding submission
  const handleRegisterSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingError(null);
    setOnboardingLoading(true);

    try {
      const { data, error } = await supabase.rpc('register_sponsor', {
        p_org_name: orgName.trim(),
        p_billing_email: billingEmail.trim() || user?.email,
        p_website_url: websiteUrl.trim() || null,
      });

      if (error) {
        throw error;
      }

      if (data && data.success) {
        await refreshAuth();
        setShowOnboarding(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setOnboardingError(msg);
    } finally {
      setOnboardingLoading(false);
    }
  };

  // Handle Create Sponsorship submission
  const handleCreateSponsorship = async () => {
    setCreateError(null);
    setCreateLoading(true);

    const tBudget = parseFloat(totalBudget);
    const dBudget = parseFloat(dailyBudget) || 0;

    try {
      if (!sponsorOrg?.id) {
        // Mock fallback for UI preview if running without live Supabase DB
        const newCamp: CampaignRecord = {
          campaign_id: `cmp_${Date.now()}`,
          name: campName.trim(),
          advertiser_name: advertiserName.trim(),
          headline: headline.trim(),
          description: description.trim() || undefined,
          destination_url: destinationUrl.trim(),
          status: 'PENDING_REVIEW',
          total_budget: tBudget,
          remaining_budget: tBudget,
          total_spent: 0,
          impressions: 0,
          clicks: 0,
          ctr: 0.00,
          created_at: new Date().toISOString(),
          start_date: startDate || new Date().toISOString(),
          end_date: endDate || undefined,
        };
        setCampaigns([newCamp, ...campaigns]);
        setCreateStep('success');
        return;
      }

      const { data: campaignId, error } = await supabase.rpc('create_sponsorship', {
        p_org_id: sponsorOrg.id,
        p_name: campName.trim(),
        p_advertiser_name: advertiserName.trim(),
        p_headline: headline.trim(),
        p_description: description.trim() || null,
        p_destination_url: destinationUrl.trim(),
        p_total_budget: tBudget,
        p_daily_budget: dBudget,
        p_start_date: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
        p_end_date: endDate ? new Date(endDate).toISOString() : null,
      });

      if (error) {
        throw error;
      }

      if (campaignId) {
        await fetchSponsorData();
        setCreateStep('success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit campaign';
      setCreateError(msg);
      setCreateStep('form');
    } finally {
      setCreateLoading(false);
    }
  };

  const resetCreateForm = () => {
    setShowCreateModal(false);
    setCreateStep('form');
    setCampName('');
    setAdvertiserName('');
    setHeadline('');
    setDescription('');
    setDestinationUrl('');
    setTotalBudget('5000');
    setDailyBudget('1000');
    setStartDate('');
    setEndDate('');
    setCreateError(null);
  };

  // 1. Loading State
  if (authLoading) {
    return (
      <PageShell maxWidth="7xl">
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          <p className="text-xs font-mono text-zinc-500">Verifying sponsor credentials and organization policies...</p>
        </div>
      </PageShell>
    );
  }

  // 2. Unauthenticated State
  if (!user) {
    return (
      <PageShell maxWidth="5xl">
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-6">
          <TechnicalEyebrow variant="amber">Authentication Required</TechnicalEyebrow>
          <h2 className="text-2xl font-semibold text-white">Sign in to Access the Sponsor Portal</h2>
          <p className="text-xs text-zinc-400 max-w-md">
            The sponsor portal allows companies to run non-intrusive status-line sponsorships across the Antigravity developer ecosystem.
          </p>
          <div className="flex gap-4">
            <Link
              href="/login?redirect=/sponsor"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)]"
            >
              Sign In to Portal →
            </Link>
            <Link
              href="/signup?sponsor=true"
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium rounded-xl transition-colors"
            >
              Create Sponsor Account
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  // 3. Authenticated without SPONSOR Role (Access Denied / Onboarding Prompt)
  if (user && !isSponsor && !showOnboarding) {
    return (
      <PageShell maxWidth="5xl">
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-6">
          <TechnicalEyebrow variant="rose">403 Access Denied</TechnicalEyebrow>
          <h2 className="text-2xl font-semibold text-white">Sponsor Privileges Required</h2>
          <p className="text-xs text-zinc-400 max-w-lg">
            Your account ({user.email}) is currently registered as a Developer Consumer. To create campaigns and view impression telemetry, complete the sponsor organization onboarding.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setBillingEmail(user.email || '');
                setShowOnboarding(true);
              }}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)]"
            >
              Onboard as Sponsor Organization →
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium rounded-xl transition-colors"
            >
              Return to Developer Dashboard
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="7xl">
      {/* Header & Two Section Navigation Tabs */}
      <MotionWrapper>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800/80 pb-6 mb-8">
          <div>
            <div className="flex items-center space-x-3">
              <TechnicalEyebrow variant="emerald">Sponsor Portal</TechnicalEyebrow>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {sponsorOrg?.name || 'Sponsor Organization'}
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Role: <span className="text-emerald-400 font-mono font-semibold">SPONSOR ({sponsorOrg?.role || 'OWNER'})</span> · Non-intrusive status-line rotation &amp; cryptographic telemetry.
            </p>
          </div>

          {/* Exactly Two Sections Navigation */}
          <div className="flex items-center space-x-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 font-mono text-xs">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'campaigns'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              Section A: Campaigns &amp; Sponsors
            </button>
            <button
              onClick={() => setActiveTab('impressions')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'impressions'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              Section B: Impressions &amp; Analytics
            </button>
          </div>
        </div>
      </MotionWrapper>

      {/* SECTION A: SPONSOR & CAMPAIGN MANAGEMENT SECTION */}
      {activeTab === 'campaigns' && (
        <div className="space-y-8">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0c0c0e] border border-zinc-800 p-5 rounded-2xl shadow-sm">
            <div>
              <h2 className="text-base font-semibold text-white">Sponsorship Campaigns</h2>
              <p className="text-xs text-zinc-400">Manage status-line copy, active review state, and campaign budgets</p>
            </div>
            <button
              onClick={() => {
                setCreateStep('form');
                setShowCreateModal(true);
              }}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all active:scale-[0.98]"
            >
              + Create Sponsorship Campaign
            </button>
          </div>

          {/* Live Placement Simulator */}
          <TerminalSurface
            title="Antigravity Terminal Status Line Placement"
            statusText="delivery rotation live"
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="text-zinc-500 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Thinking (4.2s) · Analyzing SQL execution plans and indexing triggers...</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400 pt-1 border-t border-zinc-800/60">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider shrink-0">
                  Sponsored
                </span>
                <span className="font-semibold text-white">
                  {campaigns[0]?.advertiser_name || 'Your Company Name'}
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-300 truncate">
                  {campaigns[0]?.headline || 'Instant GPU infrastructure and vector databases built for AI agents →'}
                </span>
              </div>
            </div>
          </TerminalSurface>

          {/* Campaigns List */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] overflow-hidden shadow-lg">
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-white">Organization Campaigns</h3>
                <p className="text-xs text-zinc-400 font-mono">
                  {campaigns.length} total sponsorship {campaigns.length === 1 ? 'campaign' : 'campaigns'}
                </p>
              </div>
              <button
                onClick={() => fetchSponsorData()}
                disabled={dataLoading}
                className="text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                {dataLoading ? 'Refreshing...' : '↻ Refresh Ledger'}
              </button>
            </div>

            {campaigns.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <p className="text-sm text-zinc-400">No campaigns created yet for {sponsorOrg?.name}.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2 bg-emerald-500 text-zinc-950 font-bold text-xs rounded-xl"
                >
                  Create Your First Sponsorship
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#111114] text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="py-3.5 px-4 font-sans font-semibold">Campaign Details</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Remaining / Total</th>
                      <th className="py-3.5 px-4">Destination</th>
                      <th className="py-3.5 px-4 text-right">Exposures</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {campaigns.map((camp) => (
                      <tr key={camp.campaign_id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-4 px-4 space-y-1">
                          <div className="font-sans font-medium text-white text-sm">{camp.name}</div>
                          <div className="text-[11px] text-zinc-400">
                            <span className="text-emerald-400 font-semibold">{camp.advertiser_name}:</span> {camp.headline}
                          </div>
                          {camp.description && (
                            <div className="text-[10px] text-zinc-500 italic truncate max-w-md">
                              {camp.description}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider ${
                              camp.status === 'ACTIVE'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : camp.status === 'PENDING_REVIEW'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : camp.status === 'REJECTED'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                            }`}
                          >
                            {camp.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-emerald-400 font-bold">₹{camp.remaining_budget.toLocaleString()}</span>
                          <span className="text-zinc-500"> / ₹{camp.total_budget.toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-4">
                          <a
                            href={camp.destination_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:underline truncate max-w-[180px] block"
                          >
                            {camp.destination_url}
                          </a>
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-white">
                          {camp.impressions.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION B: IMPRESSIONS & ANALYTICS SECTION */}
      {activeTab === 'impressions' && (
        <div className="space-y-8">
          {/* 4 Financial & Delivery Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricDisplay
              label="Verified Dwell Impressions"
              value={summary.total_impressions.toLocaleString()}
              subtext="Only qualified 5s+ dwell exposures"
              variant="emerald"
              badge="Cryptographically Verified"
            />
            <MetricDisplay
              label="Direct Developer Clicks"
              value={summary.total_clicks.toLocaleString()}
              subtext="Direct terminal link interactions"
            />
            <MetricDisplay
              label="Click-Through Rate (CTR)"
              value={`${summary.ctr}%`}
              subtext="Performance ratio (clicks / exposures)"
              variant="emerald"
            />
            <MetricDisplay
              label="Budget Spent / Remaining"
              value={`₹${summary.total_spent.toLocaleString()} / ₹${summary.total_budget_remaining.toLocaleString()}`}
              subtext="Prepaid deposit balance"
            />
          </div>

          {/* Notice Banner */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-mono flex items-center space-x-3">
            <span className="text-blue-400 text-base">ℹ</span>
            <span>
              <strong>Note:</strong> Impressions only appear once an administrator moves a campaign to <code className="text-emerald-300 bg-black/40 px-1 py-0.5 rounded">ACTIVE</code> status. Pending review campaigns undergo URL and safety verification before serving live ads.
            </span>
          </div>

          {/* Daily Trend Visualization (SVG Line Chart) */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-white">Daily Impression &amp; Click Trends</h3>
                <p className="text-xs text-zinc-400 font-mono">Last 7-30 days timeline delivery volume</p>
              </div>
              <div className="flex items-center space-x-4 text-xs font-mono">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="text-zinc-300">Impressions</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span className="text-zinc-300">Clicks</span>
                </div>
              </div>
            </div>

            {/* Responsive Chart Container */}
            <div className="h-48 w-full bg-black/60 rounded-xl border border-zinc-800/80 p-4 flex items-end gap-2 relative overflow-hidden">
              {dailySeries.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-xs font-mono text-zinc-500">
                  No exposure events recorded for this timeframe
                </div>
              ) : (
                dailySeries.map((point) => {
                  const maxImp = Math.max(...dailySeries.map((p) => p.impressions), 100);
                  const heightPercent = Math.max((point.impressions / maxImp) * 80, 8);
                  return (
                    <div key={point.date_str} className="flex-1 flex flex-col items-center justify-end h-full group">
                      <div className="text-[9px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                        {point.impressions}
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[28px] bg-emerald-500/30 hover:bg-emerald-500 border-t-2 border-emerald-400 rounded-t transition-all"
                      />
                      <span className="text-[9px] font-mono text-zinc-600 mt-2 truncate w-full text-center">
                        {point.date_str.slice(5)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Per-Campaign Table or Required Empty State */}
          {campaigns.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-12 text-center space-y-4 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 text-xl font-mono">
                ✦
              </div>
              <h3 className="text-base font-semibold text-white">Sponsor something to start seeing impressions</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Once your campaign is submitted and approved, qualified developer terminal exposures and click-through telemetry will stream into this dashboard.
              </p>
              <button
                onClick={() => {
                  setActiveTab('campaigns');
                  setShowCreateModal(true);
                }}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all"
              >
                Create Sponsorship in Section A →
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] overflow-hidden shadow-lg">
              <div className="p-5 border-b border-zinc-800">
                <h3 className="text-sm font-semibold text-white">Per-Campaign Telemetry Breakdown</h3>
                <p className="text-xs text-zinc-400 font-mono">Detailed conversion metrics and remaining balances</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#111114] text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4 font-sans font-semibold">Campaign</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Verified Exposures</th>
                      <th className="py-3 px-4">Clicks</th>
                      <th className="py-3 px-4">CTR</th>
                      <th className="py-3 px-4 text-right">Spent / Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {campaigns.map((camp) => (
                      <tr key={camp.campaign_id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-white">{camp.name}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              camp.status === 'ACTIVE'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {camp.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-emerald-400 font-bold">{camp.impressions.toLocaleString()}</td>
                        <td className="py-3.5 px-4">{camp.clicks.toLocaleString()}</td>
                        <td className="py-3.5 px-4">{camp.ctr}%</td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="text-white font-bold">₹{camp.total_spent.toLocaleString()}</span>
                          <span className="text-zinc-500"> / ₹{camp.total_budget.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: CREATE SPONSORSHIP CAMPAIGN (3-Step Flow) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-6 max-w-xl w-full space-y-5 shadow-2xl my-8">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <TechnicalEyebrow variant="emerald">New Sponsorship</TechnicalEyebrow>
                <h3 className="text-base font-semibold text-white">Create Campaign</h3>
              </div>
              <button
                onClick={resetCreateForm}
                className="text-zinc-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                {createError}
              </div>
            )}

            {/* STEP 1: FORM INPUTS */}
            {createStep === 'form' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setCreateStep('confirm');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    required
                    value={campName}
                    onChange={(e) => setCampName(e.target.value)}
                    placeholder="e.g. Q4 Vector Search Promotion"
                    className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                      Advertiser Name (max 60)
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={60}
                      value={advertiserName}
                      onChange={(e) => setAdvertiserName(e.target.value)}
                      placeholder="e.g. CloudForge AI"
                      className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                      Destination URL (https://)
                    </label>
                    <input
                      type="url"
                      required
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      placeholder="https://cloudforge.dev/signup"
                      className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Status Line Headline (max 120 chars)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Deploy serverless AI backends with zero cold starts →"
                    className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Internal Description (max 255 chars)
                  </label>
                  <textarea
                    rows={2}
                    maxLength={255}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Notes for target audience and campaign goals..."
                    className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                      Total Budget (INR ₹)
                    </label>
                    <input
                      type="number"
                      min="500"
                      step="500"
                      required
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(e.target.value)}
                      className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                      Daily Budget (INR ₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={dailyBudget}
                      onChange={(e) => setDailyBudget(e.target.value)}
                      className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      Start Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      End Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={resetCreateForm}
                    className="px-4 py-2 border border-zinc-700 text-xs rounded-lg text-zinc-300 hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg shadow-sm"
                  >
                    Review &amp; Confirm Placement →
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: CONFIRMATION STEP */}
            {createStep === 'confirm' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
                  <div className="text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
                    Placement Confirmation
                  </div>
                  <div className="p-3 bg-black rounded-lg border border-zinc-800 text-emerald-400">
                    <span className="font-semibold text-white">{advertiserName}:</span> {headline}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-zinc-300 pt-2 border-t border-zinc-900">
                    <div>
                      <span className="text-zinc-500">Destination:</span> {destinationUrl}
                    </div>
                    <div>
                      <span className="text-zinc-500">Total Budget:</span> ₹{totalBudget}
                    </div>
                    <div>
                      <span className="text-zinc-500">Daily Pacing:</span> ₹{dailyBudget}/day
                    </div>
                    <div>
                      <span className="text-zinc-500">Initial Status:</span> PENDING_REVIEW
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-emerald-300 text-[11px]">
                  ✓ Payment will be initialized using the MOCK billing rail. In production, Razorpay/Stripe securely settles deposits.
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setCreateStep('form')}
                    disabled={createLoading}
                    className="px-4 py-2 border border-zinc-700 text-xs rounded-lg text-zinc-300 hover:bg-zinc-800"
                  >
                    ← Back to Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateSponsorship}
                    disabled={createLoading}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg shadow-sm disabled:opacity-50"
                  >
                    {createLoading ? 'Executing RPC...' : 'Confirm & Submit Sponsorship'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS STATE */}
            {createStep === 'success' && (
              <div className="p-6 text-center space-y-4 font-mono">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-base font-semibold text-white font-sans">Campaign Submitted Successfully</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Your campaign has been placed in <strong className="text-amber-400">PENDING_REVIEW</strong>. An administrator will verify URL safety before live status-line activation.
                </p>
                <div className="pt-4">
                  <button
                    onClick={resetCreateForm}
                    className="px-6 py-2 bg-emerald-500 text-zinc-950 font-bold text-xs rounded-xl"
                  >
                    Done (View in Dashboard)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ONBOARDING FOR NEW SPONSORS */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="text-center space-y-2">
              <TechnicalEyebrow variant="emerald">Sponsor Registration</TechnicalEyebrow>
              <h3 className="text-lg font-semibold text-white">Register Sponsor Organization</h3>
              <p className="text-xs text-zinc-400">
                Create an organization profile to unlock the Sponsor Portal and create status-line campaigns.
              </p>
            </div>

            {onboardingError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                {onboardingError}
              </div>
            )}

            <form onSubmit={handleRegisterSponsor} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. CloudForge Systems"
                  className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Billing Email
                </label>
                <input
                  type="email"
                  required
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  placeholder="billing@cloudforge.io"
                  className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Company Website (Optional)
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://cloudforge.io"
                  className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-400">
                Includes default Starter Sponsor plan configuration. ADMIN role is restricted and cannot be self-assigned.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOnboarding(false)}
                  className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 text-xs rounded-lg text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={onboardingLoading}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg shadow-sm disabled:opacity-50"
                >
                  {onboardingLoading ? 'Registering...' : 'Complete Onboarding →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  );
}
