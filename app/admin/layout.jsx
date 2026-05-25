import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";

export const metadata = { title: { template: "%s | Admin — Eyesight" } };

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { href: "/admin",            icon: "📊", label: "Dashboard"   },
    ],
  },
  {
    label: "Inventory",
    items: [
      { href: "/admin/inventory",  icon: "📦", label: "All Items"   },
      { href: "/admin/inventory/new", icon: "➕", label: "Add Item", accent: true },
    ],
  },
  {
    label: "Store",
    items: [
      { href: "/admin/orders",         icon: "🧾", label: "Orders"       },
      { href: "/admin/sell-requests",  icon: "💰", label: "Sell Requests"},
    ],
  },
];

export default async function AdminLayout({ children }) {
  const user = await getUser();

  if (!user || !user.app_metadata?.is_admin) redirect("/");

  return (
    <div className="min-h-screen flex bg-bg">
      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside className="fixed top-0 left-0 h-full w-56 bg-surface border-r border-border z-40 flex flex-col">

        {/* Logo */}
        <div className="p-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl">👁️</span>
            <div className="leading-none">
              <p className="font-display text-base text-white tracking-widest">EYESIGHT</p>
              <p className="font-mono text-[8px] text-neon tracking-[0.3em]">ADMIN</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="font-mono text-[9px] text-muted/60 uppercase tracking-[0.2em] px-3 mb-1.5">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group
                      ${item.accent
                        ? "bg-neon/10 text-neon border border-neon/20 hover:bg-neon/20"
                        : "text-subtle hover:text-white hover:bg-surface-2"
                      }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="font-body">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-border space-y-1">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-neon/20 border border-neon/40 flex items-center justify-center font-display text-neon text-xs shrink-0">
              {(user.user_metadata?.display_name ?? user.email ?? "A")[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-body text-white truncate">{user.user_metadata?.display_name ?? user.email ?? "Admin"}</p>
              <p className="font-mono text-[9px] text-gold">Superuser</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted hover:text-white hover:bg-surface-2 transition-colors">
            <span>←</span> Back to Store
          </Link>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────── */}
      <main className="ml-56 flex-1 min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
