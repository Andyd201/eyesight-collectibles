"use client";

import { useSearchParams } from "next/navigation";
import { FEATURED_PRODUCTS, HOT_SINGLES } from "@/lib/mockData";
import ProductCard from "@/components/ui/ProductCard";

const ALL = [
  ...FEATURED_PRODUCTS,
  ...HOT_SINGLES.map(s => ({ ...s, category: "single", image: null, originalPrice: null, badge: null, stock: 1 })),
];

export default function SearchPage() {
  const params = useSearchParams();
  const q      = params.get("q") ?? "";

  const results = q.trim()
    ? ALL.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        (p.set ?? "").toLowerCase().includes(q.toLowerCase()) ||
        (p.set_name ?? "").toLowerCase().includes(q.toLowerCase()) ||
        (p.pokemon ?? "").toLowerCase().includes(q.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="section-label">Search results</p>
        <h1 className="section-title">
          {q ? `"${q}"` : "Search"}
        </h1>
        {q && (
          <p className="text-muted mt-2 font-mono text-sm">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {!q && (
        <div className="glass p-12 text-center">
          <span className="text-5xl mb-4 block">🔍</span>
          <p className="text-muted">Use the search bar above to find cards, sets, and more.</p>
        </div>
      )}

      {q && results.length === 0 && (
        <div className="glass p-12 text-center space-y-3">
          <span className="text-5xl block">😕</span>
          <p className="text-white font-body font-semibold">No results for &quot;{q}&quot;</p>
          <p className="text-muted text-sm">Try searching by Pokémon name, set name, or card number.</p>
          <a href="/shop" className="btn-neon inline-block mt-4 py-2 px-6">Browse All Products →</a>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {results.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
