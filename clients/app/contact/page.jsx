export const metadata = {
  metadataBase: new URL("https://match.inst.lk"),

  title: "Contact Us",

  description:
    "Contact the Match team for support, inquiries, or feedback regarding the platform.",

  keywords: [
    "contact Match",
    "Match support",
    "relationship platform support",
  ],

  openGraph: {
    type: "website",
    url: "https://match.inst.lk/contact",
    title: "Contact Us | Match",
    description:
      "Reach out to the Match team for assistance.",
    images: [
      {
        url: "https://match.inst.lk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Match",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Match",
    description:
      "Get in touch with the Match team.",
    images: ["https://match.inst.lk/og-image.jpg"],
  },

  alternates: {
    canonical: "https://match.inst.lk/contact",
  },
};

import ContactPage from "./ContactPage";

export default function Page() {
  return <ContactPage />;
}