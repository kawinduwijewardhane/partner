"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { getSafeRedirect } from "@/lib/safeRedirect";
import api from "@/lib/api";
import { FiInfo } from "react-icons/fi";
import { useAuth } from "@/context/AuthProvider";

export default function RegisterPage({ searchParams }) {
  const router = useRouter();
  const { refreshSession } = useAuth();

  const redirectTo = getSafeRedirect(new URLSearchParams(searchParams));

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    gender: "male",
  });

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!agree) {
      toast.error("You must agree to the Terms and Privacy Policy");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", form);

      // Important: refresh session so AuthContext loads user
      await refreshSession();

      toast.success(
        "Account created successfully. Please verify your email."
      );

      router.push(redirectTo || "/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-24 bg-white">
      <Container className="max-w-md">
        <h1 className="text-3xl font-bold text-zinc-900">
          Create Your Account
        </h1>

        <p className="mt-3 text-sm text-zinc-600">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-[var(--base-color)] hover:underline"
          >
            Login
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div className="grid lg:grid-cols-2 gap-4">
            <input
              name="firstName"
              placeholder="First Name"
              required
              onChange={handleChange}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              required
              onChange={handleChange}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          <input
            name="username"
            placeholder="Username"
            required
            autoComplete="off"
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            autoComplete="off"
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
          />

          <div className="flex items-start gap-3 p-4 rounded-md border border-amber-200 bg-amber-50 text-amber-800">
            <div className="mt-0.5 text-amber-600">
              <FiInfo size={18} />
            </div>

            <p className="text-sm leading-relaxed">
              Your email is used only for verification and important security
              notifications. It is never displayed publicly or shared with
              third parties.
            </p>
          </div>

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            autoComplete="new-password"
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
          />

          <div className="grid grid-cols-2 gap-3">
            {["male", "female"].map((g) => (
              <label
                key={g}
                className={`cursor-pointer rounded-xl border px-4 py-3 text-sm text-center transition-all ${
                  form.gender === g
                    ? "border-[var(--base-color)] bg-[var(--base-color)]/10 text-[var(--base-color)]"
                    : "border-zinc-200 text-zinc-700 hover:border-[var(--base-color)] hover:text-[var(--base-color)]"
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={form.gender === g}
                  onChange={handleChange}
                  className="hidden"
                />
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </label>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="cursor-pointer"
            />
            <p className="text-xs text-zinc-500 text-center">
              I agree to the{" "}
              <Link href="/terms" className="underline hover:opacity-80">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:opacity-80">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <Button
            type="submit"
            variant="brand"
            className="w-full py-3 rounded-xl"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>
      </Container>
    </section>
  );
}