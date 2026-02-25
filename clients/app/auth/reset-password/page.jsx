import ResetPasswordPage from "./ResetPasswordPage";

export const metadata = {
  metadataBase: new URL("https://match.inst.lk"),
  title: "Reset Password",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "https://match.inst.lk/auth/reset-password",
  },
};

export default function Page({ searchParams }) {
  return <ResetPasswordPage searchParams={searchParams} />;
}