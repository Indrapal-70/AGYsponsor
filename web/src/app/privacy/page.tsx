export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-indigo">
        <p className="text-lg text-gray-700 mb-6">
          At AgentSponsor, we believe that your code is yours, and your thoughts are yours. Our plugin is designed to show you relevant sponsored content while your AI agent works, without compromising your privacy or the security of your codebase.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Strict Data Collection Limits</h2>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500 mr-2">✓</span>
              <div>
                <strong>NO Prompts Collected:</strong> We never intercept, read, or store the prompts you send to your AI agents.
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500 mr-2">✓</span>
              <div>
                <strong>NO Source Code Collected:</strong> Your source code never leaves your machine through our plugin. We do not analyze, parse, or transmit your codebase.
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500 mr-2">✓</span>
              <div>
                <strong>NO Conversation Logs:</strong> We do not log the outputs, responses, or intermediate steps of your AI agents.
              </div>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What We Do Collect</h2>
        <p className="mb-4 text-gray-700">To calculate payouts and manage campaigns, we collect only the absolute minimum required data:</p>
        <ul className="list-disc pl-5 mb-8 text-gray-700">
          <li><strong>Installation ID:</strong> A unique, anonymous identifier generated when you install the plugin, used to attribute earnings.</li>
          <li><strong>Impression Events:</strong> A simple ping when a sponsor message is displayed to you, including the timestamp and campaign ID.</li>
          <li><strong>Account Information:</strong> If you sign up for a dashboard account to claim your earnings, we collect your email address and payment details (handled securely by Stripe).</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Open Source Verification</h2>
        <p className="mb-8 text-gray-700">
          We don't expect you to just take our word for it. The AgentSponsor CLI plugin is entirely open source. You can review the code yourself on GitHub to verify exactly what data is being sent over the network.
        </p>

        <p className="text-sm text-gray-500 mt-12 pt-8 border-t border-gray-200">
          Last updated: September 19, 2026
        </p>
      </div>
    </div>
  );
}
