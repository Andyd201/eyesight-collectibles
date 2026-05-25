"use client";

import { useState, useTransition } from "react";

export default function DeleteButton({ id, action, label = "Delete", compact = false }) {
  const [confirm, setConfirm]     = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => { await action(id); });
  }

  if (confirm) {
    return compact ? (
      <div className="flex flex-col gap-1">
        <button onClick={handleDelete} disabled={isPending}
          className="text-[10px] px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-40 transition-colors">
          {isPending ? "…" : "Confirm"}
        </button>
        <button onClick={() => setConfirm(false)}
          className="text-[10px] px-2 py-1 rounded bg-surface-3 text-muted hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-400 font-mono">Sure?</span>
        <button onClick={handleDelete} disabled={isPending}
          className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-40 transition-colors">
          {isPending ? "..." : "Yes, delete"}
        </button>
        <button onClick={() => setConfirm(false)}
          className="text-xs px-2 py-1 rounded bg-surface-3 text-muted hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    );
  }

  return compact ? (
    <button onClick={() => setConfirm(true)}
      className="text-[10px] px-2.5 py-1 rounded text-red-400 hover:bg-red-500/10 transition-colors font-mono border border-red-500/20">
      🗑️
    </button>
  ) : (
    <button onClick={() => setConfirm(true)}
      className="text-xs px-2 py-1 rounded text-red-400 hover:bg-red-500/10 transition-colors font-mono">
      {label}
    </button>
  );
}
