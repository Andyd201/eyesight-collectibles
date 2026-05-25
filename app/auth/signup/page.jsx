"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm]       = useState({ email: "", password: "", confirm: "", username: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { username: form.username },           // stored in raw_user_meta_data
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 dot-grid">
        <div className="glass max-w-md w-full p-10 text-center space-y-4">
          <span className="text-5xl">📬</span>
          <h2 className="font-display text-3xl text-white tracking-wide">Check your email</h2>
          <p className="text-muted text-sm">
            We sent a confirmation link to <span className="text-neon">{form.email}</span>. Click it to activate your account.
          </p>
          <Link href="/" className="btn-outline inline-block mt-4">Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 dot-grid">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-neon/8 blur-3xl pointer-events-none" />

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
          <h1 className="font-display text-4xl text-white tracking-wide">Join the Community</h1>
          <p className="text-muted text-sm mt-2">Free account — wishlists, order tracking, breaks & more</p>
        </div>

        <div className="glass p-8 space-y-5">
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <span className="text-red-400 shrink-0">⚠️</span>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Username</label>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="collector123"
                className="w-full bg-surface-3 border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/60 transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full bg-surface-3 border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/60 transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Min 8 characters"
                className="w-full bg-surface-3 border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/60 transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Confirm Password</label>
              <input
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-surface-3 border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/60 transition-colors"
              />
            </div>

            {/* Password strength indicator */}
            {form.password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => {
                    const strength = Math.min(4, Math.floor(form.password.length / 3));
                    return (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= strength
                            ? strength <= 1 ? "bg-red-500"
                            : strength <= 2 ? "bg-yellow-500"
                            : strength <= 3 ? "bg-green-500"
                            : "bg-neon"
                            : "bg-surface-3"
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="font-mono text-xs text-muted">
                  {form.password.length < 8 ? "Too short" : form.password.length < 12 ? "Good" : "Strong 💪"}
                </p>
              </div>
            )}

            <p className="text-xs text-muted">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="text-neon hover:underline">Terms</Link> and{" "}
              <Link href="/privacy" className="text-neon hover:underline">Privacy Policy</Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="btn-neon w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p className="text-center font-mono text-xs text-muted pt-2">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-neon hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
