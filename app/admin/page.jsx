import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

async function getStats(supabase) {
  const [products, singles, graded, orders, sellReqs] = await Promise.all([
    supabase.from("products").select("id, stock, is_active", { count: "exact" }),
    supabase.from("singles").select("id, stock",             { count: "exact" }),
    supabase.from("graded_cards").select("id",               { count: "exact" }),
    supabase.from("orders").select("id, total, status",      { count: "exact" }),
    supabase.from("sell_requests").select("id, status",      { count: "exact" }),
  ]);

  const revenue = (orders.data ?? [])
    .filter(o => ["payment_received","processing","shipped","delivered"].includes(o.status))
    .reduce((sum, o) => sum + Number(o.total ?? 0), 0);

  const lowStock = (products.data ?? []).filter(p => p.stock <= 3 && p.stock > 0 && p.is_active);
  const pendingOrders   = (orders.data ?? []).filter(o => o.status === "pending").length;
  const pendingSellReqs = (sellReqs.data ?? []).filter(r => r.status === "submitted").length;

  return {
    totalProducts: products.count ?? 0,
    totalSingles:  singles.count  ?? 0,
    totalGraded:   graded.count   ?? 0,
    totalOrders:   orders.count   ?? 0,
    revenue,
    lowStock,
    pendingOrders,
    pendingSellReqs,
  };
}

async function getRecentOrders(supabase) {
  const { data } = await supabase
    .from("orders")
    .select("id, status, total, created_at")
    .order("created_at", { ascending: false })
    .limit(8);
  return data ?? [];
}

const STATUS_STYLE = {
  pending:          "badge-gold",
  payment_received: "badge-cyan",
  processing:       "badge-neon",
  shipped:          "badge-cyan",
  delivered:        "badge-green",
  refunded:         "badge-red",
  cancelled:        "badge-red",
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [stats, recentOrders] = await Promise.all([
    getStats(supabase),
    getRecentOrders(supabase),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-white tracking-wide">Dashboard</h1>
        <p className="text-muted font-mono text-xs mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Alert banners */}
      {(stats.pendingOrders > 0 || stats.pendingSellReqs > 0 || stats.lowStock.length > 0) && (
        <div className="space-y-2">
          {stats.pendingOrders > 0 && (
            <Link href="/admin/orders?status=pending"
              className="flex items-center gap-3 p-4 rounded-xl bg-gold/10 border border-gold/30 hover:border-gold/60 transition-colors">
              <span className="text-xl">🔔</span>
              <span className="text-gold font-body font-semibold text-sm">
                {stats.pendingOrders} pending order{stats.pendingOrders !== 1 ? "s" : ""} need attention
              </span>
              <span className="ml-auto text-gold/60 text-xs font-mono">View →</span>
            </Link>
          )}
          {stats.pendingSellReqs > 0 && (
            <Link href="/admin/sell-requests?status=submitted"
              className="flex items-center gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/60 transition-colors">
              <span className="text-xl">📬</span>
              <span className="text-neon-2 font-body font-semibold text-sm">
                {stats.pendingSellReqs} new sell request{stats.pendingSellReqs !== 1 ? "s" : ""}
              </span>
              <span className="ml-auto text-neon-2/60 text-xs font-mono">View →</span>
            </Link>
          )}
          {stats.lowStock.length > 0 && (
            <Link href="/admin/products?filter=low-stock"
              className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 hover:border-red-500/60 transition-colors">
              <span className="text-xl">⚠️</span>
              <span className="text-red-400 font-body font-semibold text-sm">
                {stats.lowStock.length} product{stats.lowStock.length !== 1 ? "s" : ""} low on stock (≤3 remaining)
              </span>
              <span className="ml-auto text-red-400/60 text-xs font-mono">Fix →</span>
            </Link>
          )}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Products",    value: stats.totalProducts, icon: "📦", href: "/admin/products",       color: "text-neon"   },
          { label: "Singles",     value: stats.totalSingles,  icon: "🃏", href: "/admin/singles",        color: "text-neon-2" },
          { label: "Graded",      value: stats.totalGraded,   icon: "🏆", href: "/admin/graded",         color: "text-gold"   },
          { label: "Total Orders",value: stats.totalOrders,   icon: "🧾", href: "/admin/orders",         color: "text-purple-400" },
        ].map((s) => (
          <Link key={s.label} href={s.href}
            className="glass-hover p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{s.icon}</span>
              <span className={`font-display text-3xl ${s.color}`}>{s.value.toLocaleString()}</span>
            </div>
            <p className="font-mono text-xs text-muted uppercase tracking-wider">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Revenue card */}
      <div className="glass p-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-muted uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="font-display text-5xl text-green-400">${stats.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          <p className="font-mono text-xs text-muted mt-1">From {stats.totalOrders} orders</p>
        </div>
        <div className="text-6xl opacity-20">💰</div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Add Product",  href: "/admin/products/new",  icon: "➕" },
          { label: "Add Single",   href: "/admin/singles/new",   icon: "🃏" },
          { label: "Add Graded",   href: "/admin/graded/new",    icon: "🏆" },
          { label: "View Orders",  href: "/admin/orders",        icon: "🧾" },
        ].map((a) => (
          <Link key={a.label} href={a.href}
            className="glass-hover p-4 flex items-center gap-3 rounded-xl">
            <span className="text-xl">{a.icon}</span>
            <span className="font-body text-sm text-white font-medium">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="glass overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display text-xl text-white tracking-wide">Recent Orders</h2>
          <Link href="/admin/orders" className="font-mono text-xs text-neon hover:underline">View all →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-muted font-mono text-sm">No orders yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Order ID", "Status", "Total", "Date"].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-mono text-xs text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-2/50 transition-colors">
                  <td className="px-6 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs text-neon hover:underline">
                      #{order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`badge ${STATUS_STYLE[order.status] ?? "badge-neon"}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-body font-semibold text-white text-sm">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-3 font-mono text-xs text-muted">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
