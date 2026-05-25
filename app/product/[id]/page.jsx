"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ProductPage() {
  const params  = useParams();
  const id      = params?.id;
  const { addItem } = useCart();

  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [qty, setQty]           = useState(1);
  const [added, setAdded]       = useState(false);
  const [wishlisted, setWish]   = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const res = await fetch(`/api/product/${id}`);
        if (res.ok) setProduct(await res.json());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function handleAddToCart() {
    if (!product) return;
    addItem({
      id:       product.id,
      type:     product._type ?? "product",
      name:     product.name ?? product.pokemon_name,
      price:    product.price,
      image:    product.images?.[0] ?? null,
      set:      product.set_name ?? "",
      language: product.language ?? "English",
      stock:    product.stock ?? (product.in_stock ? 1 : 0),
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full border-2 border-neon/30 border-t-neon animate-spin mx-auto" />
        <p className="font-mono text-sm text-muted">Loading…</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center space-y-4">
        <span className="text-6xl block opacity-30">🔍</span>
        <p className="font-body text-white text-xl font-semibold">Product not found</p>
        <a href="/shop" className="btn-neon inline-block py-2.5 px-6">Browse Shop →</a>
      </div>
    </div>
  );

  const name     = product.name ?? product.pokemon_name ?? "Unknown";
  const images   = product.images ?? [];
  const inStock  = product.stock > 0 || product.in_stock === true;
  const maxQty   = product.stock ?? 1;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 font-mono text-xs text-muted mb-8">
        <a href="/" className="hover:text-white transition-colors">Home</a>
        <span>/</span>
        <a href="/shop" className="hover:text-white transition-colors">Shop</a>
        <span>/</span>
        <span className="text-subtle truncate max-w-[200px]">{name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-surface-2 rounded-2xl border border-border flex items-center justify-center overflow-hidden">
            {images[activeImg] ? (
              <img src={images[activeImg]} alt={name} className="w-full h-full object-contain p-8" />
            ) : (
              <div className="text-center">
                <span className="text-8xl opacity-20">🃏</span>
                <p className="font-mono text-xs text-muted mt-4">Image coming soon</p>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-lg border overflow-hidden transition-colors ${i === activeImg ? "border-neon" : "border-border"}`}>
                  <img src={img} alt="" className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {product.badge    && <span className="badge badge-neon">{product.badge}</span>}
            {product.language && <span className="badge badge-cyan">{product.language}</span>}
            {product.grader   && <span className="badge badge-gold">{product.grader} {product.grade}</span>}
            {inStock
              ? <span className="badge badge-green">✓ In Stock</span>
              : <span className="badge badge-red">Out of Stock</span>}
          </div>

          <div>
            <p className="font-mono text-xs text-muted uppercase tracking-wider mb-1">
              {product.set_name}{product.card_number ? ` · ${product.card_number}` : ""}
            </p>
            <h1 className="font-display text-4xl text-white tracking-wide leading-tight">{name}</h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl text-neon">${Number(product.price).toFixed(2)}</span>
            {product.original_price && Number(product.original_price) > Number(product.price) && (
              <span className="text-muted text-xl line-through">${Number(product.original_price).toFixed(2)}</span>
            )}
          </div>

          <div className="glass p-5 space-y-3">
            {[
              product.set_name   && ["Set",       product.set_name],
              product.rarity     && ["Rarity",    product.rarity],
              product.language   && ["Language",  product.language],
              product.condition  && ["Condition", product.condition],
              product.card_number && ["Card #",   product.card_number],
              product.cert_number && ["Cert #",   product.cert_number],
              product.category   && ["Category",  product.category],
            ].filter(Boolean).map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-muted font-mono">{label}</span>
                <span className="text-white font-body font-medium capitalize">{value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {maxQty > 1 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-surface-2 border border-border rounded-lg overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center text-muted hover:text-white hover:bg-surface-3 transition-colors text-xl">−</button>
                  <span className="w-10 text-center font-mono text-white">{qty}</span>
                  <button onClick={() => setQty(Math.min(maxQty, qty + 1))}
                    className="w-10 h-10 flex items-center justify-center text-muted hover:text-white hover:bg-surface-3 transition-colors">+</button>
                </div>
                <p className="font-mono text-xs text-muted">{maxQty} available</p>
              </div>
            )}

            <button onClick={handleAddToCart} disabled={!inStock}
              className={`btn-neon w-full py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed ${added ? "!bg-green-500" : ""}`}>
              {added ? "✓ Added to Cart!" : "Add to Cart →"}
            </button>

            <button onClick={() => setWish(!wishlisted)}
              className={`btn-outline w-full py-3 flex items-center justify-center gap-2 ${wishlisted ? "border-red-500/50 text-red-400" : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={wishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { icon: "🛡️", text: "100% Authentic" },
              { icon: "⚡",  text: "Same-day dispatch" },
              { icon: "🚚", text: "Free shipping $75+" },
              { icon: "↩️",  text: "14-day returns" },
            ].map((t) => (
              <div key={t.text} className="flex items-center gap-2">
                <span className="text-sm">{t.icon}</span>
                <span className="font-mono text-xs text-muted">{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
