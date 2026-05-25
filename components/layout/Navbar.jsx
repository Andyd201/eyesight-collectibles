"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_LINKS } from "@/lib/mockData";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch]     = useState("");
  const router    = useRouter();
  const searchRef = useRef(null);
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMenuOpen(false);
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/90 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">👁️</span>
            <div className="leading-none">
              <span className="font-display text-xl text-white tracking-widest">EYESIGHT</span>
              <span className="block font-mono text-[9px] text-neon tracking-[0.3em] uppercase">Collectibles</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-body text-subtle hover:text-white hover:bg-surface-2 transition-colors duration-200"
              >
                {link.label}
                {link.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500 text-white animate-pulse">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Search + actions */}
          <div className="flex items-center gap-2">
            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2 border border-border w-56 focus-within:border-neon/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cards..."
                className="bg-transparent text-sm text-white placeholder-muted w-full focus:outline-none font-body"
              />
            </form>

            {/* Wishlist */}
            <Link href="/account/wishlist" className="p-2 rounded-lg text-muted hover:text-white hover:bg-surface-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-lg text-muted hover:text-white hover:bg-surface-2 transition-colors"
              aria-label="Open cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neon text-[10px] font-bold text-white flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            {/* Account */}
            <Link href="/account" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2 border border-border text-sm font-body text-subtle hover:text-white hover:border-neon/40 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Account
            </Link>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-muted hover:text-white hover:bg-surface-2 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-border py-4 space-y-1">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2 border border-border mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cards, sets, Pokémon..."
                className="bg-transparent text-sm text-white placeholder-muted w-full focus:outline-none"
              />
            </form>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-body text-subtle hover:text-white hover:bg-surface-2 transition-colors"
              >
                {link.label}
                {link.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500 text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
