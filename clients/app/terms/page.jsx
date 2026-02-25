export const metadata = {
  metadataBase: new URL("https://match.inst.lk"),

  title: "Terms of Service",

  description:
    "Read the Terms of Service for Match. Understand the rules, responsibilities, and guidelines for using our relationship platform.",

  keywords: [
    "Match terms",
    "terms of service",
    "relationship platform rules",
    "Match policies",
  ],

  openGraph: {
    type: "website",
    url: "https://match.inst.lk/terms",
    title: "Terms of Service | Match",
    description:
      "Review the terms and conditions governing the use of Match.",
    images: [
      {
        url: "https://match.inst.lk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Match Terms of Service",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Match",
    description:
      "Understand the rules and responsibilities for using Match.",
    images: ["https://match.inst.lk/og-image.jpg"],
  },

  alternates: {
    canonical: "https://match.inst.lk/terms",
  },
};

import TermPage from "./TermPage";

export default function Page() {
  return <TermPage />;
}