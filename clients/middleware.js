import { NextResponse } from "next/server";

export function middleware(request) {
  const accessToken = request.cookies.get("access_token");

  const protectedRoutes = ["/users/profile", "/create_ad"];

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !accessToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set(
      "redirect",
      request.nextUrl.pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/users/profile/:path*", "/create_ad/:path*"],
};