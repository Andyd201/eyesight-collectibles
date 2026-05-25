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

-- Step 2: Copy your UUID from above, paste it below, then run:
UPDATE public.profiles
SET is_admin = TRUE
WHERE id = 'PASTE-YOUR-UUID-HERE';

-- Step 3: Verify it worked
SELECT id, username, display_name, is_admin
FROM public.profiles
WHERE is_admin = TRUE;

-- ============================================================
-- After this, go to /admin in your browser.
-- You'll have full access to all inventory management tools.
-- ============================================================
