"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUser, getProfile } from "@/lib/supabase/server";

async function assertAdmin() {
  const user = await getUser();
  if (!user || !user.app_metadata?.is_admin) throw new Error("Unauthorized");
  return user;
}

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export async function createProduct(formData) {
  await assertAdmin();
  const supabase = await createClient();

  const name = formData.get("name");
  const data = {
    name,
    slug:          toSlug(name) + "-" + Date.now(),
    description:   formData.get("description") ?? "",
    category:      formData.get("category"),
    subcategory:   formData.get("subcategory") ?? null,
    set_name:      formData.get("set_name") ?? null,
    set_code:      formData.get("set_code") ?? null,
    language:      formData.get("language") ?? "english",
    price:         parseFloat(formData.get("price")),
    original_price: formData.get("original_price") ? parseFloat(formData.get("original_price")) : null,
    stock:         parseInt(formData.get("stock"), 10),
    badge:         formData.get("badge") ?? null,
    featured:      formData.get("featured") === "true",
    is_active:     formData.get("is_active") !== "false",
    images:        [],
  };

  const { error } = await supabase.from("products").insert(data);
  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function updateProduct(id, formData) {
  await assertAdmin();
  const supabase = await createClient();

  const data = {
    name:          formData.get("name"),
    description:   formData.get("description") ?? "",
    category:      formData.get("category"),
    subcategory:   formData.get("subcategory") ?? null,
    set_name:      formData.get("set_name") ?? null,
    set_code:      formData.get("set_code") ?? null,
    language:      formData.get("language") ?? "english",
    price:         parseFloat(formData.get("price")),
    original_price: formData.get("original_price") ? parseFloat(formData.get("original_price")) : null,
    stock:         parseInt(formData.get("stock"), 10),
    badge:         formData.get("badge") ?? null,
    featured:      formData.get("featured") === "true",
    is_active:     formData.get("is_active") !== "false",
  };

  const { error } = await supabase.from("products").update(data).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath(`/product/${id}`);
  revalidatePath("/shop");
  return { success: true };
}

export async function updateProductStock(id, stock) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ stock: parseInt(stock, 10) })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function toggleProductActive(id, isActive) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(id) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}
