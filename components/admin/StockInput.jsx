"use client";

import { useState, useTransition } from "react";
import { updateProductStock } from "@/lib/actions/products";
import { updateSingleStock }  from "@/lib/actions/singles";

export default function StockInput({ id, initialStock, type = "product" }) {
  const [stock,  setStock]  = useState(initialStock ?? 0);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const action = type === "product" ? updateProductStock : updateSingleStock;
      const result = await action(id, stock);
      if (result?.error) { setError(result.error); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="w-20 bg-surface-3 border border-border rounded px-2 py-1 text-sm text-white font-mono text-center focus:outline-none focus:border-neon/50"
      />
      <button
        onClick={handleSave}
        disabled={isPending}
        className={`text-xs font-mono px-2 py-1 rounded transition-colors ${
          saved
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-neon/20 text-neon border border-neon/30 hover:bg-neon/30"
        } disabled:opacity-40`}
      >
        {isPending ? "..." : saved ? "✓" : "Save"}
      </button>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
}
