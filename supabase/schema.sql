-- ============================================================
-- EYESIGHT COLLECTIBLES — Full Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUM types ──────────────────────────────────────────────────────────────
CREATE TYPE product_category AS ENUM (
  'sealed', 'single', 'graded', 'accessory', 'merchandise'
);
CREATE TYPE product_language AS ENUM (
  'english', 'japanese', 'korean', 'chinese', 'other'
);
CREATE TYPE card_condition AS ENUM (
  'mint', 'near_mint', 'lightly_played', 'moderately_played', 'heavily_played', 'damaged'
);
CREATE TYPE grader AS ENUM ('PSA', 'CGC', 'BGS', 'CGC_PRISTINE', 'other');
CREATE TYPE order_status AS ENUM (
  'pending', 'payment_received', 'processing', 'shipped', 'delivered', 'refunded', 'cancelled'
);
CREATE TYPE sell_request_status AS ENUM (
  'submitted', 'reviewing', 'quoted', 'accepted', 'declined', 'completed'
);

-- ─── PROFILES ────────────────────────────────────────────────────────────────
-- Extends auth.users. Auto-created on signup via trigger.
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE,
  display_name  TEXT,
  avatar_url    TEXT,
  is_admin      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: auto-create profile on new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── PRODUCTS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  category        product_category NOT NULL,
  subcategory     TEXT,                          -- e.g. 'booster-box', 'etb', 'tin'
  set_name        TEXT,
  set_code        TEXT,
  language        product_language NOT NULL DEFAULT 'english',
  price           NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  original_price  NUMERIC(10, 2),
  stock           INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  in_stock        BOOLEAN GENERATED ALWAYS AS (stock > 0) STORED,
  images          TEXT[] NOT NULL DEFAULT '{}',  -- Cloudinary/Supabase storage URLs
  badge           TEXT,                          -- 'HOT', 'NEW', 'SALE', etc.
  featured        BOOLEAN NOT NULL DEFAULT FALSE,
  weight_grams    INTEGER,                       -- for shipping calculation
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category  ON products(category);
CREATE INDEX idx_products_language  ON products(language);
CREATE INDEX idx_products_in_stock  ON products(in_stock);
CREATE INDEX idx_products_featured  ON products(featured);

-- ─── SINGLES ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS singles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID REFERENCES products(id) ON DELETE CASCADE,
  pokemon_name    TEXT NOT NULL,
  set_name        TEXT NOT NULL,
  set_code        TEXT,
  card_number     TEXT,                          -- e.g. '223/197'
  rarity          TEXT,                          -- 'Special Art Rare', 'Hyper Rare', etc.
  language        product_language NOT NULL DEFAULT 'english',
  condition       card_condition NOT NULL DEFAULT 'near_mint',
  is_foil         BOOLEAN NOT NULL DEFAULT FALSE,
  is_graded       BOOLEAN NOT NULL DEFAULT FALSE,
  price           NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock           INTEGER NOT NULL DEFAULT 1 CHECK (stock >= 0),
  in_stock        BOOLEAN GENERATED ALWAYS AS (stock > 0) STORED,
  images          TEXT[] NOT NULL DEFAULT '{}',
  market_price    NUMERIC(10, 2),                -- pulled from TCGplayer API
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_singles_pokemon   ON singles(pokemon_name);
CREATE INDEX idx_singles_set       ON singles(set_name);
CREATE INDEX idx_singles_rarity    ON singles(rarity);
CREATE INDEX idx_singles_language  ON singles(language);
CREATE INDEX idx_singles_condition ON singles(condition);
CREATE INDEX idx_singles_price     ON singles(price);

-- Full-text search index on singles
CREATE INDEX idx_singles_fts ON singles
  USING GIN(to_tsvector('english', pokemon_name || ' ' || set_name || ' ' || COALESCE(rarity, '')));

-- ─── GRADED CARDS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS graded_cards (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID REFERENCES products(id) ON DELETE CASCADE,
  pokemon_name    TEXT NOT NULL,
  set_name        TEXT NOT NULL,
  card_number     TEXT,
  language        product_language NOT NULL DEFAULT 'english',
  grader          grader NOT NULL,
  grade           NUMERIC(3, 1) NOT NULL CHECK (grade >= 1 AND grade <= 10),
  cert_number     TEXT UNIQUE,                   -- PSA/CGC cert lookup
  price           NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  images          TEXT[] NOT NULL DEFAULT '{}',
  in_stock        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ORDERS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  status              order_status NOT NULL DEFAULT 'pending',
  subtotal            NUMERIC(10, 2) NOT NULL,
  shipping_cost       NUMERIC(10, 2) NOT NULL DEFAULT 0,
  tax                 NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total               NUMERIC(10, 2) NOT NULL,
  stripe_payment_id   TEXT,
  shipping_address    JSONB,
  tracking_number     TEXT,
  carrier             TEXT,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status  ON orders(status);

-- ─── ORDER ITEMS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE SET NULL,
  single_id   UUID REFERENCES singles(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,                     -- snapshot of product name at time of order
  price       NUMERIC(10, 2) NOT NULL,           -- snapshot of price
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  image_url   TEXT
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- ─── CART ITEMS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  single_id   UUID REFERENCES singles(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT cart_has_one_item CHECK (
    (product_id IS NOT NULL AND single_id IS NULL) OR
    (product_id IS NULL AND single_id IS NOT NULL)
  )
);

CREATE INDEX idx_cart_user_id ON cart_items(user_id);

-- ─── WISHLISTS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlists (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  single_id   UUID REFERENCES singles(id) ON DELETE CASCADE,
  added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id),
  UNIQUE (user_id, single_id)
);

CREATE INDEX idx_wishlist_user_id ON wishlists(user_id);

-- ─── SELL REQUESTS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sell_requests (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  description TEXT NOT NULL,
  offer_amount NUMERIC(10, 2),
  status      sell_request_status NOT NULL DEFAULT 'submitted',
  admin_notes TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Auto-update updated_at timestamps ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','products','singles','orders','sell_requests'] LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at()', t
    );
  END LOOP;
END $$;
