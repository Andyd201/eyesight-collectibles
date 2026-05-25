"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [done,     setDone]     = useState(false);
  const router   = useRouter();
  const supabase = createClient();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8)  { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) { setError(error.message); return; }
    setDone(true);
    setTimeout(() => router.push("/account"), 2500);
  }

  const ic = "w-full bg-surface-3 border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/60";
  const lc = "font-mono text-xs text-neon uppercase tracking-wider block mb-1";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 dot-grid">
      <div className="glass max-w-md w-full p-8 space-y-5">

        {done ? (
          <div className="text-center space-y-4">
            <span className="text-5xl">✅</span>
            <h2 className="font-display text-3xl text-white tracking-wide">Password updated!</h2>
            <p className="text-muted text-sm">Redirecting you to your account…</p>
          </div>
        ) : (
          <>
            <div>
              <h1 className="font-display text-3xl text-white tracking-wide">New Password</h1>
              <p className="text-muted text-sm mt-1">Choose a strong password for your account.</p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={lc}>New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className={ic}
                />
              </div>
              <div>
                <label className={lc}>Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  placeholder="Repeat your password"
                  className={ic}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-neon w-full py-3 disabled:opacity-50"
              >
                {loading ? "Updating…" : "Update Password →"}
              </button>
            </form>

            <p className="text-center font-mono text-xs text-muted">
              <Link href="/auth/login" className="text-neon hover:underline">← Back to Login</Link>
            </p>
          </>
        )}

      </div>
    </div>
  );
}
