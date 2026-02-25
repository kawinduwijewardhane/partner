import Link from "next/link";
import Container from "@/components/layout/Container";

export const metadata = {
  metadataBase: new URL("https://match.inst.lk"),
  title: "Password Reset Successful",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <section className="py-24 bg-white">
      <Container className="max-w-md">
        <h1 className="text-3xl font-bold text-zinc-900">
          Password Updated
        </h1>

        <p className="mt-4 text-sm text-zinc-600">
          Your password has been successfully updated. You can now log in
          with your new credentials.
        </p>

        <div className="mt-10">
          <Link
            href="/auth/login"
            className="inline-block w-full text-center py-3 rounded-xl bg-[var(--base-color)] text-white text-sm font-medium"
          >
            Go to Login
          </Link>
        </div>
      </Container>
    </section>
  );
}