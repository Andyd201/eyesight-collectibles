import Link from "next/link";
import { HOT_SINGLES } from "@/lib/mockData";

export default function HotSingles() {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="section-label">📈 Market movers</p>
          <h2 className="section-title">Hot Singles</h2>
        </div>
        <Link href="/singles" className="btn-outline hidden sm:inline-flex">
          Browse All Singles →
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {HOT_SINGLES.map((card) => (
          <div key={card.id} className="glass-hover p-4 flex flex-col gap-3 group">
            {/* Card image placeholder */}
            <div className="relative aspect-[2.5/3.5] bg-surface-3 rounded-lg overflow-hidden flex items-center justify-center">
              <span className="text-5xl opacity-40 group-hover:opacity-70 transition-opacity">🃏</span>
              {card.trending && (
                <div className="absolute top-2 left-2">
                  <span className="badge-red badge">🔥 Trending</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="font-mono text-[10px] text-muted uppercase tracking-wider">
                {card.set} · {card.number}
              </p>
              <h3 className="font-body font-semibold text-white mt-0.5 group-hover:text-neon transition-colors">
                {card.name}
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="badge badge-cyan">{card.language}</span>
                <span className="badge badge-green">{card.condition}</span>
                <span className="badge-neon badge">{card.rarity}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
              <div>
                <span className="font-body font-bold text-white">${card.price.toFixed(2)}</span>
                <span className="ml-2 text-xs text-green-400 font-mono">{card.trend}</span>
              </div>
              <button className="btn-neon py-1.5 px-3 text-xs">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
