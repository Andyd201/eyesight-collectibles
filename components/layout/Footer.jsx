import Link from "next/link";

const footerLinks = {
  Shop: [
    { label: "Sealed Products", href: "/shop?category=sealed" },
    { label: "Singles",         href: "/singles" },
    { label: "Graded Cards",    href: "/graded" },
    { label: "Accessories",     href: "/shop?category=accessories" },
    { label: "Japanese / Korean", href: "/shop?language=japanese" },
    { label: "Merchandise",     href: "/shop?category=merchandise" },
  ],
  Sell: [
    { label: "Sell to Us",   href: "/sell-to-us" },
    { label: "Trade In",     href: "/trade-in" },
    { label: "Bulk Inquiry", href: "/sell-to-us#bulk" },
  ],
  Info: [
    { label: "About Us",        href: "/about" },
    { label: "FAQ",             href: "/faq" },
    { label: "Contact",         href: "/contact" },
    { label: "Shipping Policy", href: "/shipping" },
  ],
  Community: [
    { label: "Live Breaks",          href: "/live" },
    { label: "Discord",              href: "https://discord.gg/eyesight", external: true },
    { label: "Pull Gallery",         href: "/community/pulls" },
    { label: "Tournament Calendar",  href: "/community/tournaments" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">👁️</span>
              <div className="leading-none">
                <span className="font-display text-xl text-white tracking-widest">EYESIGHT</span>
                <span className="block font-mono text-[9px] text-neon tracking-[0.3em] uppercase">Collectibles</span>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Your home for Pokémon singles, sealed product, graded cards, and international sets.
            </p>
            <div className="flex gap-3">
              {/* Discord */}
              <a href="https://discord.gg/eyesight" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-surface-2 border border-border text-muted hover:text-white hover:border-neon/40 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com/eyesightcollectibles" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-surface-2 border border-border text-muted hover:text-white hover:border-neon/40 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* TikTok */}
              <a href="https://tiktok.com/@eyesightcollectibles" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-surface-2 border border-border text-muted hover:text-white hover:border-neon/40 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.16 8.16 0 004.77 1.52V7.01a4.85 4.85 0 01-1-.32z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-mono text-xs uppercase tracking-widest text-neon mb-4">{group}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-muted hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted font-mono">
            © {new Date().getFullYear()} Eyesight Collectibles. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy"  className="text-xs text-muted hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms"    className="text-xs text-muted hover:text-white transition-colors">Terms</Link>
            <Link href="/shipping" className="text-xs text-muted hover:text-white transition-colors">Shipping</Link>
          </div>
          <p className="text-xs text-muted">
            Pokémon and all related names are trademarks of Nintendo/Creatures/GAME FREAK.
          </p>
        </div>
      </div>
    </footer>
  );
}
