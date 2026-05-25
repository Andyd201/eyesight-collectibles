import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { deleteProduct } from "@/lib/actions/products";
import { deleteSingle, deleteGraded } from "@/lib/actions/singles";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Inventory" };

const CONDITION_LABEL = {
  near_mint: "NM", lightly_played: "LP", moderately_played: "MP",
  heavily_played: "HP", damaged: "DMG", mint: "MINT",
};

const GRADER_COLOR = {
  PSA: "text-blue-300 bg-blue-500/20 border-blue-500/30",
  CGC: "text-yellow-300 bg-yellow-500/20 border-yellow-500/30",
  BGS: "text-red-300 bg-red-500/20 border-red-500/30",
};

export default async function InventoryPage({ searchParams }) {
  const { type = "all" } = await searchParams;
  const supabase = await createClient();

  // Fetch all three in parallel (only what's needed for the active tab)
  const [pRes, sRes, gRes] = await Promise.all([
    (type === "all" || type === "products")
      ? supabase.from("products").select("*").order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    (type === "all" || type === "singles")
      ? supabase.from("singles").select("*").order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    (type === "all" || type === "graded")
      ? supabase.from("graded_cards").select("*").order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);

  const products = pRes.data ?? [];
  const singles  = sRes.data ?? [];
  const graded   = gRes.data ?? [];

  const total = products.length + singles.length + graded.length;

  const TABS = [
    { key: "all",      label: "All Items",     count: null,            icon: "🗂️" },
    { key: "products", label: "Sealed & Merch", count: products.length, icon: "📦" },
    { key: "singles",  label: "Singles",        count: singles.length,  icon: "🃏" },
    { key: "graded",   label: "Graded Slabs",   count: graded.length,   icon: "🏆" },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-white tracking-wide">Inventory</h1>
          <p className="text-muted font-mono text-xs mt-1">{total} item{total !== 1 ? "s" : ""} total</p>
        </div>
        <Link href="/admin/inventory/new" className="btn-neon py-2.5 px-5 text-sm flex items-center gap-2">
          <span>➕</span> Add Item
        </Link>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 border-b border-border pb-0">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key === "all" ? "/admin/inventory" : `/admin/inventory?type=${tab.key}`}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-body rounded-t-lg border-b-2 transition-colors -mb-px ${
              type === tab.key || (tab.key === "all" && type === "all")
                ? "border-neon text-neon bg-neon/5"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            {tab.label}
            {tab.count !== null && (
              <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                type === tab.key ? "bg-neon/20 text-neon" : "bg-surface-2 text-muted"
              }`}>
                {tab.count}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* ── PRODUCTS ── */}
      {(type === "all" || type === "products") && products.length > 0 && (
        <section className="space-y-3">
          {type === "all" && (
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs text-muted uppercase tracking-widest">📦 Sealed & Merchandise</h2>
              <Link href="/admin/inventory?type=products" className="font-mono text-[10px] text-neon hover:underline">View all →</Link>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {(type === "all" ? products.slice(0, 6) : products).map((p) => (
              <div key={p.id} className={`glass p-4 flex gap-4 items-start ${!p.is_active ? "opacity-50" : ""}`}>
                <div className="w-14 h-14 bg-surface-3 rounded-lg flex items-center justify-center text-3xl shrink-0">
                  {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover rounded-lg" alt="" /> : "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-white font-semibold truncate">{p.name}</p>
                  <p className="font-mono text-[10px] text-muted capitalize">{p.category} · {p.set_name ?? "No set"}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-body font-bold text-neon text-sm">${Number(p.price).toFixed(2)}</span>
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${p.stock > 5 ? "bg-green-500/20 text-green-400" : p.stock > 0 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                      {p.stock} in stock
                    </span>
                    {!p.is_active && <span className="font-mono text-[10px] text-muted">Hidden</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <Link href={`/admin/products/${p.id}/edit`} className="btn-outline py-1 px-2.5 text-xs">Edit</Link>
                  <DeleteButton id={p.id} action={deleteProduct} compact />
                </div>
              </div>
            ))}
          </div>
          {type === "all" && products.length > 6 && (
            <Link href="/admin/inventory?type=products" className="block text-center font-mono text-xs text-muted hover:text-neon transition-colors py-2">
              +{products.length - 6} more →
            </Link>
          )}
        </section>
      )}

      {/* ── SINGLES ── */}
      {(type === "all" || type === "singles") && singles.length > 0 && (
        <section className="space-y-3">
          {type === "all" && (
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs text-muted uppercase tracking-widest">🃏 Single Cards</h2>
              <Link href="/admin/inventory?type=singles" className="font-mono text-[10px] text-neon hover:underline">View all →</Link>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {(type === "all" ? singles.slice(0, 6) : singles).map((s) => (
              <div key={s.id} className="glass p-4 flex gap-4 items-start">
                <div className="w-14 h-14 bg-surface-3 rounded-lg flex items-center justify-center text-2xl shrink-0">
                  {s.images?.[0] ? <img src={s.images[0]} className="w-full h-full object-contain rounded-lg" alt="" /> : "🃏"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-white font-semibold truncate">{s.pokemon_name}</p>
                  <p className="font-mono text-[10px] text-muted truncate">{s.set_name} {s.card_number ? `· ${s.card_number}` : ""}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="font-body font-bold text-neon text-sm">${Number(s.price).toFixed(2)}</span>
                    <span className="badge badge-neon text-[9px] py-0">{CONDITION_LABEL[s.condition] ?? s.condition}</span>
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${s.stock > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {s.stock} left
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <Link href={`/admin/singles/${s.id}/edit`} className="btn-outline py-1 px-2.5 text-xs">Edit</Link>
                  <DeleteButton id={s.id} action={deleteSingle} compact />
                </div>
              </div>
            ))}
          </div>
          {type === "all" && singles.length > 6 && (
            <Link href="/admin/inventory?type=singles" className="block text-center font-mono text-xs text-muted hover:text-neon transition-colors py-2">
              +{singles.length - 6} more →
            </Link>
          )}
        </section>
      )}

      {/* ── GRADED ── */}
      {(type === "all" || type === "graded") && graded.length > 0 && (
        <section className="space-y-3">
          {type === "all" && (
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs text-muted uppercase tracking-widest">🏆 Graded Slabs</h2>
              <Link href="/admin/inventory?type=graded" className="font-mono text-[10px] text-neon hover:underline">View all →</Link>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {(type === "all" ? graded.slice(0, 6) : graded).map((c) => {
              const gs = GRADER_COLOR[c.grader] ?? "text-zinc-300 bg-zinc-500/20 border-zinc-500/30";
              return (
                <div key={c.id} className={`glass p-4 flex gap-4 items-start ${!c.in_stock ? "opacity-50" : ""}`}>
                  <div className="w-14 h-14 bg-surface-3 rounded-lg flex items-center justify-center text-2xl shrink-0">
                    {c.images?.[0] ? <img src={c.images[0]} className="w-full h-full object-contain rounded-lg" alt="" /> : "🃏"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-white font-semibold truncate">{c.pokemon_name}</p>
                    <p className="font-mono text-[10px] text-muted truncate">{c.set_name}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="font-body font-bold text-neon text-sm">${Number(c.price).toLocaleString()}</span>
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${gs}`}>{c.grader} {c.grade}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <Link href={`/admin/graded/${c.id}/edit`} className="btn-outline py-1 px-2.5 text-xs">Edit</Link>
                    <DeleteButton id={c.id} action={deleteGraded} compact />
                  </div>
                </div>
              );
            })}
          </div>
          {type === "all" && graded.length > 6 && (
            <Link href="/admin/inventory?type=graded" className="block text-center font-mono text-xs text-muted hover:text-neon transition-colors py-2">
              +{graded.length - 6} more →
            </Link>
          )}
        </section>
      )}

      {/* Empty state */}
      {total === 0 && (
        <div className="glass p-16 text-center space-y-4">
          <span className="text-6xl block opacity-30">📦</span>
          <p className="text-white font-body font-semibold text-lg">No items yet</p>
          <p className="text-muted text-sm">Start by adding your first product, single, or graded card.</p>
          <Link href="/admin/inventory/new" className="btn-neon inline-block py-2.5 px-6 mt-2">➕ Add Your First Item</Link>
        </div>
      )}

    </div>
  );
}
