import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="/privacy" className="text-gray-400 hover:text-gray-500">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-500">
              Terms of Service
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; {new Date().getFullYear()} AgentSponsor. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
