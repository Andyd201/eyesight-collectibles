"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createGraded, updateGraded } from "@/lib/actions/singles";

const ic = "w-full bg-surface-3 border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/50";
const lc = "font-mono text-xs text-neon uppercase tracking-wider block mb-1";

export default function GradedForm({ card }) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isPending, start] = useTransition();
  const isEdit = !!card;

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      try {
        const r = isEdit ? await updateGraded(card.id, fd) : await createGraded(fd);
        if (r?.error) { setError(r.error); return; }
        router.push("/admin/graded");
      } catch (err) {
        setError(err?.message ?? "Something went wrong.");
        console.error("[GradedForm error]", err);
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
        <h2 className="font-display text-xl text-white tracking-wide">Card Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lc}>Pokémon Name *</label>
            <input name="pokemon_name" required placeholder="Charizard" defaultValue={card?.pokemon_name ?? ""} className={ic} />
          </div>
          <div>
            <label className={lc}>Set Name *</label>
            <input name="set_name" required placeholder="Base Set" defaultValue={card?.set_name ?? ""} className={ic} />
          </div>
          <div>
            <label className={lc}>Card Number</label>
            <input name="card_number" placeholder="4/102" defaultValue={card?.card_number ?? ""} className={ic} />
          </div>
          <div>
            <label className={lc}>Language *</label>
            <select name="language" defaultValue={card?.language ?? "english"} className={ic}>
              {["english","japanese","korean","chinese","other"].map(l => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="glass p-6 space-y-4">
        <h2 className="font-display text-xl text-white tracking-wide">Grading Info</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={lc}>Grader *</label>
            <select name="grader" required defaultValue={card?.grader ?? "PSA"} className={ic}>
              {["PSA","CGC","BGS","CGC_PRISTINE","other"].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={lc}>Grade *</label>
            <select name="grade" required defaultValue={card?.grade ?? 10} className={ic}>
              {[10,9.5,9,8.5,8,7.5,7,6.5,6,5,4,3,2,1].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={lc}>Cert Number</label>
            <input name="cert_number" placeholder="12345678" defaultValue={card?.cert_number ?? ""} className={ic} />
          </div>
        </div>
      </div>

      <div className="glass p-6 space-y-4">
        <h2 className="font-display text-xl text-white tracking-wide">Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lc}>Price ($) *</label>
            <input name="price" type="number" step="0.01" min="0" required placeholder="0.00" defaultValue={card?.price ?? ""} className={ic} />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="in_stock" value="true" defaultChecked={card?.in_stock ?? true} className="w-4 h-4 accent-neon" />
              <span className="text-sm text-white">In Stock / Available</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={isPending} className="btn-neon py-3 px-8 text-base disabled:opacity-50">
          {isPending ? "Saving..." : isEdit ? "Save Changes" : "Add Graded Card"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline py-3 px-6">Cancel</button>
      </div>
    </form>
  );
}
