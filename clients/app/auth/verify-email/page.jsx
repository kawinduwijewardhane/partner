import VerifyEmailPage from "./VerifyEmailPage";

export const metadata = {
  metadataBase: new URL("https://match.inst.lk"),

  title: "Verify Email",

  description:
    "Verify your email address to activate your Match account and continue your journey.",

  openGraph: {
    type: "website",
    url: "https://match.inst.lk/auth/verify-email",
    siteName: "Match",
    title: "Verify Email | Match",
    description:
      "Confirm your email address to activate your account.",
    images: [
      {
        url: "https://match.inst.lk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Verify Email - Match",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Verify Email | Match",
    description:
      "Activate your Match account by verifying your email.",
    images: ["https://match.inst.lk/og-image.jpg"],
  },

  robots: {
    index: false,
    follow: false,
  },

  alternates: {
    canonical: "https://match.inst.lk/auth/verify-email",
  },
};

export default function Page({ searchParams }) {
  return <VerifyEmailPage searchParams={searchParams} />;
}