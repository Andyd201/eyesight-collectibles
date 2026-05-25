import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "Shop" };

const CAT_ICON  = { sealed: "📦", accessory: "🎴", merchandise: "🛍️", single: "🃏", graded: "🏆" };
const CAT_LABEL = { sealed: "Sealed", accessory: "Accessories", merchandise: "Merchandise", single: "Singles", graded: "Graded" };

export default async function ShopPage({ searchParams }) {
  const p = await searchParams;
  const category = p.category || null;
  const language = p.language || null;

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("featured",   { ascending: false })
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);
  if (language) query = query.eq("language",  language);

  const { data: productsRaw } = await query.limit(48);
  const products = productsRaw ?? [];

  const title = category ? (CAT_LABEL[category] ?? category) : language ? `${language.charAt(0).toUpperCase() + language.slice(1)} Products` : "Shop";

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="section-label">All products</p>
        <h1 className="section-title">{title}</h1>
        <p className="text-subtle mt-2">{products.length} product{products.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 space-y-4">
          <div className="glass p-4">
            <h3 className="font-mono text-xs text-neon uppercase tracking-widest mb-3">Category</h3>
            <div className="space-y-1">
              {[
                [null,          "🛒 All"],
                ["sealed",      "📦 Sealed"],
                ["accessory",   "🎴 Accessories"],
                ["merchandise", "🛍️ Merchandise"],
              ].map(([v, l]) => (
                <Link
                  key={v ?? "all"}
                  href={v ? `/shop?category=${v}` : "/shop"}
                  className={`block text-sm py-1.5 px-2 rounded transition-colors ${
                    category === v ? "text-neon bg-neon/10 font-semibold" : "text-subtle hover:text-white"
                  }`}
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>

          <div className="glass p-4">
            <h3 className="font-mono text-xs text-neon uppercase tracking-widest mb-3">Language</h3>
            <div className="space-y-1">
              {[
                [null,       "🌏 All"],
                ["english",  "🇬🇧 English"],
                ["japanese", "🇯🇵 Japanese"],
                ["korean",   "🇰🇷 Korean"],
              ].map(([v, l]) => (
                <Link
                  key={v ?? "all"}
                  href={v ? `/shop?language=${v}${category ? `&category=${category}` : ""}` : category ? `/shop?category=${category}` : "/shop"}
                  className={`block text-sm py-1.5 px-2 rounded transition-colors ${
                    language === v ? "text-neon bg-neon/10 font-semibold" : "text-subtle hover:text-white"
                  }`}
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="glass p-16 text-center space-y-3">
              <span className="text-5xl block opacity-40">📭</span>
              <p className="text-white font-body font-semibold">No products found</p>
              <Link href="/shop" className="btn-outline inline-block py-2 px-5 mt-2">View All Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => {
                const onSale = product.original_price && Number(product.original_price) > Number(product.price);
                return (
                  <Link key={product.id} href={`/product/${product.id}`}
                    className="glass rounded-xl overflow-hidden group hover:border-neon/30 transition-colors block">
                    {/* Image */}
                    <div className="aspect-[3/4] bg-surface-3 flex items-center justify-center relative overflow-hidden">
                      {product.images?.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="text-center p-4 select-none">
                          <span className="text-6xl block mb-2">{CAT_ICON[product.category] ?? "📦"}</span>
                          <p className="font-mono text-[10px] text-muted">{product.subcategory ?? product.category}</p>
                        </div>
                      )}
                      {product.badge && (
                        <span className="absolute top-2 left-2 badge badge-gold text-[10px]">{product.badge}</span>
                      )}
                      {onSale && (
                        <span className="absolute top-2 right-2 badge badge-red text-[10px]">SALE</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-1">
                      <p className="font-body text-sm text-white font-semibold line-clamp-2 group-hover:text-neon transition-colors">
                        {product.name}
                      </p>
                      {product.set_name && (
                        <p className="font-mono text-[10px] text-muted">{product.set_name}</p>
                      )}
                      <div className="flex items-end justify-between pt-2">
                        <div>
                          <p className="font-body font-bold text-white">${Number(product.price).toFixed(2)}</p>
                          {onSale && (
                            <p className="font-mono text-[10px] text-muted line-through">${Number(product.original_price).toFixed(2)}</p>
                          )}
                        </div>
                        <span className="btn-neon py-1.5 px-3 text-xs">View →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
