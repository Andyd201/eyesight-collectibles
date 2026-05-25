import { createClient, getUser } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "My Orders" };

const STATUS_STYLE = {
  pending:          "badge-gold",
  payment_received: "badge-cyan",
  processing:       "badge-neon",
  shipped:          "badge-cyan",
  delivered:        "badge-green",
  refunded:         "badge-red",
  cancelled:        "badge-red",
};

export default async function AccountOrdersPage() {
  const user = await getUser();
  const supabase = await createClient();

  const { data: ordersRaw } = await supabase
    .from("orders")
    .select("id, status, total, created_at, tracking_number, carrier")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const orders = ordersRaw ?? [];

  return (
    <>
      <div>
        <h2 className="font-display text-3xl text-white tracking-wide">My Orders</h2>
        <p className="font-mono text-xs text-muted mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
      </div>

      {orders.length === 0 ? (
        <div className="glass p-10 text-center space-y-3">
          <span className="text-5xl block opacity-40">📭</span>
          <p className="text-white font-body font-semibold">No orders yet</p>
          <p className="text-muted text-sm">When you place an order, it will appear here.</p>
          <Link href="/shop" className="btn-neon inline-block py-2 px-6 mt-2">Start Shopping →</Link>
        </div>
      ) : (
        <div className="glass overflow-hidden">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-border">
                {["Order", "Date", "Total", "Status", "Tracking"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-mono text-xs text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-2/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-neon">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-body font-semibold text-white">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_STYLE[order.status] ?? "badge-neon"}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {order.tracking_number ? (
                      <span className="text-neon-2">{order.carrier} {order.tracking_number}</span>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
