// OAuth & email confirmation callback handler
// Supabase redirects here after login via Google, Discord, email magic link, or password reset

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);

  const code  = searchParams.get("code");
  const next  = searchParams.get("next") ?? "/account";
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");

  // Supabase sent an error (e.g. expired OTP, invalid link)
  if (error || errorCode) {
    // If it was a recovery (password reset) flow, send back to forgot-password with a message
    if (next.includes("update-password")) {
      return NextResponse.redirect(`${origin}/auth/forgot-password?error=link_expired`);
    }
    return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Exchange failed — if recovery flow, redirect to forgot-password
    if (next.includes("update-password")) {
      return NextResponse.redirect(`${origin}/auth/forgot-password?error=link_expired`);
    }
  }

  // Fallback
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
