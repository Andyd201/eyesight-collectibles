"use client";

// This page catches old-format reset links and expired/invalid OTP errors.
// Supabase sends users here when the reset link is invalid or expired.
// New emails now go through /auth/callback → /auth/update-password instead.

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("checking"); // checking | error | ready
  const [error,  setError]  = useState(null);

  const errorCode = searchParams.get("error_code");
  const errorDesc = searchParams.get("error_description") ?? searchParams.get("error");

  useEffect(() => {
    // If there's an error in the URL, show it immediately
    if (errorCode || errorDesc) {
      setError(errorDesc ?? errorCode);
      setStatus("error");
      return;
    }

    // Check if Supabase sent tokens in the hash (old implicit flow)
    const hash   = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const hashError = params.get("error_code") ?? params.get("error");

    if (hashError) {
      setError(params.get("error_description") ?? hashError);
      setStatus("error");
      return;
    }

    // No error params → might be an old-style recovery link with hash tokens
    const accessToken = params.get("access_token");
    const type        = params.get("type");

    if (accessToken && type === "recovery") {
      // Old implicit-flow token — set session manually and redirect to update-password
      const supabase = createClient();
      supabase.auth.setSession({
        access_token:  accessToken,
        refresh_token: params.get("refresh_token") ?? "",
      }).then(({ error }) => {
        if (error) { setError(error.message); setStatus("error"); return; }
        window.location.href = "/auth/update-password";
      });
      return;
    }

    // Nothing useful here — probably a direct visit
    setError("This reset link is invalid or has already been used.");
    setStatus("error");
  }, [errorCode, errorDesc]);

  /* ── Error state ─────────────────────────────────────────── */
  if (status === "error") {
    const isExpired = error?.toLowerCase().includes("expired") ||
                      error?.toLowerCase().includes("otp_expired");
    return (
      <div className="text-center space-y-5">
        <span className="text-5xl block">{isExpired ? "⏰" : "❌"}</span>
        <h1 className="font-display text-3xl text-white tracking-wide">
          {isExpired ? "Link Expired" : "Invalid Link"}
        </h1>
        <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
          {isExpired
            ? "This password reset link has expired (links are valid for 1 hour). Request a new one below."
            : "This link is invalid or has already been used. Please request a new reset link."}
        </p>
        <Link href="/auth/forgot-password" className="btn-neon inline-block py-2.5 px-6 mt-2">
          Request New Link →
        </Link>
        <p className="text-center font-mono text-xs text-muted pt-2">
          <Link href="/auth/login" className="text-neon hover:underline">← Back to Login</Link>
        </p>
      </div>
    );
  }

  /* ── Checking / loading ──────────────────────────────────── */
  return (
    <div className="text-center space-y-4">
      <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-muted text-sm">Verifying your link…</p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 dot-grid">
      <div className="glass max-w-md w-full p-8">
        <Suspense fallback={
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
