import Link from "next/link";

export default function SaleBanner() {
  return (
    <section className="px-4 sm:px-6 max-w-7xl mx-auto my-4">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-neon/30 via-neon-2/20 to-neon/10 border border-neon/30 p-8 md:p-10">
        {/* Background pattern */}
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="badge-gold badge mb-3">⚡ Flash Sale</span>
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-wide">
              Up to <span className="text-gold">40% OFF</span>
            </h2>
            <p className="text-subtle mt-2 text-lg">
              Japanese & Korean booster boxes — this weekend only.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <Link href="/shop?sale=true" className="btn-gold text-base px-8 py-3">
              Shop the Sale →
            </Link>
            <p className="font-mono text-xs text-muted text-center">Ends Sunday at midnight</p>
          </div>
        </div>
      </div>
    </section>
  );
}
