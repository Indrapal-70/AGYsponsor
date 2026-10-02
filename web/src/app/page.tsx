import ScrollMotionStage from '@/components/effects/ScrollMotionStage';
import HeroDepthStage from '@/components/HeroDepthStage';
import PinnedTerminalStory from '@/components/PinnedTerminalStory';
import TechnicalArchitectureStory from '@/components/TechnicalArchitectureStory';
import PrivacyStatement from '@/components/PrivacyStatement';
import PerspectiveMorph from '@/components/PerspectiveMorph';
import InstallationProtocol from '@/components/InstallationProtocol';
import TerminalCta from '@/components/TerminalCta';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 overflow-x-hidden">
      {/* Layer 0: Reactive Scroll-Driven HyperFrames Motion Stage */}
      <ScrollMotionStage />

      {/* PASS 1: Shared 2.5D Perspective Hero & Terminal Dimensional Stage */}
      <HeroDepthStage />

      {/* Pinned Terminal Story Sequence */}
      <PinnedTerminalStory />

      {/* Technical Architecture System Pipeline */}
      <TechnicalArchitectureStory />

      {/* Editorial Privacy Statements */}
      <PrivacyStatement />

      {/* Perspective Shift (Developer ⟷ Sponsor) */}
      <PerspectiveMorph />

      {/* Technical Installation & Verification Protocol */}
      <InstallationProtocol />

      {/* Restrained Terminal-Style Final CTA */}
      <TerminalCta />
    </div>
  );
}










