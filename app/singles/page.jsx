import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "Singles" };

const CONDITION_LABEL = {
  mint: "MINT", near_mint: "NM", lightly_played: "LP",
  moderately_played: "MP", heavily_played: "HP", damaged: "DMG",
};
const CONDITION_MAP = {
  NM: "near_mint", LP: "lightly_played", MP: "moderately_played",
  HP: "heavily_played", DMG: "damaged", MINT: "mint",
};
const LANG_FLAG = { english: "🇬🇧", japanese: "🇯🇵", korean: "🇰🇷", chinese: "🇨🇳" };

const RARITIES   = ["Any","Common","Uncommon","Rare","Rare Holo","Ultra Rare","Special Art Rare","Special Illustration Rare","Hyper Rare","Alt Art","Galarian Gallery"];
const LANGUAGES  = ["Any","English","Japanese","Korean"];
const CONDITIONS = ["Any","MINT","NM","LP","MP","HP","DMG"];

export default async function SinglesPage({ searchParams }) {
  const p = await searchParams;

  const pokemon   = p.pokemon?.trim()   || null;
  const set       = p.set?.trim()       || null;
  const rarity    = p.rarity            || null;
  const language  = p.language          || null;
  const condition = p.condition         || null;
  const minPrice  = p.min_price ? parseFloat(p.min_price) : null;
  const maxPrice  = p.max_price ? parseFloat(p.max_price) : null;

  const supabase = await createClient();
  let query = supabase
    .from("singles")
    .select("*")
    .gt("stock", 0)
    .order("created_at", { ascending: false });

  if (pokemon)                               query = query.ilike("pokemon_name", `%${pokemon}%`);
  if (set)                                   query = query.ilike("set_name", `%${set}%`);
  if (rarity    && rarity    !== "Any")      query = query.eq("rarity", rarity);
  if (language  && language  !== "Any")      query = query.eq("language", language.toLowerCase());
  if (condition && condition !== "Any") {
    const mapped = CONDITION_MAP[condition];
    if (mapped) query = query.eq("condition", mapped);
  }
  if (minPrice) query = query.gte("price", minPrice);
  if (maxPrice) query = query.lte("price", maxPrice);

  const { data: singlesRaw } = await query.limit(60);
  const singles = singlesRaw ?? [];

  const ic = "w-full bg-surface-3 border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-neon/50";

  const hasFilters = pokemon || set || (rarity && rarity !== "Any") || (language && language !== "Any") || (condition && condition !== "Any") || minPrice || maxPrice;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="section-label">🃏 Individual cards</p>
        <h1 className="section-title">Singles</h1>
        <p className="text-subtle mt-2">
          {singles.length > 0
            ? `${singles.length} card${singles.length !== 1 ? "s" : ""} in stock`
            : hasFilters ? "No cards match your filters" : "English, Japanese & Korean"}
        </p>
      </div>

      {/* Search + Filters */}
      <form method="GET" className="glass p-6 mb-8 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Pokémon</label>
            <input name="pokemon" type="text" placeholder="e.g. Charizard, Pikachu…"
              defaultValue={pokemon ?? ""} className={ic} />
          </div>
          <div>
            <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Set</label>
            <input name="set" type="text" placeholder="e.g. Obsidian Flames…"
              defaultValue={set ?? ""} className={ic} />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Rarity</label>
            <select name="rarity" className={ic} defaultValue={rarity ?? "Any"}>
              {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Language</label>
            <select name="language" className={ic} defaultValue={language ?? "Any"}>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Condition</label>
            <select name="condition" className={ic} defaultValue={condition ?? "Any"}>
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Price ($)</label>
            <div className="flex items-center gap-2">
              <input name="min_price" type="number" min="0" placeholder="Min"
                defaultValue={minPrice ?? ""} className={ic} />
              <span className="text-muted shrink-0">–</span>
              <input name="max_price" type="number" min="0" placeholder="Max"
                defaultValue={maxPrice ?? ""} className={ic} />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="btn-neon flex-1 py-2.5">Search</button>
            {hasFilters && (
              <Link href="/singles" className="btn-outline py-2.5 px-3 text-sm">✕</Link>
            )}
          </div>
        </div>
      </form>

      {/* Results */}
      {singles.length === 0 ? (
        <div className="glass p-16 text-center space-y-3">
          <span className="text-5xl block opacity-40">🔍</span>
          <p className="text-white font-body font-semibold">No cards found</p>
          <p className="text-muted text-sm">Try adjusting or clearing your filters</p>
          <Link href="/singles" className="btn-outline inline-block py-2 px-5 mt-2">Clear Filters</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {singles.map((card) => {
            const condLabel = CONDITION_LABEL[card.condition] ?? card.condition;
            const langFlag  = LANG_FLAG[card.language];
            return (
              <div key={card.id} className="glass rounded-xl overflow-hidden hover:border-neon/30 transition-colors">
                {/* Card image */}
                <div className="aspect-[2.5/3.5] bg-surface-3 flex items-center justify-center relative overflow-hidden">
                  {card.images?.length > 0 ? (
                    <img src={card.images[0]} alt={card.pokemon_name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center p-3 select-none">
                      <span className="text-5xl block">🃏</span>
                      <p className="font-mono text-[10px] text-neon mt-1 truncate px-1">{card.pokemon_name}</p>
                    </div>
                  )}
                  {card.is_foil && (
                    <span className="absolute top-2 right-2 font-mono text-[9px] bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 px-1.5 py-0.5 rounded">✨ FOIL</span>
                  )}
                  {langFlag && langFlag !== "🇬🇧" && (
                    <span className="absolute top-2 left-2 text-sm">{langFlag}</span>
                  )}
                </div>

                {/* Card info */}
                <div className="p-3 space-y-1">
                  <p className="font-body text-sm text-white font-semibold truncate">{card.pokemon_name}</p>
                  <p className="font-mono text-[10px] text-muted truncate">
                    {card.set_name}{card.card_number ? ` · ${card.card_number}` : ""}
                  </p>
                  {card.rarity && (
                    <p className="font-mono text-[10px] text-neon-2 truncate">{card.rarity}</p>
                  )}
                  <span className="inline-block badge badge-neon text-[9px] py-0">{condLabel}</span>

                  <div className="flex items-center justify-between pt-1.5">
                    <div>
                      <p className="font-body font-bold text-white">${Number(card.price).toFixed(2)}</p>
                      {card.market_price && Number(card.market_price) > Number(card.price) && (
                        <p className="font-mono text-[9px] text-muted line-through">${Number(card.market_price).toFixed(2)}</p>
                      )}
                    </div>
                    <button className="btn-neon py-1.5 px-2.5 text-xs">Add →</button>
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
