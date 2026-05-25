export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="mb-12">
        <p className="section-label">Our story</p>
        <h1 className="section-title">About Eyesight Collectibles</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6 text-subtle leading-relaxed">
          <p>
            Eyesight Collectibles was founded by collectors, for collectors. We started because we were tired of
            overpriced singles, poor customer service, and stores that didn't care about the community.
          </p>
          <p>
            We specialize in Pokémon TCG singles, sealed product, and graded cards — with a particular focus on
            Japanese and Korean releases, which we believe are massively undervalued.
          </p>
          <p>
            Every card we sell is authentic and inspected. Every box is legitimate. We're building a store
            we'd want to buy from ourselves.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { icon: "🛡️", label: "100% Authentic",      desc: "Every product verified before it ships" },
            { icon: "⚡", label: "Fast Shipping",         desc: "Same-day dispatch on orders before 2pm" },
            { icon: "🌏", label: "International Focus",   desc: "JP & KR specialists. Real import stock." },
            { icon: "🤝", label: "Fair Prices",           desc: "We buy and sell — always transparent" },
            { icon: "👾", label: "Community First",       desc: "Discord, breaks, tournaments, pull gallery" },
          ].map((item) => (
            <div key={item.label} className="glass p-4 flex items-start gap-4">
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <h3 className="font-body font-semibold text-white">{item.label}</h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
