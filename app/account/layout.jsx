import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import SignOutButton from "@/components/auth/SignOutButton";

export const metadata = { title: { default: "My Account", template: "%s | My Account" } };

const NAV = [
  { icon: "📊", label: "Overview",      href: "/account"               },
  { icon: "📦", label: "My Orders",     href: "/account/orders"        },
  { icon: "❤️",  label: "Wishlist",      href: "/account/wishlist"      },
  { icon: "💰", label: "Sell Requests", href: "/account/sell-requests" },
  { icon: "⚙️",  label: "Settings",     href: "/account/settings"      },
];

export default async function AccountLayout({ children }) {
  const user = await getUser();
  if (!user) redirect("/auth/login");

  const displayName = user.user_metadata?.display_name ?? user.email ?? "Collector";
  const isAdmin     = user.app_metadata?.is_admin === true;
  const initials    = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="section-label">Your collector hub</p>
        <h1 className="section-title">My Account</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Avatar card */}
          <div className="glass p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-neon/20 border-2 border-neon/40 text-neon font-display text-2xl flex items-center justify-center mx-auto mb-3">
              {initials}
            </div>
            <p className="font-body font-semibold text-white">{displayName}</p>
            <p className="font-mono text-xs text-muted mt-1">{user.email}</p>
            {isAdmin && (
              <span className="badge badge-gold mt-2 inline-flex">Admin</span>
            )}
          </div>

          {/* Nav links */}
          <nav className="glass p-4 space-y-1">
            {NAV.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-subtle hover:text-white hover:bg-surface-3 transition-colors"
              >
                <span>{link.icon}</span>
                {link.label}
              </a>
            ))}
            {isAdmin && (
              <a
                href="/admin"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gold hover:bg-gold/10 transition-colors"
              >
                <span>🛠️</span>
                Admin Dashboard
              </a>
            )}
          </nav>

          <SignOutButton />
        </aside>

        {/* Page content */}
        <div className="md:col-span-2 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
