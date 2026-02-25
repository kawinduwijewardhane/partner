"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Container from "./Container";
import Logo from "../Logo";
import Button from "../ui/Button";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { useAuth } from "@/context/AuthProvider";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 Close dropdown + mobile menu when user changes (login/logout)
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [user]);

  // 🔥 Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const fullName =
    user?.displayFullName && user?.firstName && user?.lastName
      ? `${user?.firstName} ${user?.lastName}`
      : null;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-zinc-200">
      <Container className="flex items-center justify-between h-16">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className="text-zinc-700 hover:text-zinc-900 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/explore"
            className="text-zinc-700 hover:text-zinc-900 transition-colors"
          >
            Explore
          </Link>

          {!loading && !user && (
            <>
              <Link
                href="/auth/login"
                className="text-zinc-700 hover:text-zinc-900 transition-colors"
              >
                Login
              </Link>

              <Link href="/auth/register">
                <Button variant="brand" className="rounded-xl px-5">
                  Create Account
                </Button>
              </Link>
            </>
          )}

          {!loading && user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-zinc-100 transition"
              >
                <div className="!w-12.5 !h-12.5 overflow-hidden rounded-full">
                  <Image
                    src={user?.avatarUrl}
                    alt={user?.username}
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                  />
                </div>

                <div className="text-left">
                  <div className="text-sm font-semibold text-zinc-900">
                    @{user?.username}
                  </div>
                  {fullName && (
                    <div className="text-xs text-zinc-500">{fullName}</div>
                  )}
                </div>

                <FiChevronDown className="text-zinc-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-zinc-200 rounded-2xl py-2 text-sm shadow-lg">
                  <Link
                    href={`/user/${user?.username}`}
                    target="_blank"
                    className="block px-4 py-3 hover:bg-zinc-50"
                  >
                    Public Profile
                  </Link>

                  <Link
                    href="/users/profile"
                    className="block px-4 py-3 hover:bg-zinc-50"
                  >
                    Update Profile
                  </Link>

                  <div className="border-t border-zinc-200 my-2" />

                  <button
                    onClick={async () => {
                      setDropdownOpen(false);
                      await logout();
                      router.push("/auth/login");
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-2xl text-zinc-800"
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </Container>

      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white">
          <Container className="flex flex-col py-6 gap-4 text-base font-medium">
            {!loading && !user && (
              <>
                <Link href="/" className="text-zinc-700">
                  Home
                </Link>
                <Link href="/explore" className="text-zinc-700">
                  Explore
                </Link>
                <Link href="/auth/login" className="text-zinc-700">
                  Login
                </Link>

                <Link href="/auth/register">
                  <Button variant="brand" className="w-full rounded-xl">
                    Create Account
                  </Button>
                </Link>
              </>
            )}

            {!loading && user && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12">
                    <Image
                      src={user?.avatarUrl}
                      alt={user?.username}
                      width={100}
                      height={100}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">@{user?.username}</div>
                    {fullName && (
                      <div className="text-sm text-zinc-500">{fullName}</div>
                    )}
                  </div>
                </div>

                <Link href="/">Home</Link>
                <Link href="/explore">Explore</Link>

                <Link href={`/user/${user?.username}`} target="_blank">
                  Public Profile
                </Link>

                <Link href="/users/profile">Update Profile</Link>

                <button
                  onClick={async () => {
                    setMobileOpen(false);
                    await logout();
                    router.push("/auth/login");
                  }}
                  className="text-red-600 text-left"
                >
                  Logout
                </button>
              </>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}
