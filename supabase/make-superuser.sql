-- ============================================================
-- MAKE YOURSELF SUPERUSER (Admin)
-- ============================================================
-- Run this in Supabase Dashboard → SQL Editor
-- AFTER you have created your account on the website
-- ============================================================

-- Step 1: Find your user ID (run this first)
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at ASC;

-- Step 2a: Set is_admin in the profiles table (used by RLS policies)
UPDATE public.profiles
SET is_admin = TRUE
WHERE id = 'PASTE-YOUR-UUID-HERE';

-- Step 2b: Set is_admin in auth app_metadata (used by Next.js server actions and admin layout)
-- The Next.js code reads user.app_metadata.is_admin from the JWT, so BOTH must be set.
-- This merges {"is_admin": true} into the existing app_metadata object.
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"is_admin": true}'::jsonb
WHERE id = 'PASTE-YOUR-UUID-HERE';

-- Step 3: Verify it worked
SELECT
  u.id,
  u.email,
  u.raw_app_meta_data->>'is_admin'  AS app_meta_is_admin,
  p.is_admin                          AS profile_is_admin
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
WHERE p.is_admin = TRUE
   OR (u.raw_app_meta_data->>'is_admin')::boolean = TRUE;

-- ============================================================
-- After this, reload your session (sign out and sign back in),
-- then go to /admin in your browser.
-- You'll have full access to all inventory management tools.
-- ============================================================
