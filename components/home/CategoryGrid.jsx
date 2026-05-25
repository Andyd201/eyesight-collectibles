import Link from "next/link";
import { CATEGORIES } from "@/lib/mockData";

export default function CategoryGrid() {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="section-label">Browse by category</p>
          <h2 className="section-title">Shop the Collection</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className={`group relative flex flex-col items-center gap-3 p-5 rounded-xl bg-surface-2 border border-border bg-gradient-to-b ${cat.color} ${cat.border} transition-all duration-300 hover:scale-[1.03] hover:shadow-card`}
          >
            <span className="text-3xl">{cat.icon}</span>
            <div className="text-center">
              <p className="font-body font-semibold text-sm text-white leading-tight">{cat.label}</p>
              <p className="font-mono text-[10px] text-muted mt-0.5">{cat.count} items</p>
            </div>
            <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/[0.02] transition-colors pointer-events-none" />
          </Link>
        ))}
      </div>
    </section>
  );
}
