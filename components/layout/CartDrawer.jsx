"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, open, itemCount, subtotal, removeItem, setQty, closeCart } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col
          bg-surface border-l border-border shadow-2xl
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl text-white tracking-wide">Cart</h2>
            {itemCount > 0 && (
              <span className="badge badge-neon">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg text-muted hover:text-white hover:bg-surface-2 transition-colors"
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <span className="text-5xl opacity-30">🛒</span>
              <p className="text-muted font-body">Your cart is empty</p>
              <button onClick={closeCart} className="btn-neon py-2 px-6">
                Keep Shopping →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="glass p-4 flex gap-4">
                {/* Image */}
                <div className="w-16 h-20 rounded-lg bg-surface-3 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-2xl opacity-40">🃏</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] text-muted uppercase tracking-wider truncate">
                    {item.set} {item.language && `· ${item.language}`}
                  </p>
                  <p className="font-body font-semibold text-white text-sm leading-snug mt-0.5 line-clamp-2">
                    {item.name}
                  </p>
                  <p className="font-body font-bold text-neon mt-1">${item.price.toFixed(2)}</p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 bg-surface-3 rounded-lg border border-border">
                      <button
                        onClick={() => setQty(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-muted hover:text-white transition-colors text-lg leading-none"
                        aria-label="Decrease qty"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-mono text-sm text-white">{item.quantity}</span>
                      <button
                        onClick={() => setQty(item.id, item.quantity + 1)}
                        disabled={item.quantity >= (item.stock ?? 99)}
                        className="w-7 h-7 flex items-center justify-center text-muted hover:text-white transition-colors disabled:opacity-30"
                        aria-label="Increase qty"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="font-mono text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="text-right shrink-0">
                  <p className="font-body font-bold text-white text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4">
            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted font-body">Subtotal</span>
                <span className="text-white font-body font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-mono text-muted">
                <span>Shipping calculated at checkout</span>
                <span>Free over $75</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-neon w-full py-3.5 text-base text-center block"
            >
              Checkout · ${subtotal.toFixed(2)} →
            </Link>
            <button
              onClick={closeCart}
              className="btn-outline w-full py-2.5 text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
