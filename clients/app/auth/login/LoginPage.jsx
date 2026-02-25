"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { getSafeRedirect } from "@/lib/safeRedirect";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";

export default function LoginPage({ searchParams }) {
  const router = useRouter();
  const { refreshSession } = useAuth();
  const redirectTo = getSafeRedirect(new URLSearchParams(searchParams));

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/login", form);

      await refreshSession();

      toast.success("Login successful");

      router.push(redirectTo || "/users/profile");
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-24 bg-white">
      <Container className="max-w-md">
        <h1 className="text-3xl font-bold text-zinc-900">Welcome Back</h1>

        <p className="mt-3 text-sm text-zinc-600">
          Don’t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-[var(--base-color)] hover:underline"
          >
            Create one
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            autoComplete="email"
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            autoComplete="current-password"
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
          />

          <div className="flex justify-end text-sm">
            <Link
              href="/auth/forgot-password"
              className="text-zinc-500 hover:text-[var(--base-color)]"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="brand"
            className="w-full py-3 rounded-xl"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>

          <p className="text-xs text-zinc-500 text-center mt-4">
            By logging in, you agree to our{" "}
            <Link href="/terms" className="underline hover:opacity-80">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:opacity-80">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </Container>
    </section>
  );
}
