"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 8.99;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep]         = useState("shipping"); // shipping | review | done
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const [form, setForm] = useState({
    first_name: "", last_name: "",
    email: "", phone: "",
    address: "", city: "", province: "", postal_code: "", country: "Canada",
    notes: "",
  });

  const shippingFree  = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost  = shippingFree ? 0 : SHIPPING_COST;
  const total         = subtotal + shippingCost;

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handlePlaceOrder() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({
            product_id:   i.id,
            product_type: i.type,
            name:         i.name,
            price:        i.price,
            quantity:     i.quantity,
            image:        i.image,
          })),
          subtotal,
          shipping_cost: shippingCost,
          total,
          shipping_address: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to place order");
      clearCart();
      setStep("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const ic = "w-full bg-surface-3 border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/50";
  const lc = "font-mono text-xs text-muted uppercase tracking-wider block mb-1";

  /* ── Done ─────────────────────────────────────────────────── */
  if (step === "done") return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
      <div className="glass p-12 text-center max-w-md space-y-5">
        <span className="text-6xl block">🎉</span>
        <h1 className="font-display text-3xl text-white tracking-wide">Order Placed!</h1>
        <p className="text-muted text-sm font-body">
          Thanks for your order! We'll email you once it's processed and shipped.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link href="/account/orders" className="btn-neon py-2.5 px-6">View Orders →</Link>
          <Link href="/shop" className="btn-outline py-2.5 px-5">Keep Shopping</Link>
        </div>
      </div>
    </div>
  );

  /* ── Empty cart ───────────────────────────────────────────── */
  if (items.length === 0) return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
      <div className="glass p-12 text-center max-w-md space-y-4">
        <span className="text-6xl block opacity-30">🛒</span>
        <h1 className="font-display text-3xl text-white tracking-wide">Your cart is empty</h1>
        <p className="text-muted text-sm">Add some items before checking out.</p>
        <Link href="/shop" className="btn-neon inline-block py-2.5 px-6 mt-2">Browse Shop →</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="section-label">Almost there</p>
        <h1 className="section-title">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">

        {/* ── Left: Form ───────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-6">

          {/* Shipping */}
          <div className="glass p-6 space-y-4">
            <h2 className="font-display text-xl text-white tracking-wide">Shipping Info</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lc}>First Name *</label>
                <input name="first_name" required value={form.first_name} onChange={handleChange} className={ic} placeholder="Jean" />
              </div>
              <div>
                <label className={lc}>Last Name *</label>
                <input name="last_name" required value={form.last_name} onChange={handleChange} className={ic} placeholder="Dupont" />
              </div>
            </div>

            <div>
              <label className={lc}>Email *</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} className={ic} placeholder="you@example.com" />
            </div>

            <div>
              <label className={lc}>Phone</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={ic} placeholder="+1 514 000 0000" />
            </div>

            <div>
              <label className={lc}>Address *</label>
              <input name="address" required value={form.address} onChange={handleChange} className={ic} placeholder="123 Rue Sainte-Catherine" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lc}>City *</label>
                <input name="city" required value={form.city} onChange={handleChange} className={ic} placeholder="Montréal" />
              </div>
              <div>
                <label className={lc}>Province *</label>
                <select name="province" value={form.province} onChange={handleChange} className={ic}>
                  <option value="">Select…</option>
                  {["AB","BC","MB","NB","NL","NS","ON","PE","QC","SK","NT","NU","YT"].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lc}>Postal Code *</label>
                <input name="postal_code" required value={form.postal_code} onChange={handleChange} className={ic} placeholder="H2X 1Y4" />
              </div>
              <div>
                <label className={lc}>Country</label>
                <input name="country" value={form.country} disabled className={`${ic} opacity-50`} />
              </div>
            </div>

            <div>
              <label className={lc}>Order Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                className={`${ic} resize-none`} placeholder="Any special instructions…" />
            </div>
          </div>

          {/* Payment placeholder */}
          <div className="glass p-6 space-y-3">
            <h2 className="font-display text-xl text-white tracking-wide">Payment</h2>
            <div className="p-4 rounded-xl bg-neon/5 border border-neon/20 flex items-center gap-3">
              <span className="text-2xl">🏦</span>
              <div>
                <p className="text-sm text-white font-body font-medium">E-Transfer / Interac</p>
                <p className="font-mono text-xs text-muted">Payment instructions will be sent by email after your order is confirmed.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* ── Right: Order Summary ─────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass p-5 space-y-4 sticky top-24">
            <h2 className="font-display text-lg text-white tracking-wide">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="w-12 h-12 bg-surface-3 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image
                      ? <img src={item.image} alt="" className="w-full h-full object-contain" />
                      : <span className="text-xl">🃏</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white font-body font-medium truncate">{item.name}</p>
                    <p className="font-mono text-[10px] text-muted">{item.set || item.language}</p>
                    <p className="font-mono text-[10px] text-muted">× {item.quantity}</p>
                  </div>
                  <p className="font-mono text-sm text-neon shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="text-white font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Shipping</span>
                {shippingFree
                  ? <span className="text-green-400 font-mono text-xs">FREE</span>
                  : <span className="text-white font-mono">${shippingCost.toFixed(2)}</span>}
              </div>
              {!shippingFree && (
                <p className="font-mono text-[10px] text-muted">
                  Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                <span className="text-white">Total</span>
                <span className="text-neon font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !form.first_name || !form.email || !form.address || !form.city || !form.postal_code}
              className="btn-neon w-full py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Placing Order…" : `Place Order — $${total.toFixed(2)}`}
            </button>

            <p className="font-mono text-[10px] text-muted text-center">
              🛡️ Secure checkout · Orders confirmed by email
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
