// Browser-side Supabase client
// Use this in Client Components ("use client")

import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured =
  SUPABASE_URL &&
  SUPABASE_KEY &&
  SUPABASE_URL !== "https://your-project-ref.supabase.co" &&
  SUPABASE_KEY !== "your-anon-key-here";

if (!isConfigured) {
  console.warn(
    "⚠️  Supabase is not configured.\n" +
    "   Open .env.local and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.\n" +
    "   Get these values from: supabase.com/dashboard → your project → Settings → API"
  );
}

export function createClient() {
  return createBrowserClient(
    SUPABASE_URL ?? "https://placeholder.supabase.co",
    SUPABASE_KEY ?? "placeholder"
  );
}
