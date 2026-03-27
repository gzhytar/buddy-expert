import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

/** Edge: bez DB / Drizzle — stejné JWT jako v `auth.ts` díky `AUTH_SECRET` a callbacks. */
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const loggedIn = !!req.auth;
  const path = req.nextUrl.pathname;
  const isLogin = path === "/login";
  const isAuthRoute = path.startsWith("/api/auth");

  if (isAuthRoute) {
    return NextResponse.next();
  }

  if (isLogin && loggedIn) {
    return NextResponse.redirect(new URL("/orientation", req.nextUrl));
  }

  if (!loggedIn && !isLogin) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
