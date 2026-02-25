"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default function VerifyEmailPage({ searchParams }) {
  const router = useRouter();
  const token = searchParams?.token;

  const [status, setStatus] = useState("loading");
  const [email, setEmail] = useState("");
  const [loadingResend, setLoadingResend] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    async function verify() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Verification failed");
        }

        setStatus("success");
        toast.success("Email verified successfully");

        setTimeout(() => {
          router.push("/create_ad");
        }, 2000);
      } catch (err) {
        setStatus("error");
        toast.error(err.message || "Invalid or expired token");
      }
    }

    verify();
  }, [token, router]);

  async function handleResend() {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoadingResend(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to resend");
      }

      toast.success("Verification email sent");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoadingResend(false);
    }
  }

  return (
    <section className="py-24 bg-white">
      <Container className="max-w-md text-center">

        {status === "loading" && (
          <>
            <h1 className="text-3xl font-bold text-zinc-900">
              Verifying Your Email
            </h1>
            <p className="mt-4 text-sm text-zinc-600">
              Please wait while we confirm your email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-3xl font-bold text-zinc-900">
              Email Verified
            </h1>
            <p className="mt-4 text-sm text-zinc-600">
              Your account has been successfully activated.
              Redirecting you shortly...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-3xl font-bold text-zinc-900">
              Verification Failed
            </h1>

            <p className="mt-4 text-sm text-zinc-600">
              The verification link may have expired or is invalid.
              You can request a new verification email below.
            </p>

            <div className="mt-8 space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border px-4 py-3 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                variant="brand"
                className="w-full py-3 rounded-xl"
                onClick={handleResend}
                disabled={loadingResend}
              >
                {loadingResend ? "Sending..." : "Resend Verification"}
              </Button>
            </div>
          </>
        )}

        {status === "invalid" && (
          <>
            <h1 className="text-3xl font-bold text-zinc-900">
              Invalid Request
            </h1>
            <p className="mt-4 text-sm text-zinc-600">
              No verification token provided.
            </p>
          </>
        )}

      </Container>
    </section>
  );
}