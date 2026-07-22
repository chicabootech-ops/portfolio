import type { Metadata } from "next";
import { FoundersAbout } from "@/components/sections/about/founders-about";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `About the Founders | ${siteConfig.name}`,
  description:
    "Meet Ragini Agarwal and Kanisha Agarwal — the sister founders behind CHIC A BOO’s crochet flowers, keepsakes, and magazines.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden pt-19 sm:pt-21 lg:pt-40">
      <FoundersAbout />
    </main>
  );
}
