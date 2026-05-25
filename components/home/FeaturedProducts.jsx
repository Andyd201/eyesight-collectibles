import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { FEATURED_PRODUCTS } from "@/lib/mockData";

export default function FeaturedProducts() {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="section-label">Hand-picked</p>
          <h2 className="section-title">Featured Products</h2>
        </div>
        <Link href="/shop" className="btn-outline hidden sm:inline-flex">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {FEATURED_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center mt-8 sm:hidden">
        <Link href="/shop" className="btn-outline">View All Products →</Link>
      </div>
    </section>
  );
}
