"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const [imgError,  setImgError]  = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded]         = useState(false);
  const { addItem } = useCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const badgeColors = {
    HOT: "badge-red", NEW: "badge-neon", SALE: "badge-gold",
    "ALT ART": "badge-cyan", "⭐ RARE": "badge-gold",
  };

  function handleAddToCart(e) {
    e.preventDefault();
    addItem({
      id:       product.id,
      type:     "product",
      name:     product.name,
      price:    product.price,
      image:    product.image ?? null,
      set:      product.set ?? "",
      language: product.language ?? "English",
      stock:    product.stock ?? 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group relative glass-hover flex flex-col overflow-hidden">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative block aspect-[3/4] bg-surface-3 overflow-hidden">
        {!imgError && product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">🃏</div>
        )}
        <div className="absolute inset-0 bg-card-shine opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </Link>

      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1">
        {product.badge && <span className={`${badgeColors[product.badge] ?? "badge-neon"} badge`}>{product.badge}</span>}
        {discount && <span className="badge badge-red">-{discount}%</span>}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="badge badge-gold">Only {product.stock} left</span>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={() => setWishlisted(!wishlisted)}
        className="absolute top-3 right-3 p-1.5 rounded-lg bg-bg/60 backdrop-blur-sm transition-colors"
        style={{ color: wishlisted ? "#ef4444" : undefined }}
        aria-label="Wishlist"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={wishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">{product.set} · {product.language}</p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-body font-semibold text-white text-sm leading-snug mb-3 hover:text-neon transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <span className="font-body font-bold text-lg text-white">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-muted line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={`btn-neon py-1.5 px-3 text-xs transition-all ${added ? "bg-green-500 border-green-500" : ""}`}
          >
            {added ? "✓ Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
