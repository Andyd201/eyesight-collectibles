import { getUser } from "@/lib/supabase/server";

export const metadata = { title: "Overview" };

export default async function AccountPage() {
  const user = await getUser();

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Orders",       value: "0",  icon: "📦" },
          { label: "Wishlist",     value: "0",  icon: "❤️"  },
          {
            label: "Member since",
            value: user ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—",
            icon:  "🗓️",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass p-4 text-center">
            <p className="text-2xl mb-1">{stat.icon}</p>
            <p className="font-display text-2xl text-white">{stat.value}</p>
            <p className="font-mono text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="glass p-6">
        <h2 className="font-display text-2xl text-white tracking-wide mb-4">Recent Orders</h2>
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <span className="text-4xl opacity-40">📭</span>
          <p className="text-muted text-sm">No orders yet</p>
          <a href="/shop" className="btn-neon py-2 px-5 text-sm">Start Shopping →</a>
        </div>
      </div>

      {/* Wishlist preview */}
      <div className="glass p-6">
        <h2 className="font-display text-2xl text-white tracking-wide mb-4">Wishlist</h2>
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <span className="text-4xl opacity-40">❤️</span>
          <p className="text-muted text-sm">Your wishlist is empty</p>
          <a href="/singles" className="btn-outline py-2 px-5 text-sm">Browse Singles →</a>
        </div>
      </div>
    </>
  );
}
