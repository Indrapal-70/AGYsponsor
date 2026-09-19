import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your agent is thinking. Let it pay you.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            AgentSponsor lets developers receive a share of eligible sponsorship revenue shown during AI-agent working time.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/signup" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Install AgentSponsor
            </Link>
            <a href="https://github.com/agentsponsor" className="text-sm font-semibold leading-6 text-gray-900">
              View GitHub <span aria-hidden="true">→</span>
            </a>
            <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">
              Sign Up / Login
            </Link>
          </div>
        </div>
      </div>

      {/* ASCII / Visual Preview */}
      <div className="mx-auto max-w-4xl py-12 px-6 lg:px-8 bg-gray-900 rounded-xl shadow-2xl overflow-hidden text-gray-300 font-mono text-sm mb-24">
        <div className="p-4 border-b border-gray-700 flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="p-6">
          <p className="text-blue-400">➜ ant-agent --task "refactor checkout flow"</p>
          <p className="mt-2">[Agent] Thinking... this might take a minute.</p>
          <p className="mt-1">[Agent] Reading files...</p>
          <div className="mt-4 p-3 bg-gray-800 border border-gray-700 rounded-md">
            <p className="text-yellow-400 text-xs font-bold uppercase mb-1">Sponsored</p>
            <p className="text-white">🚀 Looking to monitor your AI agents? Check out AgentMonitor!</p>
            <p className="text-gray-400">Get 20% off your first year with code SPONSOR20.</p>
          </div>
          <p className="mt-4">[Agent] Done! Checkout flow refactored successfully.</p>
        </div>
      </div>

      {/* How It Works */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 bg-gray-50 rounded-3xl mb-24">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </p>
        </div>
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                1. Install Plugin
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">Add the AgentSponsor plugin to your Antigravity CLI or favorite agent platform.</p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                2. Agent Works
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">You kick off tasks as usual. While the agent runs, it displays non-intrusive sponsor messages.</p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                3. Sponsor Displayed
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">Relevant, high-quality dev tools and services are shown to you during wait times.</p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                4. Share Revenue
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">You get paid for eligible impressions. Cash out your earnings directly to your bank account.</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Privacy Promise */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 mb-24 border-t border-gray-200">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Strict Privacy Promise</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We respect your codebase and your data. Our plugin is open source and entirely transparent.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3 text-center">
            <div className="flex flex-col">
              <dt className="text-xl font-semibold leading-7 text-gray-900">No Prompts Collected</dt>
              <dd className="mt-4 text-base leading-7 text-gray-600">We don't know what you're asking your agent to do.</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-xl font-semibold leading-7 text-gray-900">No Source Code Collected</dt>
              <dd className="mt-4 text-base leading-7 text-gray-600">Your proprietary code never touches our servers.</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-xl font-semibold leading-7 text-gray-900">No Conversation Logs</dt>
              <dd className="mt-4 text-base leading-7 text-gray-600">We don't see the AI's responses or thought process.</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
