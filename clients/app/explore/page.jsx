export const metadata = {
  metadataBase: new URL("https://match.inst.lk"),

  title: {
    default: "Explore Profiles – Match",
    template: "%s | Match",
  },

  description:
    "Explore verified and active relationship profiles on Match. Filter by age, gender, marital status, and more to find meaningful connections.",

  keywords: [
    "explore profiles",
    "find partner",
    "relationship profiles Sri Lanka",
    "verified profiles",
    "match explore",
    "life partner search",
  ],

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://match.inst.lk/explore",
    siteName: "Match",
    title: "Explore Profiles – Match",
    description:
      "Browse active and verified relationship profiles. Use advanced filters to discover meaningful connections.",
    images: [
      {
        url: "https://match.inst.lk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Explore Profiles – Match",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Explore Profiles – Match",
    description:
      "Browse verified and active relationship profiles and connect meaningfully.",
    images: ["https://match.inst.lk/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://match.inst.lk/explore",
  },
};

import ExplorePage from "./ExplorePage";

export default function Page() {
  return <ExplorePage />;
}