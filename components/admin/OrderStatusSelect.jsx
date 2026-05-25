"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/lib/actions/orders";

const STATUSES = [
  "pending", "payment_received", "processing", "shipped", "delivered", "refunded", "cancelled"
];

const COLORS = {
  pending:          "text-gold",
  payment_received: "text-neon-2",
  processing:       "text-neon",
  shipped:          "text-neon-2",
  delivered:        "text-green-400",
  refunded:         "text-red-400",
  cancelled:        "text-red-400",
};

export default function OrderStatusSelect({ id, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [saved,  setSaved]  = useState(false);
  const [isPending, start]  = useTransition();

  function handleChange(e) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    start(async () => {
      await updateOrderStatus(id, newStatus);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={handleChange}
        disabled={isPending}
        className={`bg-surface-3 border border-border rounded px-2 py-1 text-xs font-mono focus:outline-none focus:border-neon/50 disabled:opacity-50 ${COLORS[status] ?? "text-white"}`}
      >
        {STATUSES.map(s => (
          <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
        ))}
      </select>
      {saved && <span className="text-green-400 text-xs font-mono">✓ Saved</span>}
    </div>
  );
}
