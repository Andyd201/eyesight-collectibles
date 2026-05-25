import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "Graded Cards" };

const GRADER_STYLE = {
  PSA:         { color: "from-blue-600/30",   border: "border-blue-500/30",   emoji: "🔵", badge: "bg-blue-500/20   text-blue-300   border-blue-500/30"   },
  CGC:         { color: "from-yellow-600/30", border: "border-yellow-500/30", emoji: "🟡", badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  BGS:         { color: "from-red-600/30",    border: "border-red-500/30",    emoji: "🔴", badge: "bg-red-500/20    text-red-300    border-red-500/30"    },
  CGC_PRISTINE:{ color: "from-purple-600/30", border: "border-purple-500/30", emoji: "💜", badge: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  other:       { color: "from-zinc-600/30",   border: "border-zinc-500/30",   emoji: "⚪", badge: "bg-zinc-500/20   text-zinc-300   border-zinc-500/30"   },
};

export default async function GradedPage({ searchParams }) {
  const p = await searchParams;
  const graderFilter = p.grader || null;

  const supabase = await createClient();

  // Fetch all in-stock cards (no filter) to get counts per grader
  const { data: allCardsRaw } = await supabase
    .from("graded_cards")
    .select("grader")
    .eq("in_stock", true);

  const allCards = allCardsRaw ?? [];
  const counts = {};
  allCards.forEach(c => { counts[c.grader] = (counts[c.grader] || 0) + 1; });

  // Fetch cards with optional grader filter
  let query = supabase
    .from("graded_cards")
    .select("*")
    .eq("in_stock", true)
    .order("grade", { ascending: false })
    .order("price", { ascending: false });

  if (graderFilter) query = query.eq("grader", graderFilter);

  const { data: cardsRaw } = await query.limit(48);
  const cards = cardsRaw ?? [];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="section-label">🏆 Authenticated & slabbed</p>
        <h1 className="section-title">Graded Cards</h1>
        <p className="text-subtle mt-2">
          {cards.length} slab{cards.length !== 1 ? "s" : ""} available — PSA, CGC & Beckett certified
        </p>
      </div>

      {/* Grader filter tabs */}
      <div className="grid sm:grid-cols-4 gap-4 mb-10">
        <Link href="/graded"
          className={`glass p-4 flex items-center gap-3 rounded-xl border transition-all hover:scale-[1.02] ${!graderFilter ? "border-neon/40 bg-neon/5" : "border-border"}`}>
          <span className="text-2xl">🏆</span>
          <div>
            <p className="font-display text-xl text-white">All</p>
            <p className="font-mono text-xs text-muted">{allCards.length} slabs</p>
          </div>
        </Link>
        {["PSA", "CGC", "BGS"].map((g) => {
          const s = GRADER_STYLE[g];
          return (
            <Link key={g} href={`/graded?grader=${g}`}
              className={`glass p-4 flex items-center gap-3 rounded-xl border ${s.border} bg-gradient-to-br ${s.color} hover:scale-[1.02] transition-all ${graderFilter === g ? "ring-1 ring-white/20" : ""}`}>
              <span className="text-2xl">{s.emoji}</span>
              <div>
                <p className="font-display text-xl text-white">{g}</p>
                <p className="font-mono text-xs text-muted">{counts[g] ?? 0} slabs</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Cards grid */}
      {cards.length === 0 ? (
        <div className="glass p-16 text-center space-y-3">
          <span className="text-5xl block opacity-40">🏆</span>
          <p className="text-white font-body font-semibold">No graded cards found</p>
          <Link href="/graded" className="btn-outline inline-block py-2 px-5 mt-2">View All Slabs</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card) => {
            const s          = GRADER_STYLE[card.grader] ?? GRADER_STYLE.other;
            const isPerfect  = Number(card.grade) === 10;
            return (
              <div key={card.id} className="glass-hover p-4 rounded-xl">
                {/* Slab image */}
                <div className="aspect-[2.5/3.5] bg-surface-3 rounded-lg flex items-center justify-center relative overflow-hidden mb-4">
                  {card.images?.length > 0 ? (
                    <img src={card.images[0]} alt={card.pokemon_name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center p-4 select-none">
                      <span className="text-5xl block mb-2">🃏</span>
                      <p className="font-mono text-xs text-neon">{card.pokemon_name}</p>
                    </div>
                  )}
                  {isPerfect && (
                    <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent pointer-events-none" />
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <p className="font-body text-sm text-white font-semibold">{card.pokemon_name}</p>
                  <p className="font-mono text-[10px] text-muted">
                    {card.set_name}{card.card_number ? ` · ${card.card_number}` : ""}
                  </p>
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${s.badge}`}>
                      {card.grader} {card.grade}
                    </span>
                    {card.language === "japanese" && <span className="text-xs">🇯🇵</span>}
                    {isPerfect && <span className="badge badge-gold text-[10px]">GEM MINT</span>}
                  </div>
                  {card.cert_number && (
                    <p className="font-mono text-[10px] text-muted">Cert #{card.cert_number}</p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="font-body font-bold text-white">${Number(card.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    <button className="btn-neon py-1.5 px-3 text-xs">Add to Cart</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
