import Container from "./Container";
import Link from "next/link";
import Logo from "../Logo";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-zinc-200 bg-white">
      <Container className="py-16">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-6 text-sm text-zinc-600 leading-relaxed">
              A modern platform built to help individuals present themselves
              clearly and connect with purpose.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-12 text-sm">
            <div className="flex flex-col gap-4">
              <span className="font-medium text-zinc-900">Platform</span>
              <Link
                href="/explore"
                className="text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Explore
              </Link>
              <Link
                href="/users/profile"
                className="text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Create Profile
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-medium text-zinc-900">Legal</span>
              <Link
                href="/terms"
                className="text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/contact"
                className="text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-100 text-sm text-zinc-500 flex flex-col sm:flex-row justify-between gap-4">
          <span>© {new Date().getFullYear()} Match. All rights reserved.</span>
          <span>Designed for meaningful connections.</span>
        </div>
      </Container>
    </footer>
  );
}
