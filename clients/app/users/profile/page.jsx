import ProfilePage from "./ProfilePage";

export const metadata = {
  metadataBase: new URL("https://match.inst.lk"),

  title: "Profile Settings",

  description:
    "Manage your Match profile, personal details, and advertisement information.",

  robots: {
    index: false,
    follow: false,
  },

  alternates: {
    canonical: "https://match.inst.lk/users/profile",
  },
};

export default function Page() {
  return <ProfilePage />;
}