// Middleware Supabase client — used exclusively in middleware.js

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl || !supabaseKey ||
    supabaseUrl === "https://your-project-ref.supabase.co" ||
    supabaseKey === "your-anon-key-here"
  ) {
    return { supabaseResponse: NextResponse.next({ request }), user: null, supabase: null };
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Must call getUser() to refresh the session JWT (getSession() doesn't validate)
  const { data: { user } } = await supabase.auth.getUser();

  // Return supabase client so middleware.js can make additional queries (e.g. profile check)
  return { supabaseResponse, user, supabase };
}
