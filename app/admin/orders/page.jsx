import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const metadata = { title: "Orders" };

const STATUS_STYLE = {
  pending:          "badge-gold",
  payment_received: "badge-cyan",
  processing:       "badge-neon",
  shipped:          "badge-cyan",
  delivered:        "badge-green",
  refunded:         "badge-red",
  cancelled:        "badge-red",
};

const ALL_STATUSES = ["pending","payment_received","processing","shipped","delivered","refunded","cancelled"];

export default async function AdminOrdersPage({ searchParams }) {
  const supabase   = await createClient();
  const { status: statusFilter } = await searchParams ?? {};

  let query = supabase
    .from("orders")
    .select("id, status, total, subtotal, shipping_cost, created_at, tracking_number, carrier, user_id")
    .order("created_at", { ascending: false });

  if (statusFilter) query = query.eq("status", statusFilter);

  const { data: ordersRaw } = await query;
  const orders = ordersRaw ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-white tracking-wide">Orders</h1>
          <p className="text-muted font-mono text-xs mt-1">{orders.length} orders{statusFilter ? ` · ${statusFilter}` : ""}</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/orders"
          className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors border ${
            !statusFilter ? "bg-neon/20 text-neon border-neon/30" : "bg-surface-2 text-muted border-border hover:text-white"
          }`}>All</Link>
        {ALL_STATUSES.map(s => (
          <Link key={s} href={`/admin/orders?status=${s}`}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors border ${
              statusFilter === s ? "bg-neon/20 text-neon border-neon/30" : "bg-surface-2 text-muted border-border hover:text-white"
            }`}>
            {s.replace(/_/g, " ")}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="glass overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              {["Order ID", "Date", "Total", "Status", "Tracking", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-mono text-xs text-muted uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted font-mono text-sm">
                  No orders {statusFilter ? `with status "${statusFilter}"` : "yet"}
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-2/40 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs text-neon hover:underline">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-body font-semibold text-white">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect id={order.id} currentStatus={order.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {order.tracking_number ? (
                      <span className="text-neon-2">{order.tracking_number}</span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs text-neon hover:underline">
                      Details →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
