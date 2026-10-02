import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/supabase/auth-context";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgentSponsor · Non-Intrusive Monetization for Google Antigravity CLI",
  description:
    "Monetize autonomous agent compute time with verified, non-intrusive status-line sponsorships. Zero prompt snooping, fail-open reliability, and direct UPI payouts.",
  keywords: [
    "Google Antigravity",
    "Antigravity CLI",
    "AI Agent Monetization",
    "Developer Tool Sponsorship",
    "Terminal Status Line",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${fontSans.variable} ${fontMono.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-[#09090b] text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-300">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

