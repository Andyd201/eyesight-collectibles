import { createClient, getUser } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "Wishlist" };

export default async function AccountWishlistPage() {
  const user = await getUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("wishlists")
    .select("id, added_at, products(id, name, price, images, category), singles(id, pokemon_name, set_name, price, language)")
    .eq("user_id", user.id)
    .order("added_at", { ascending: false });

  const items = data ?? [];

  return (
    <>
      <div>
        <h2 className="font-display text-3xl text-white tracking-wide">Wishlist</h2>
        <p className="font-mono text-xs text-muted mt-1">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
      </div>

      {items.length === 0 ? (
        <div className="glass p-10 text-center space-y-3">
          <span className="text-5xl block opacity-40">❤️</span>
          <p className="text-white font-body font-semibold">Your wishlist is empty</p>
          <p className="text-muted text-sm">Save items you love by clicking the heart icon on any product.</p>
          <div className="flex gap-3 justify-center mt-2">
            <Link href="/singles" className="btn-neon py-2 px-5 text-sm">Browse Singles →</Link>
            <Link href="/shop" className="btn-outline py-2 px-5 text-sm">Shop All</Link>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item) => {
            const p = item.products;
            const s = item.singles;
            const name  = p?.name ?? `${s?.pokemon_name} — ${s?.set_name}`;
            const price = p?.price ?? s?.price;
            return (
              <div key={item.id} className="glass p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-3 rounded-lg flex items-center justify-center text-2xl">
                  {p ? "📦" : "🃏"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-white truncate">{name}</p>
                  <p className="font-mono text-xs text-neon">${Number(price).toFixed(2)}</p>
                </div>
                <Link
                  href={p ? `/product/${p.id}` : `/singles`}
                  className="btn-neon py-1.5 px-3 text-xs shrink-0"
                >
                  View →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
