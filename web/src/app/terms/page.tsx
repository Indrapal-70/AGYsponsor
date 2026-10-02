import React from 'react';
import {
  PageShell,
  SectionHeader,
  TechnicalEyebrow,
  MotionWrapper,
} from '@/components/primitives';

export default function TermsOfService() {
  return (
    <PageShell maxWidth="5xl">
      <MotionWrapper>
        <SectionHeader
          eyebrow="Legal & Terms"
          title="Terms of Service"
          subtitle="Clear rules governing developer ledger rewards, sponsor campaign delivery, and acceptable use."
        />
      </MotionWrapper>

      <MotionWrapper delay={0.15}>
        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed mb-12">
          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 space-y-4 shadow-lg">
            <TechnicalEyebrow variant="amber">Beta Release Terms</TechnicalEyebrow>
            <h2 className="text-base font-semibold text-white">1. Acceptance of Terms</h2>
            <p className="text-zinc-400">
              By installing the AgentSponsor CLI plugin or configuring campaigns on the platform, you agree to these Terms of Service.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 space-y-4 shadow-lg">
            <h2 className="text-base font-semibold text-white">2. Developer Earnings & Minimum Payouts</h2>
            <p className="text-zinc-400">
              Developers earn ₹0.20 per qualified exposure meeting the 5.0-second active compute dwell requirement.
            </p>
            <ul className="space-y-2 font-mono text-xs text-zinc-300 pl-4 border-l border-zinc-800">
              <li><strong className="text-white font-sans">Minimum Threshold:</strong> Payouts can be requested once your available balance reaches ₹50.00.</li>
              <li><strong className="text-white font-sans">Anti-Fraud Verification:</strong> Automated replay detection or burst generation will result in ledger freeze.</li>
              <li><strong className="text-white font-sans">Payout Rails:</strong> Disbursements are transferred directly via Indian UPI VPAs or Bank accounts.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 space-y-4 shadow-lg">
            <h2 className="text-base font-semibold text-white">3. Sponsor Guidelines & Content Safety</h2>
            <p className="text-zinc-400">
              All sponsor creatives must directly target developer utility (developer tools, cloud services, databases, APIs). Deceptive copy, malware, adult content, or political advertisements are strictly prohibited and will be rejected during admin review.
            </p>
          </div>

          <div className="text-xs font-mono text-zinc-500 pt-4 border-t border-zinc-800/80">
            Last updated: September 2026 · AgentSponsor Legal Terms
          </div>
        </div>
      </MotionWrapper>
    </PageShell>
  );
}
