import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️  Supabase env vars not set. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
  );
}

export const supabase = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "placeholder"
);

// ─── Products ─────────────────────────────────────────────
export async function getProducts({ category, limit = 12, offset = 0 } = {}) {
  let query = supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function searchProducts(query) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${query}%,pokemon_name.ilike.%${query}%,set_name.ilike.%${query}%`)
    .limit(20);
  if (error) throw error;
  return data;
}

// ─── Singles ──────────────────────────────────────────────
export async function getSingles({ pokemon, set, rarity, language, minPrice, maxPrice, condition, limit = 24 } = {}) {
  let query = supabase
    .from("singles")
    .select("*")
    .eq("in_stock", true)
    .order("price", { ascending: true })
    .limit(limit);

  if (pokemon)   query = query.ilike("pokemon_name", `%${pokemon}%`);
  if (set)       query = query.eq("set_name", set);
  if (rarity)    query = query.eq("rarity", rarity);
  if (language)  query = query.eq("language", language);
  if (condition) query = query.eq("condition", condition);
  if (minPrice)  query = query.gte("price", minPrice);
  if (maxPrice)  query = query.lte("price", maxPrice);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// ─── Auth ─────────────────────────────────────────────────
export async function signUp(email, password) {
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ─── Wishlist ─────────────────────────────────────────────
export async function addToWishlist(userId, productId) {
  const { error } = await supabase
    .from("wishlists")
    .insert({ user_id: userId, product_id: productId });
  if (error) throw error;
}

export async function getWishlist(userId) {
  const { data, error } = await supabase
    .from("wishlists")
    .select("product_id, products(*)")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}
