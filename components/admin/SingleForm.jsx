"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSingle, updateSingle } from "@/lib/actions/singles";

const ic = "w-full bg-surface-3 border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/50";
const lc = "font-mono text-xs text-neon uppercase tracking-wider block mb-1";

export default function SingleForm({ single }) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isPending, start] = useTransition();
  const isEdit = !!single;

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      try {
        const r = isEdit ? await updateSingle(single.id, fd) : await createSingle(fd);
        if (r?.error) { setError(r.error); return; }
        router.push("/admin/singles");
      } catch (err) {
        setError(err?.message ?? "Something went wrong.");
        console.error("[SingleForm error]", err);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="glass p-6 space-y-4">
        <h2 className="font-display text-xl text-white tracking-wide">Card Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lc}>Pokémon Name *</label>
            <input name="pokemon_name" required placeholder="Charizard" defaultValue={single?.pokemon_name ?? ""} className={ic} />
          </div>
          <div>
            <label className={lc}>Set Name *</label>
            <input name="set_name" required placeholder="Obsidian Flames" defaultValue={single?.set_name ?? ""} className={ic} />
          </div>
          <div>
            <label className={lc}>Set Code</label>
            <input name="set_code" placeholder="OBF" defaultValue={single?.set_code ?? ""} className={ic} />
          </div>
          <div>
            <label className={lc}>Card Number</label>
            <input name="card_number" placeholder="223/197" defaultValue={single?.card_number ?? ""} className={ic} />
          </div>
        </div>
        <div>
          <label className={lc}>Rarity</label>
          <input name="rarity" placeholder="Special Art Rare, Hyper Rare..." defaultValue={single?.rarity ?? ""} className={ic} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lc}>Language *</label>
            <select name="language" defaultValue={single?.language ?? "english"} className={ic}>
              {["english","japanese","korean","chinese","other"].map(l => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={lc}>Condition *</label>
            <select name="condition" defaultValue={single?.condition ?? "near_mint"} className={ic}>
              {[
                ["near_mint",         "NM — Near Mint"],
                ["lightly_played",    "LP — Lightly Played"],
                ["moderately_played", "MP — Moderately Played"],
                ["heavily_played",    "HP — Heavily Played"],
                ["damaged",           "DMG — Damaged"],
                ["mint",              "MINT"],
              ].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="is_foil" value="true" defaultChecked={single?.is_foil} className="w-4 h-4 accent-neon" />
          <span className="text-sm text-white">Foil / Holo card</span>
        </label>
      </div>

      <div className="glass p-6 space-y-4">
        <h2 className="font-display text-xl text-white tracking-wide">Pricing & Stock</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={lc}>Your Price ($) *</label>
            <input name="price" type="number" step="0.01" min="0" required placeholder="0.00" defaultValue={single?.price ?? ""} className={ic} />
          </div>
          <div>
            <label className={lc}>Market Price ($)</label>
            <input name="market_price" type="number" step="0.01" min="0" placeholder="TCGplayer avg" defaultValue={single?.market_price ?? ""} className={ic} />
          </div>
          <div>
            <label className={lc}>Stock *</label>
            <input name="stock" type="number" min="0" defaultValue={single?.stock ?? 1} required className={ic} />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={isPending} className="btn-neon py-3 px-8 text-base disabled:opacity-50">
          {isPending ? "Saving..." : isEdit ? "Save Changes" : "Add Single"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline py-3 px-6">
          Cancel
        </button>
      </div>
    </form>
  );
}
