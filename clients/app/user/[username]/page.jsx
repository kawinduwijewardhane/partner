import { LuUserRoundX } from "react-icons/lu";
import PublicPage from "./PublicPage";

import { cookies } from "next/headers";
import Link from "next/link";

async function getUser(username) {
  const cookieStore = await cookies();

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "https://api.inst.lk";

  try {
    const res = await fetch(`${baseUrl}/user/${username}`, {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (!json.success) return null;

    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata(props) {
  const { username } = await props.params;
  const user = await getUser(username);

  if (!user) {
    return {
      title: "Profile Not Found | Match",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = user.fullName
    ? `${user.fullName} (@${user.username})`
    : `@${user.username}`;

  const description =
    user.adDescription?.slice(0, 160) ||
    "Discover genuine and meaningful connections on Match.";

  const profileUrl = `https://match.inst.lk/user/${user.username}`;

  return {
    metadataBase: new URL("https://match.inst.lk"),

    title: {
      absolute: title,
    },

    description,

    openGraph: {
      type: "profile",
      locale: "en_US",
      url: profileUrl,
      siteName: "Match",
      title,
      description,
      images: user.avatarUrl
        ? [
            {
              url: user.avatarUrl,
              width: 800,
              height: 800,
              alt: title,
            },
          ]
        : [
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
      title,
      description,
      images: user.avatarUrl
        ? [user.avatarUrl]
        : ["https://match.inst.lk/og-image.jpg"],
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
      canonical: profileUrl,
    },
  };
}

export default async function Page(props) {
  const { username } = await props.params;
  const user = await getUser(username);

  if (!user) {
    return (
      <div className="py-28">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
              <LuUserRoundX className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-zinc-900">
                Profile Not Available
              </h1>
              <p className="text-sm text-zinc-600 leading-relaxed">
                The profile you’re looking for doesn’t exist, may have been
                removed, or is currently not available. If you believe this is a
                mistake, please check the username or try again later.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Link
                href="/"
                className="px-5 py-2 text-sm rounded-lg border border-zinc-200 hover:bg-zinc-50 transition"
              >
                Go to Homepage
              </Link>

              <Link
                href="/search"
                className="px-5 py-2 text-sm rounded-lg bg-[var(--base-color)] text-white hover:opacity-90 transition"
              >
                Browse Profiles
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <PublicPage user={user} />;
}
