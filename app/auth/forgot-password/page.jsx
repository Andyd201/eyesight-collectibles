"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState(null);
  const [banner,  setBanner]  = useState(null);

  const supabase = createClient();

  useEffect(() => {
    if (searchParams.get("error") === "link_expired") {
      setBanner("Your reset link has expired. Enter your email to receive a new one.");
    }
  }, [searchParams]);

  async function handleReset(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
    });

    setLoading(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <span className="text-5xl">📧</span>
        <h2 className="font-display text-3xl text-white tracking-wide">Check your inbox</h2>
        <p className="text-muted text-sm">
          We sent a password reset link to <span className="text-neon">{email}</span>.
          <br />
          The link expires in <span className="text-white">1 hour</span>.
        </p>
        <Link href="/auth/login" className="btn-outline inline-block mt-2">Back to Login</Link>
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="font-display text-3xl text-white tracking-wide">Reset Password</h1>
        <p className="text-muted text-sm mt-1">Enter your email and we&apos;ll send a reset link.</p>
      </div>

      {/* Expired link banner */}
      {banner && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <p className="text-amber-400 text-sm">⏰ {banner}</p>
        </div>
      )}

      {/* Form error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full bg-surface-3 border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/60"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-neon w-full py-3 disabled:opacity-50">
          {loading ? "Sending…" : "Send Reset Link →"}
        </button>
      </form>

      <p className="text-center font-mono text-xs text-muted">
        <Link href="/auth/login" className="text-neon hover:underline">← Back to Login</Link>
      </p>
    </>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 dot-grid">
      <div className="glass max-w-md w-full p-8 space-y-5">
        <Suspense fallback={<div className="h-64" />}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
