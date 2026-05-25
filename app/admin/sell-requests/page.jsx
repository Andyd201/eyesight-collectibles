import { createClient } from "@/lib/supabase/server";
import SellRequestCard from "@/components/admin/SellRequestCard";

export const metadata = { title: "Sell Requests" };

export default async function AdminSellRequestsPage({ searchParams }) {
  const supabase = await createClient();
  const { status: statusFilter } = await searchParams ?? {};

  let query = supabase
    .from("sell_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (statusFilter) query = query.eq("status", statusFilter);

  const { data: requestsRaw } = await query;
  const requests = requestsRaw ?? [];

  const statuses = ["submitted","reviewing","quoted","accepted","declined","completed"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white tracking-wide">Sell Requests</h1>
        <p className="text-muted font-mono text-xs mt-1">{requests.length} request{requests.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {[{ label: "All", href: "/admin/sell-requests" }, ...statuses.map(s => ({
          label: s.charAt(0).toUpperCase() + s.slice(1), href: `/admin/sell-requests?status=${s}`
        }))].map(t => (
          <a key={t.label} href={t.href}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors border ${
              (statusFilter === t.label.toLowerCase() || (!statusFilter && t.label === "All"))
                ? "bg-neon/20 text-neon border-neon/30"
                : "bg-surface-2 text-muted border-border hover:text-white"
            }`}>
            {t.label}
          </a>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="glass p-10 text-center">
          <p className="text-muted font-mono text-sm">No sell requests {statusFilter ? `with status "${statusFilter}"` : "yet"}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => <SellRequestCard key={req.id} request={req} />)}
        </div>
      )}
    </div>
  );
}
