import { createClient, getUser } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "Sell Requests" };

const STATUS_STYLE = {
  submitted: "badge-gold",
  reviewing: "badge-neon",
  quoted:    "badge-cyan",
  accepted:  "badge-green",
  declined:  "badge-red",
  completed: "badge-green",
};

export default async function AccountSellRequestsPage() {
  const user = await getUser();
  const supabase = await createClient();

  const { data: requestsRaw } = await supabase
    .from("sell_requests")
    .select("id, status, description, offer_amount, created_at, admin_notes")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const requests = requestsRaw ?? [];

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-white tracking-wide">Sell Requests</h2>
          <p className="font-mono text-xs text-muted mt-1">{requests.length} request{requests.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/sell-to-us" className="btn-neon py-2 px-4 text-sm">+ New Request</Link>
      </div>

      {requests.length === 0 ? (
        <div className="glass p-10 text-center space-y-3">
          <span className="text-5xl block opacity-40">💰</span>
          <p className="text-white font-body font-semibold">No sell requests yet</p>
          <p className="text-muted text-sm">Looking to sell your cards? We buy singles, sealed products, and collections.</p>
          <Link href="/sell-to-us" className="btn-neon inline-block py-2 px-6 mt-2">Get a Quote →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="glass p-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className={`badge ${STATUS_STYLE[req.status] ?? "badge-neon"}`}>{req.status}</span>
                {req.offer_amount && (
                  <span className="badge badge-gold">Offer: ${Number(req.offer_amount).toFixed(2)}</span>
                )}
                <span className="font-mono text-xs text-muted ml-auto">
                  {new Date(req.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-subtle line-clamp-3">{req.description}</p>
              {req.admin_notes && (
                <div className="bg-surface-3 rounded-lg p-3 border border-border">
                  <p className="font-mono text-xs text-neon uppercase tracking-wider mb-1">Message from us</p>
                  <p className="text-sm text-white">{req.admin_notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
