"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUser } from "@/lib/supabase/server";

async function assertAdmin() {
  const user = await getUser();
  if (!user || !user.app_metadata?.is_admin) throw new Error("Unauthorized");
}

export async function updateOrderStatus(id, status) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { success: true };
}

// Accepts FormData so it can be used directly as a <form action>
export async function updateOrderTracking(id, formData) {
  await assertAdmin();
  const supabase = await createClient();
  const tracking_number = formData.get("tracking_number") || null;
  const carrier         = formData.get("carrier") || null;
  const { error } = await supabase
    .from("orders")
    .update({ tracking_number, carrier, status: "shipped" })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { success: true };
}

export async function updateSellRequest(id, formData) {
  await assertAdmin();
  const supabase = await createClient();

  const data = {
    status:       formData.get("status"),
    offer_amount: formData.get("offer_amount") ? parseFloat(formData.get("offer_amount")) : null,
    admin_notes:  formData.get("admin_notes") ?? null,
  };

  const { error } = await supabase.from("sell_requests").update(data).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/sell-requests");
  return { success: true };
}
