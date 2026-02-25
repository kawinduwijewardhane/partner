"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import api from "@/lib/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <section className="py-24 bg-white">
        <Container className="max-w-md">
          <h1 className="text-3xl font-bold text-zinc-900">
            Invalid Reset Link
          </h1>
          <p className="mt-4 text-sm text-zinc-600">
            This reset link is invalid or expired.
          </p>
          <div className="mt-8">
            <Link
              href="/auth/forgot-password"
              className="text-[var(--base-color)] hover:underline text-sm"
            >
              Request new reset link
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        token,
        password,
      });

      toast.success("Password reset successful");
      router.push("/auth/reset-success");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Invalid or expired reset link";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const passwordsMatch =
    confirmPassword.length === 0 || password === confirmPassword;

  return (
    <section className="py-24 bg-white">
      <Container className="max-w-md">
        <h1 className="text-3xl font-bold text-zinc-900">
          Reset Your Password
        </h1>

        <p className="mt-3 text-sm text-zinc-600">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <input
            type="password"
            placeholder="New password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
          />

          <input
            type="password"
            placeholder="Confirm new password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none ${
              passwordsMatch
                ? "border-zinc-200"
                : "border-red-500"
            }`}
          />

          {!passwordsMatch && (
            <p className="text-sm text-red-500">
              Passwords do not match
            </p>
          )}

          <Button
            type="submit"
            variant="brand"
            className="w-full py-3 rounded-xl"
            disabled={
              loading ||
              !password ||
              !confirmPassword ||
              password !== confirmPassword
            }
          >
            {loading ? "Updating..." : "Update Password"}
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
      </Container>
    </section>
  );
}