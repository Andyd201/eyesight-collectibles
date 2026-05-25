"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUser, getProfile } from "@/lib/supabase/server";

async function assertAdmin() {
  const user = await getUser();
  if (!user || !user.app_metadata?.is_admin) throw new Error("Unauthorized");
}

// ─── SINGLES ──────────────────────────────────────────────────────────────────

export async function createSingle(formData) {
  await assertAdmin();
  const supabase = await createClient();

  const data = {
    pokemon_name: formData.get("pokemon_name"),
    set_name:     formData.get("set_name"),
    set_code:     formData.get("set_code") ?? null,
    card_number:  formData.get("card_number") ?? null,
    rarity:       formData.get("rarity") ?? null,
    language:     formData.get("language") ?? "english",
    condition:    formData.get("condition") ?? "near_mint",
    is_foil:      formData.get("is_foil") === "true",
    price:        parseFloat(formData.get("price")),
    stock:        parseInt(formData.get("stock") ?? "1", 10),
    market_price: formData.get("market_price") ? parseFloat(formData.get("market_price")) : null,
    images:       [],
  };

  const { error } = await supabase.from("singles").insert(data);
  if (error) return { error: error.message };

  revalidatePath("/admin/singles");
  revalidatePath("/singles");
  return { success: true };
}

export async function updateSingle(id, formData) {
  await assertAdmin();
  const supabase = await createClient();

  const data = {
    pokemon_name: formData.get("pokemon_name"),
    set_name:     formData.get("set_name"),
    set_code:     formData.get("set_code") ?? null,
    card_number:  formData.get("card_number") ?? null,
    rarity:       formData.get("rarity") ?? null,
    language:     formData.get("language") ?? "english",
    condition:    formData.get("condition") ?? "near_mint",
    is_foil:      formData.get("is_foil") === "true",
    price:        parseFloat(formData.get("price")),
    stock:        parseInt(formData.get("stock") ?? "1", 10),
    market_price: formData.get("market_price") ? parseFloat(formData.get("market_price")) : null,
  };

  const { error } = await supabase.from("singles").update(data).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/singles");
  revalidatePath("/singles");
  return { success: true };
}

export async function updateSingleStock(id, stock) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("singles")
    .update({ stock: parseInt(stock, 10) })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/singles");
  revalidatePath("/singles");
  return { success: true };
}

export async function deleteSingle(id) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("singles").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/singles");
  revalidatePath("/singles");
  return { success: true };
}

// ─── GRADED CARDS ─────────────────────────────────────────────────────────────

export async function createGraded(formData) {
  await assertAdmin();
  const supabase = await createClient();

  const data = {
    pokemon_name: formData.get("pokemon_name"),
    set_name:     formData.get("set_name"),
    card_number:  formData.get("card_number") ?? null,
    language:     formData.get("language") ?? "english",
    grader:       formData.get("grader"),
    grade:        parseFloat(formData.get("grade")),
    cert_number:  formData.get("cert_number") ?? null,
    price:        parseFloat(formData.get("price")),
    in_stock:     formData.get("in_stock") !== "false",
    images:       [],
  };

  const { error } = await supabase.from("graded_cards").insert(data);
  if (error) return { error: error.message };

  revalidatePath("/admin/graded");
  revalidatePath("/graded");
  return { success: true };
}

export async function updateGraded(id, formData) {
  await assertAdmin();
  const supabase = await createClient();

  const data = {
    pokemon_name: formData.get("pokemon_name"),
    set_name:     formData.get("set_name"),
    card_number:  formData.get("card_number") ?? null,
    language:     formData.get("language") ?? "english",
    grader:       formData.get("grader"),
    grade:        parseFloat(formData.get("grade")),
    cert_number:  formData.get("cert_number") ?? null,
    price:        parseFloat(formData.get("price")),
    in_stock:     formData.get("in_stock") !== "false",
  };

  const { error } = await supabase.from("graded_cards").update(data).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/graded");
  revalidatePath("/graded");
  return { success: true };
}

export async function deleteGraded(id) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("graded_cards").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/graded");
  return { success: true };
}
