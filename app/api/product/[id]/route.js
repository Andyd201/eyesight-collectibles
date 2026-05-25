import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request, { params }) {
  const { id } = await params;
  const supabase = await createClient();

  // Try products table first
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (product) return NextResponse.json({ ...product, _type: "product" });

  // Try singles
  const { data: single } = await supabase
    .from("singles")
    .select("*")
    .eq("id", id)
    .single();

  if (single) return NextResponse.json({ ...single, _type: "single" });

  // Try graded cards
  const { data: graded } = await supabase
    .from("graded_cards")
    .select("*")
    .eq("id", id)
    .single();

  if (graded) return NextResponse.json({ ...graded, _type: "graded" });

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
