export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      
      <div className="prose prose-indigo">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-sm text-yellow-700 font-medium">
            MVP Disclaimer: AgentSponsor is currently in early beta (MVP stage). Features, payout thresholds, and revenue share percentages are subject to change.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-6 text-gray-700">
          By installing the AgentSponsor plugin or accessing the AgentSponsor platform, you agree to these Terms of Service. If you do not agree to these terms, please do not use our services.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Earnings and Payouts</h2>
        <p className="mb-4 text-gray-700">
          Developers earn a share of revenue generated from eligible sponsor impressions displayed during AI agent wait times. 
        </p>
        <ul className="list-disc pl-5 mb-6 text-gray-700">
          <li><strong>Eligibility:</strong> Only valid, human-viewed impressions are eligible for payout. Automated or scripted attempts to generate impressions (fraud) will result in account termination and forfeiture of earnings.</li>
          <li><strong>Threshold:</strong> Payouts can be requested once your account balance reaches the minimum threshold of ₹500.</li>
          <li><strong>Availability:</strong> Earnings are dependent on active advertiser campaigns and platform demand. We do not guarantee a specific rate or consistent availability of sponsor messages.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Advertiser Rules</h2>
        <p className="mb-6 text-gray-700">
          Advertisers must submit campaigns that are relevant to developers. We strictly prohibit ads containing malware, deceptive content, adult material, or political messaging. All campaigns are subject to manual review and approval by the AgentSponsor team.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Limitation of Liability</h2>
        <p className="mb-6 text-gray-700">
          AgentSponsor is provided "as is" without warranties of any kind. In no event shall AgentSponsor be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Account Termination</h2>
        <p className="mb-6 text-gray-700">
          We reserve the right to suspend or terminate your account at any time, with or without cause, including for violation of these Terms of Service or fraudulent activity.
        </p>

        <p className="text-sm text-gray-500 mt-12 pt-8 border-t border-gray-200">
          Last updated: September 19, 2026
        </p>
      </div>
    </div>
  );
}
