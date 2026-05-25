-- ============================================================
-- EYESIGHT COLLECTIBLES — Row Level Security Policies
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================================
-- RLS blocks ALL access by default once enabled.
-- Each policy below grants specific access back.
-- ============================================================

-- ─── Helper function: is the current user an admin? ─────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- PROFILES
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view any profile (for community features)
CREATE POLICY "profiles: public read"
  ON profiles FOR SELECT USING (TRUE);

-- Users can only update their own profile
CREATE POLICY "profiles: owner update"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Profiles are created by the trigger (SECURITY DEFINER) — no direct insert
-- Admins can update any profile (e.g. to grant admin role)
CREATE POLICY "profiles: admin update"
  ON profiles FOR UPDATE USING (is_admin());

-- ============================================================
-- PRODUCTS
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can read active products
CREATE POLICY "products: public read active"
  ON products FOR SELECT USING (is_active = TRUE);

-- Admins can read everything (including inactive products)
CREATE POLICY "products: admin read all"
  ON products FOR SELECT USING (is_admin());

-- Only admins can create, update, or delete products
CREATE POLICY "products: admin insert"
  ON products FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "products: admin update"
  ON products FOR UPDATE USING (is_admin());

CREATE POLICY "products: admin delete"
  ON products FOR DELETE USING (is_admin());

-- ============================================================
-- SINGLES
-- ============================================================
ALTER TABLE singles ENABLE ROW LEVEL SECURITY;

-- Anyone can read in-stock singles
CREATE POLICY "singles: public read in-stock"
  ON singles FOR SELECT USING (in_stock = TRUE);

-- Admins can read all singles
CREATE POLICY "singles: admin read all"
  ON singles FOR SELECT USING (is_admin());

CREATE POLICY "singles: admin insert"
  ON singles FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "singles: admin update"
  ON singles FOR UPDATE USING (is_admin());

CREATE POLICY "singles: admin delete"
  ON singles FOR DELETE USING (is_admin());

-- ============================================================
-- GRADED CARDS
-- ============================================================
ALTER TABLE graded_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "graded: public read in-stock"
  ON graded_cards FOR SELECT USING (in_stock = TRUE);

CREATE POLICY "graded: admin read all"
  ON graded_cards FOR SELECT USING (is_admin());

CREATE POLICY "graded: admin insert"
  ON graded_cards FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "graded: admin update"
  ON graded_cards FOR UPDATE USING (is_admin());

CREATE POLICY "graded: admin delete"
  ON graded_cards FOR DELETE USING (is_admin());

-- ============================================================
-- ORDERS
-- ============================================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can only see their own orders
CREATE POLICY "orders: owner read"
  ON orders FOR SELECT USING (auth.uid() = user_id);

-- Anyone (logged in OR guest) can create an order.
-- Guest orders have user_id = NULL; authenticated orders link to the user.
CREATE POLICY "orders: insert"
  ON orders FOR INSERT WITH CHECK (
    user_id IS NULL OR auth.uid() = user_id
  );

-- Users cannot update or delete orders — only admins can (for status updates)
CREATE POLICY "orders: admin read all"
  ON orders FOR SELECT USING (is_admin());

CREATE POLICY "orders: admin update"
  ON orders FOR UPDATE USING (is_admin());

-- ============================================================
-- ORDER ITEMS
-- ============================================================
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can read items that belong to their own orders
CREATE POLICY "order_items: owner read"
  ON order_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- Items are inserted when an order is created (same user)
CREATE POLICY "order_items: owner insert"
  ON order_items FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items: admin read all"
  ON order_items FOR SELECT USING (is_admin());

-- ============================================================
-- CART ITEMS
-- ============================================================
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Users can only see their own cart
CREATE POLICY "cart: owner read"
  ON cart_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "cart: owner insert"
  ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart: owner update"
  ON cart_items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cart: owner delete"
  ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- WISHLISTS
-- ============================================================
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Users can only see their own wishlist
CREATE POLICY "wishlist: owner read"
  ON wishlists FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "wishlist: owner insert"
  ON wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "wishlist: owner delete"
  ON wishlists FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- SELL REQUESTS
-- ============================================================
ALTER TABLE sell_requests ENABLE ROW LEVEL SECURITY;

-- Anyone (logged in or not) can submit a sell request
CREATE POLICY "sell_requests: public insert"
  ON sell_requests FOR INSERT WITH CHECK (TRUE);

-- Logged-in users can see their own requests
CREATE POLICY "sell_requests: owner read"
  ON sell_requests FOR SELECT USING (auth.uid() = user_id);

-- Admins can see and update all requests
CREATE POLICY "sell_requests: admin read all"
  ON sell_requests FOR SELECT USING (is_admin());

CREATE POLICY "sell_requests: admin update"
  ON sell_requests FOR UPDATE USING (is_admin());

-- ============================================================
-- GRANT YOUR FIRST ADMIN
-- ============================================================
-- After creating your account, run this once to make yourself admin:
--
--   UPDATE profiles SET is_admin = TRUE WHERE id = 'your-user-uuid-here';
--
-- Or in Supabase Dashboard: Table Editor → profiles → edit your row.
-- ============================================================
