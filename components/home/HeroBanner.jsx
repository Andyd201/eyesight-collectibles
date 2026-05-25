"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    tag: "🔥 Now In Stock",
    title: "Scarlet & Violet",
    subtitle: "Temporal Forces",
    description: "Booster boxes, ETBs, and singles — freshly restocked. Grab yours before they're gone.",
    cta: { label: "Shop Now", href: "/shop?set=temporal-forces" },
    cta2: { label: "View Singles", href: "/singles?set=temporal-forces" },
    accent: "#7C3AED",
    glow: "rgba(124,58,237,0.3)",
    emoji: "🔮",
  },
  {
    tag: "🇰🇷 Korean Focus",
    title: "Pokémon 151",
    subtitle: "Korean Edition",
    description: "The hottest Korean set right now. Incredible artwork, better prices, limited quantities.",
    cta: { label: "Shop Korean", href: "/shop?language=korean" },
    cta2: { label: "Learn More", href: "/about#korean" },
    accent: "#06B6D4",
    glow: "rgba(6,182,212,0.3)",
    emoji: "🃏",
  },
  {
    tag: "🏆 New Arrivals",
    title: "Graded Cards",
    subtitle: "PSA • CGC • Beckett",
    description: "Authenticated, slabbed, and investment-grade. Browse our growing graded card inventory.",
    cta: { label: "View Graded", href: "/graded" },
    cta2: { label: "Get a Quote", href: "/sell-to-us" },
    accent: "#FBBF24",
    glow: "rgba(251,191,36,0.3)",
    emoji: "🏆",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % slides.length);
        setAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden dot-grid">
      {/* Animated background glow */}
      <div
        className="absolute inset-0 transition-all duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 60% 40%, ${slide.glow}, transparent)`,
        }}
      />

      {/* Floating Pokéball decoration */}
      <div className="absolute right-[8%] top-1/2 -translate-y-1/2 hidden lg:block">
        <div
          className="w-64 h-64 xl:w-80 xl:h-80 rounded-full border-2 flex items-center justify-center animate-float"
          style={{ borderColor: slide.accent + "40", boxShadow: `0 0 60px ${slide.glow}, inset 0 0 60px ${slide.glow}` }}
        >
          <span className="text-8xl xl:text-9xl animate-pulse-slow">{slide.emoji}</span>
        </div>
        {/* Orbit rings */}
        <div className="absolute inset-0 rounded-full border border-white/5 scale-125 animate-spin" style={{ animationDuration: "20s" }} />
        <div className="absolute inset-0 rounded-full border border-white/3 scale-150 animate-spin" style={{ animationDuration: "30s", animationDirection: "reverse" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className={`max-w-2xl transition-all duration-300 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-2 border border-border text-sm font-mono text-subtle mb-6">
            {slide.tag}
          </span>

          <h1 className="font-display text-6xl md:text-8xl xl:text-9xl leading-none tracking-wide text-white mb-2">
            {slide.title}
          </h1>
          <h2
            className="font-display text-4xl md:text-5xl xl:text-6xl leading-none tracking-wide mb-6"
            style={{ color: slide.accent }}
          >
            {slide.subtitle}
          </h2>

          <p className="text-subtle text-lg md:text-xl leading-relaxed max-w-xl mb-10">
            {slide.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href={slide.cta.href} className="btn-neon text-base px-8 py-3">
              {slide.cta.label} →
            </Link>
            <Link href={slide.cta2.href} className="btn-outline text-base px-8 py-3">
              {slide.cta2.label}
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 mt-10">
            {[
              { icon: "🚚", label: "Free shipping $75+" },
              { icon: "🛡️", label: "100% authentic" },
              { icon: "⚡", label: "Same-day dispatch" },
              { icon: "💳", label: "Secure checkout" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-2">
                <span className="text-base">{t.icon}</span>
                <span className="font-mono text-xs text-muted">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Slide dots */}
        <div className="flex gap-2 mt-12">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-neon" : "w-4 bg-surface-3"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
    </section>
  );
}
