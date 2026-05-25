import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }) {
  const supabase = await createClient();
  const { data: product } = await supabase.from("products").select("*").eq("id", params.id).single();
  if (!product) notFound();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white tracking-wide">Edit Product</h1>
        <p className="text-muted font-mono text-xs mt-1 truncate">{product.name}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
