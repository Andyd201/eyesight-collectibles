import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import SingleForm  from "@/components/admin/SingleForm";
import GradedForm  from "@/components/admin/GradedForm";

export const metadata = { title: "Add Item" };

const TYPES = [
  {
    key:         "product",
    icon:        "📦",
    label:       "Sealed Product",
    description: "Booster box, Elite Trainer Box, tin, display, bundle, or accessory",
    color:       "border-neon/40 bg-neon/5 hover:bg-neon/10",
    badge:       "badge-neon",
  },
  {
    key:         "single",
    icon:        "🃏",
    label:       "Single Card",
    description: "Individual Pokémon card — raw (ungraded) English, Japanese, Korean…",
    color:       "border-cyan-500/40 bg-cyan-500/5 hover:bg-cyan-500/10",
    badge:       "badge-cyan",
  },
  {
    key:         "graded",
    icon:        "🏆",
    label:       "Graded Slab",
    description: "PSA, CGC, or Beckett slabbed card with certification number",
    color:       "border-yellow-500/40 bg-yellow-500/5 hover:bg-yellow-500/10",
    badge:       "badge-gold",
  },
];

export default async function AddItemPage({ searchParams }) {
  const { type } = await searchParams;

  /* ── Step 2: Form ─────────────────────────────────────── */
  if (type) {
    const selected = TYPES.find(t => t.key === type);
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/admin/inventory" className="text-muted hover:text-white transition-colors">Inventory</Link>
          <span className="text-muted">›</span>
          <Link href="/admin/inventory/new" className="text-muted hover:text-white transition-colors">Add Item</Link>
          <span className="text-muted">›</span>
          <span className="text-white">{selected?.label ?? type}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-3xl">{selected?.icon}</span>
          <div>
            <h1 className="font-display text-4xl text-white tracking-wide">
              Add {selected?.label ?? "Item"}
            </h1>
            <p className="text-muted font-mono text-xs mt-0.5">{selected?.description}</p>
          </div>
        </div>

        {type === "product" && <ProductForm />}
        {type === "single"  && <SingleForm  />}
        {type === "graded"  && <GradedForm  />}
      </div>
    );
  }

  /* ── Step 1: Choose type ──────────────────────────────── */
  return (
    <div className="space-y-8 max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/admin/inventory" className="text-muted hover:text-white transition-colors">Inventory</Link>
        <span className="text-muted">›</span>
        <span className="text-white">Add Item</span>
      </div>

      <div>
        <h1 className="font-display text-4xl text-white tracking-wide">What are you adding?</h1>
        <p className="text-muted font-mono text-xs mt-1">Choose the type of item to add to your inventory</p>
      </div>

      <div className="space-y-3">
        {TYPES.map((t) => (
          <Link
            key={t.key}
            href={`/admin/inventory/new?type=${t.key}`}
            className={`glass flex items-center gap-5 p-5 rounded-xl border transition-all hover:scale-[1.01] group ${t.color}`}
          >
            <span className="text-5xl">{t.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-display text-xl text-white">{t.label}</p>
                <span className={`badge ${t.badge} text-[10px]`}>{t.key}</span>
              </div>
              <p className="text-muted text-sm">{t.description}</p>
            </div>
            <span className="text-muted group-hover:text-white transition-colors text-xl">→</span>
          </Link>
        ))}
      </div>

      <p className="font-mono text-xs text-muted text-center">
        Or go back to{" "}
        <Link href="/admin/inventory" className="text-neon hover:underline">Inventory</Link>
      </p>
    </div>
  );
}
