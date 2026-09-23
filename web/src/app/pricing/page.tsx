import Link from 'next/link';

const PLANS = [
  {
    name: 'Starter Sponsor',
    slug: 'starter',
    price: '₹4,999',
    period: '/month',
    budget: '₹4,000 included ad budget',
    campaigns: '1 Active Campaign',
    creatives: '2 Creatives',
    features: [
      'Standard status-line rotation',
      'Basic impressions & click analytics',
      'Target active Antigravity CLI sessions',
      'Email support'
    ],
    highlight: false
  },
  {
    name: 'Growth Sponsor',
    slug: 'growth',
    price: '₹14,999',
    period: '/month',
    budget: '₹12,500 included ad budget',
    campaigns: '3 Active Campaigns',
    creatives: '6 Creatives',
    features: [
      'Priority rotation weighting (2x)',
      'Detailed hourly conversion breakdown',
      'A/B creative testing support',
      'Priority campaign approval (< 4h)',
      'Direct Slack/Discord channel'
    ],
    highlight: true
  },
  {
    name: 'Scale Sponsor',
    slug: 'scale',
    price: '₹39,999',
    period: '/month',
    budget: '₹35,000 included ad budget',
    campaigns: '10 Active Campaigns',
    creatives: '20 Creatives',
    features: [
      'Max priority rotation weighting',
      'Real-time webhook reporting',
      'Custom frequency cap configuration',
      'Dedicated account manager',
      'Co-marketing & newsletter mention'
    ],
    highlight: false
  }
];

export default function PricingPage() {
  return (
    <div className="bg-gray-950 text-white min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full uppercase tracking-wider">
            Transparent Pricing
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Sponsor Packages & Plans
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Directly connect with high-intent developers building autonomous agents. Cancel or adjust anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.slug}
              className={`rounded-2xl p-8 flex flex-col justify-between transition ${
                plan.highlight
                  ? 'border-2 border-indigo-500 bg-gray-900/90 shadow-2xl shadow-indigo-500/10 relative'
                  : 'border border-gray-800 bg-gray-900/40'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-gray-400 text-sm ml-1">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-emerald-400">{plan.budget}</p>
                </div>

                <div className="border-t border-gray-800 pt-6 space-y-3 text-xs text-gray-300">
                  <div className="flex justify-between py-1 border-b border-gray-800/40">
                    <span className="text-gray-400">Campaigns:</span>
                    <span className="font-semibold text-white">{plan.campaigns}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-800/40">
                    <span className="text-gray-400">Creatives:</span>
                    <span className="font-semibold text-white">{plan.creatives}</span>
                  </div>
                  <div className="pt-2">
                    <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-wider block mb-2">
                      Included Features:
                    </span>
                    <ul className="space-y-2">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <span className="text-indigo-400">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href={`/sponsor?plan=${plan.slug}`}
                  className={`w-full block py-3 rounded-lg text-center font-bold text-sm transition ${
                    plan.highlight
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
                      : 'border border-gray-700 hover:bg-gray-800 text-gray-200'
                  }`}
                >
                  Choose {plan.name}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Callout */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Need a Custom or Enterprise Budget?</h3>
            <p className="text-sm text-gray-400">
              Custom rotation pacing, dedicated terminal placement segments, or invoicing via corporate PO.
            </p>
          </div>
          <Link
            href="mailto:owner@agentsponsor.com?subject=Enterprise%20Sponsorship%20Inquiry"
            className="px-6 py-3 rounded-lg border border-gray-700 hover:bg-gray-800 font-semibold text-sm text-gray-300 transition whitespace-nowrap"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
}
