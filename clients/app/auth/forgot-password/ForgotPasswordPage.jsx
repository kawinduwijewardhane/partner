"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("If the email is registered, a reset link has been sent.");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-24 bg-white">
      <Container className="max-w-md">
        <h1 className="text-3xl font-bold text-zinc-900">
          Forgot your password?
        </h1>

        <p className="mt-3 text-sm text-zinc-600">
          Enter your email address and we’ll send you a link to reset your
          password.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
            />

            <Button
              type="submit"
              variant="brand"
              className="w-full py-3 rounded-xl"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send reset link"}
            </Button>

            <div className="text-sm text-center">
              <Link
                href="/auth/login"
                className="text-zinc-500 hover:text-[var(--base-color)]"
              >
                Back to login
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-10 space-y-6">
            <div className="rounded-xl border border-zinc-200 p-6 text-sm text-zinc-600">
              If the email exists in our system, a password reset link has
              been sent.
            </div>

            <div className="text-sm text-center">
              <Link
                href="/auth/login"
                className="text-zinc-500 hover:text-[var(--base-color)]"
              >
                Back to login
              </Link>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}