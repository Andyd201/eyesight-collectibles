"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// useSearchParams() requires a Suspense boundary at the page level (Next.js 16)
function LoginContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get("redirectTo") ?? "/account";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const supabase = createClient();

  async function handleEmailLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh(); // re-run Server Components with new session
  }

  async function handleGoogleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    });
    if (error) { setError(error.message); setLoading(false); }
  }

  async function handleDiscordLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    });
    if (error) { setError(error.message); setLoading(false); }
  }

  return (
    <div className="glass p-8 space-y-5">
      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <span className="text-red-400 text-lg shrink-0">⚠️</span>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* OAuth buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-surface-3 border border-border text-sm text-white hover:border-neon/40 hover:bg-surface-3/80 transition-all disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
        <button
          onClick={handleDiscordLogin}
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#5865F2]/20 border border-[#5865F2]/30 text-sm text-white hover:bg-[#5865F2]/30 transition-all disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#5865F2">
            <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
          </svg>
          Discord
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="font-mono text-xs text-muted">or continue with email</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Email form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full bg-surface-3 border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/60 transition-colors"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-mono text-xs text-neon uppercase tracking-wider">Password</label>
            <Link href="/auth/forgot-password" className="font-mono text-xs text-muted hover:text-neon transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full bg-surface-3 border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/60 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-neon w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In →"}
        </button>
      </form>

      <p className="text-center font-mono text-xs text-muted pt-2">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-neon hover:underline">
          Create one free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 dot-grid">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-neon/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-3xl">👁️</span>
            <div className="leading-none text-left">
              <span className="font-display text-2xl text-white tracking-widest">EYESIGHT</span>
              <span className="block font-mono text-[9px] text-neon tracking-[0.3em] uppercase">Collectibles</span>
            </div>
          </Link>
          <h1 className="font-display text-4xl text-white tracking-wide">Welcome Back</h1>
          <p className="text-muted text-sm mt-2">Sign in to your collector account</p>
        </div>

        <Suspense fallback={<div className="glass p-8 h-64 animate-pulse rounded-xl" />}>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
