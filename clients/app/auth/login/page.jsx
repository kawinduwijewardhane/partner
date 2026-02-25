import LoginPage from "./LoginPage";

export const metadata = {
  metadataBase: new URL("https://match.inst.lk"),

  title: "Login",

  description:
    "Login to your Match account to manage your profile and connect with meaningful relationships.",

  keywords: [
    "Match login",
    "login Match",
    "relationship platform login",
  ],

  openGraph: {
    type: "website",
    url: "https://match.inst.lk/auth/login",
    siteName: "Match",
    title: "Login | Match",
    description:
      "Access your Match account and continue your journey toward meaningful connections.",
    images: [
      {
        url: "https://match.inst.lk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Login to Match",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Login | Match",
    description:
      "Login to your Match account.",
    images: ["https://match.inst.lk/og-image.jpg"],
  },

  robots: {
    index: false,
    follow: false,
  },

  alternates: {
    canonical: "https://match.inst.lk/auth/login",
  },
};

export default function Page({ searchParams }) {
  return <LoginPage searchParams={searchParams} />;
}