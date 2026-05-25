import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StockInput   from "@/components/admin/StockInput";
import DeleteButton from "@/components/admin/DeleteButton";
import ToggleActive from "@/components/admin/ToggleActive";
import { deleteProduct } from "@/lib/actions/products";

export const metadata = { title: "Products" };

export default async function AdminProductsPage({ searchParams }) {
  const supabase = await createClient();
  const { filter } = await searchParams ?? {};

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter === "low-stock") query = query.lte("stock", 3).gt("stock", 0);

  const { data: productsRaw } = await query;
  const products = productsRaw ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-white tracking-wide">Products</h1>
          <p className="text-muted font-mono text-xs mt-1">{products.length} items</p>
        </div>
        <Link href="/admin/products/new" className="btn-neon">+ Add Product</Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { label: "All",       href: "/admin/products"              },
          { label: "Low Stock", href: "/admin/products?filter=low-stock" },
        ].map((t) => (
          <Link key={t.label} href={t.href}
            className={`px-4 py-2 rounded-lg font-mono text-xs transition-colors ${
              (filter === "low-stock" && t.label === "Low Stock") || (!filter && t.label === "All")
                ? "bg-neon/20 text-neon border border-neon/30"
                : "bg-surface-2 text-muted border border-border hover:text-white"
            }`}>
            {t.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="glass overflow-hidden">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              {["Product", "Category", "Language", "Price", "Stock", "Active", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-mono text-xs text-muted uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted font-mono text-sm">
                  No products yet.{" "}
                  <Link href="/admin/products/new" className="text-neon hover:underline">Add your first product →</Link>
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className={`hover:bg-surface-2/40 transition-colors ${!p.is_active ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-body font-medium text-white text-sm line-clamp-1">{p.name}</p>
                      {p.set_name && <p className="font-mono text-[10px] text-muted">{p.set_name}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge badge-neon capitalize">{p.category}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-subtle capitalize">{p.language}</td>
                  <td className="px-4 py-3 font-body font-semibold text-white text-sm">
                    ${Number(p.price).toFixed(2)}
                    {p.original_price && (
                      <span className="ml-1 text-muted line-through text-xs">${Number(p.original_price).toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StockInput id={p.id} initialStock={p.stock} type="product" />
                  </td>
                  <td className="px-4 py-3">
                    <ToggleActive id={p.id} initialActive={p.is_active} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${p.id}/edit`}
                        className="font-mono text-xs text-neon hover:underline">Edit</Link>
                      <DeleteButton id={p.id} action={deleteProduct} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
