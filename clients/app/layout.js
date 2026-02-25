
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthProvider";


export const metadata = {
  metadataBase: new URL("https://match.inst.lk"),

  title: {
    default: "Match – Meaningful Relationships",
    template: "%s | Match",
  },

  description:
    "Match is a modern platform designed for individuals seeking genuine and meaningful relationships. Create your profile and connect with like-minded people.",

  keywords: [
    "match",
    "life partner",
    "serious relationship",
    "meaningful connections",
    "find partner",
    "Sri Lanka relationships",
  ],

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://match.inst.lk",
    siteName: "Match",
    title: "Match – Meaningful Relationships",
    description:
      "Discover genuine and meaningful connections in a modern and respectful environment.",
    images: [
      {
        url: "https://match.inst.lk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Match – Meaningful Relationships",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Match – Meaningful Relationships",
    description: "Create your profile and discover meaningful connections.",
    images: ["https://match.inst.lk/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://match.inst.lk",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap"
        rel="stylesheet"
      ></link>
      <body className={` antialiased bg-white text-neutral-900`}>
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster position="top-center" richColors />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
