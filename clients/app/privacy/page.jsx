export const metadata = {
  metadataBase: new URL("https://match.inst.lk"),

  title: "Privacy Policy",

  description:
    "Read how Match collects, uses, and protects your information while you use our platform.",

  keywords: [
    "Match privacy",
    "privacy policy",
    "data protection",
    "user privacy",
  ],

  openGraph: {
    type: "website",
    url: "https://match.inst.lk/privacy",
    title: "Privacy Policy | Match",
    description:
      "Learn how your information is handled on Match.",
    images: [
      {
        url: "https://match.inst.lk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Match Privacy Policy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Match",
    description:
      "Understand how your data is managed on Match.",
    images: ["https://match.inst.lk/og-image.jpg"],
  },

  alternates: {
    canonical: "https://match.inst.lk/privacy",
  },
};

import PrivacyPage from "./PrivacyPage";

export default function Page() {
  return <PrivacyPage />;
}