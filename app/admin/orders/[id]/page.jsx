import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { updateOrderTracking } from "@/lib/actions/orders";

export const metadata = { title: "Order Detail" };

const STATUS_STYLE = {
  pending:          "badge-gold",
  payment_received: "badge-cyan",
  processing:       "badge-neon",
  shipped:          "badge-cyan",
  delivered:        "badge-green",
  refunded:         "badge-red",
  cancelled:        "badge-red",
};

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const [{ data: itemsRaw }, { data: profile }] = await Promise.all([
    supabase.from("order_items").select("*").eq("order_id", id),
    supabase.from("profiles").select("display_name, username").eq("id", order.user_id).single(),
  ]);
  const items = itemsRaw ?? [];

  // Bind order id so form action receives (formData) automatically
  const trackingAction = updateOrderTracking.bind(null, id);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/orders" className="font-mono text-xs text-muted hover:text-neon transition-colors">
            ← All Orders
          </Link>
          <h1 className="font-display text-4xl text-white tracking-wide mt-1">
            Order #{id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-muted font-mono text-xs mt-1">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <span className={`badge ${STATUS_STYLE[order.status] ?? "badge-neon"} text-sm py-1.5 px-3`}>
          {order.status.replace(/_/g, " ")}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer */}
        <div className="glass p-6 space-y-3">
          <h2 className="font-display text-xl text-white tracking-wide">Customer</h2>
          <div>
            <p className="font-body text-white font-medium">{profile?.display_name ?? "Unknown"}</p>
            <p className="font-mono text-xs text-muted">{profile?.username ?? order.user_id.slice(0, 8)}</p>
          </div>
          {order.shipping_address && Object.keys(order.shipping_address).length > 0 && (
            <div className="pt-3 border-t border-border">
              <p className="font-mono text-xs text-neon uppercase tracking-wider mb-2">Ship To</p>
              <div className="text-sm text-subtle space-y-0.5">
                {Object.values(order.shipping_address).filter(Boolean).map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="glass p-6 space-y-3">
          <h2 className="font-display text-xl text-white tracking-wide">Order Summary</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-white">${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span className="text-white">${Number(order.shipping_cost).toFixed(2)}</span>
            </div>
            {Number(order.tax) > 0 && (
              <div className="flex justify-between">
                <span className="text-muted">Tax</span>
                <span className="text-white">${Number(order.tax).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-white font-semibold">Total</span>
              <span className="text-neon font-semibold text-base">${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
          {order.stripe_payment_id && (
            <p className="font-mono text-[10px] text-muted pt-2 border-t border-border truncate">
              Stripe: {order.stripe_payment_id}
            </p>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="glass p-6 space-y-3">
        <h2 className="font-display text-xl text-white tracking-wide">Update Status</h2>
        <OrderStatusSelect id={order.id} currentStatus={order.status} />
      </div>

      {/* Tracking */}
      <div className="glass p-6 space-y-4">
        <h2 className="font-display text-xl text-white tracking-wide">Shipping & Tracking</h2>
        {order.tracking_number && (
          <p className="font-mono text-sm text-neon-2 bg-surface-3 px-4 py-2 rounded-lg inline-block">
            {order.carrier ?? "Carrier"} — {order.tracking_number}
          </p>
        )}
        <form action={trackingAction} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Carrier</label>
            <select name="carrier" defaultValue={order.carrier ?? ""}
              className="w-full bg-surface-3 border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon/50">
              <option value="">Select carrier</option>
              {["USPS","UPS","FedEx","DHL","Canada Post","Other"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Tracking Number</label>
            <input name="tracking_number" type="text" defaultValue={order.tracking_number ?? ""}
              placeholder="1Z999AA1012345678"
              className="w-full bg-surface-3 border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/50" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-neon py-2.5 px-6">
              Save Tracking & Mark Shipped
            </button>
          </div>
        </form>
      </div>

      {/* Items */}
      <div className="glass overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-display text-xl text-white tracking-wide">
            Items {items.length > 0 && `(${items.length})`}
          </h2>
        </div>
        {items.length === 0 ? (
          <div className="p-10 text-center text-muted font-mono text-sm">No line items recorded</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Item", "Price", "Qty", "Line Total"].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-mono text-xs text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-surface-2/40 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      {item.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image_url} alt={item.name}
                          className="w-10 h-10 object-contain rounded bg-surface-3" />
                      )}
                      <span className="font-body text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 font-mono text-sm text-muted">
                    ${Number(item.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-3 font-mono text-sm text-muted">×{item.quantity}</td>
                  <td className="px-6 py-3 font-body font-semibold text-white">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {order.notes && (
        <div className="glass p-6">
          <h2 className="font-display text-xl text-white tracking-wide mb-3">Order Notes</h2>
          <p className="text-subtle text-sm whitespace-pre-wrap">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
