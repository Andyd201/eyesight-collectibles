import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// ─── Protected routes (require login) ────────────────────────────────────────
const PROTECTED = ["/account", "/checkout"];

// ─── Auth routes (redirect to /account if already logged in) ─────────────────
const AUTH_ROUTES = ["/auth/login", "/auth/signup"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Refresh session + get user & supabase client
  const { supabaseResponse, user, supabase } = await updateSession(request);

  // 2. Protect /account and /checkout — redirect to login if not authenticated
  if (PROTECTED.some((r) => pathname.startsWith(r)) && !user) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // 3. Protect /admin — just require login; the admin layout checks is_admin
  if (pathname.startsWith("/admin") && !user) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // 4. Redirect already-logged-in users away from auth pages
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && user) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
