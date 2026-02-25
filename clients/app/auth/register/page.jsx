import RegisterPage from "./RegisterPage";

export const metadata = {
  metadataBase: new URL("https://match.inst.lk"),

  title: "Create Account",

  description:
    "Create your Match account and begin your journey toward meaningful and genuine relationships.",

  keywords: [
    "Match register",
    "create Match account",
    "relationship platform signup",
  ],

  openGraph: {
    type: "website",
    url: "https://match.inst.lk/auth/register",
    siteName: "Match",
    title: "Create Account | Match",
    description: "Join Match and create your relationship profile today.",
    images: [
      {
        url: "https://match.inst.lk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Create Match Account",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Create Account | Match",
    description: "Sign up on Match and start connecting.",
    images: ["https://match.inst.lk/og-image.jpg"],
  },

  robots: {
    index: false,
    follow: false,
  },

  alternates: {
    canonical: "https://match.inst.lk/auth/register",
  },
};

export default function Page({ searchParams }) {
  return <RegisterPage searchParams={searchParams} />;
}
