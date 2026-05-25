"use client";

import { useState, useTransition } from "react";
import { updateSellRequest } from "@/lib/actions/orders";

const STATUS_OPTS = ["submitted","reviewing","quoted","accepted","declined","completed"];
const STATUS_COLORS = {
  submitted: "badge-gold", reviewing: "badge-neon", quoted: "badge-cyan",
  accepted: "badge-green", declined: "badge-red", completed: "badge-green",
};

export default function SellRequestCard({ request }) {
  const [open,  setOpen]  = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPending, start] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      await updateSellRequest(request.id, fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <div className="glass overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between p-5 text-left hover:bg-surface-2/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className={`badge ${STATUS_COLORS[request.status] ?? "badge-neon"}`}>
              {request.status}
            </span>
            {request.offer_amount && (
              <span className="badge badge-gold">Offer: ${Number(request.offer_amount).toFixed(2)}</span>
            )}
            <span className="font-mono text-xs text-muted">
              {new Date(request.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="font-body font-semibold text-white">{request.name}</p>
          <p className="font-mono text-xs text-muted">{request.email} {request.phone && `· ${request.phone}`}</p>
          <p className="text-sm text-subtle mt-2 line-clamp-2">{request.description}</p>
        </div>
        <span className="text-muted ml-4 text-lg">{open ? "↑" : "↓"}</span>
      </button>

      {/* Expanded */}
      {open && (
        <div className="border-t border-border p-5 space-y-5">
          <div>
            <p className="font-mono text-xs text-neon uppercase tracking-wider mb-2">Full description</p>
            <p className="text-sm text-subtle leading-relaxed whitespace-pre-wrap">{request.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Update Status</label>
                <select name="status" defaultValue={request.status}
                  className="w-full bg-surface-3 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon/50">
                  {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Your Offer ($)</label>
                <input name="offer_amount" type="number" step="0.01" min="0"
                  defaultValue={request.offer_amount ?? ""}
                  placeholder="0.00"
                  className="w-full bg-surface-3 border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/50" />
              </div>
            </div>
            <div>
              <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Admin Notes (internal)</label>
              <textarea name="admin_notes" rows={3} defaultValue={request.admin_notes ?? ""}
                placeholder="Notes visible only to admins..."
                className="w-full bg-surface-3 border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/50 resize-none" />
            </div>
            <div className="flex items-center gap-4">
              <button type="submit" disabled={isPending} className="btn-neon py-2 px-5 text-sm disabled:opacity-50">
                {isPending ? "Saving..." : "Save Changes"}
              </button>
              {saved && <span className="text-green-400 font-mono text-xs">✓ Saved!</span>}
              <a href={`mailto:${request.email}`} className="btn-outline py-2 px-4 text-sm">
                Reply by Email ↗
              </a>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
