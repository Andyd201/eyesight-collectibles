import HeroBanner      from "@/components/home/HeroBanner";
import CategoryGrid    from "@/components/home/CategoryGrid";
import SaleBanner      from "@/components/home/SaleBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HotSingles      from "@/components/home/HotSingles";
import UpcomingDrops   from "@/components/home/UpcomingDrops";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <SaleBanner />
      <FeaturedProducts />
      <HotSingles />
      <UpcomingDrops />

      {/* Korean/Japanese spotlight CTA */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-red-900/30 to-surface-2 border border-red-500/20 p-8 group hover:border-red-500/40 transition-colors">
            <p className="text-4xl mb-4">🇯🇵</p>
            <h3 className="font-display text-3xl text-white tracking-wide mb-2">Japanese Sets</h3>
            <p className="text-subtle text-sm leading-relaxed mb-6">
              First prints, promos, and exclusive Japanese-only releases. Often cheaper than English equivalents.
            </p>
            <a href="/shop?language=japanese" className="btn-outline">
              Browse Japanese →
            </a>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900/30 to-surface-2 border border-blue-500/20 p-8 group hover:border-blue-500/40 transition-colors">
            <p className="text-4xl mb-4">🇰🇷</p>
            <h3 className="font-display text-3xl text-white tracking-wide mb-2">Korean Sets</h3>
            <p className="text-subtle text-sm leading-relaxed mb-6">
              Korean Pokémon is exploding right now. Beautiful print quality, lower entry cost, high growth potential.
            </p>
            <a href="/shop?language=korean" className="btn-outline">
              Browse Korean →
            </a>
          </div>
        </div>
      </section>

      {/* Community/Discord CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-3xl mb-4">👾</p>
          <h2 className="font-display text-4xl text-white tracking-wide mb-3">Join the Community</h2>
          <p className="text-subtle mb-8">
            Trade, discuss, share your pulls, and get first access to restocks. 1,000+ collectors on Discord.
          </p>
          <a
            href="https://discord.gg/eyesight"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon text-base px-10 py-3"
          >
            Join our Discord →
          </a>
        </div>
      </section>
    </>
  );
}
