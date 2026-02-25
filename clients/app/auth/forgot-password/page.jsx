import ForgotPasswordPage from "./ForgotPasswordPage";

export const metadata = {
  metadataBase: new URL("https://match.inst.lk"),

  title: "Forgot Password",

  description:
    "Reset your Match account password securely and regain access to your profile.",

  openGraph: {
    type: "website",
    url: "https://match.inst.lk/auth/forgot-password",
    siteName: "Match",
    title: "Forgot Password | Match",
    description:
      "Request a secure password reset link for your Match account.",
    images: [
      {
        url: "https://match.inst.lk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Forgot Password | Match",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Forgot Password | Match",
    description: "Reset your Match account password securely.",
    images: ["https://match.inst.lk/og-image.jpg"],
  },

  robots: {
    index: false,
    follow: false,
  },

  alternates: {
    canonical: "https://match.inst.lk/auth/forgot-password",
  },
};

export default function Page() {
  return <ForgotPasswordPage />;
}