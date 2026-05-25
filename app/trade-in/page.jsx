export const metadata = { title: "Trade In" };

export default function TradeInPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="section-label">🔄 Upgrade your collection</p>
        <h1 className="section-title">Trade In</h1>
        <p className="text-subtle mt-2">Trade your cards for store credit and get more bang for your collection.</p>
      </div>
      <div className="glass p-8 text-center">
        <p className="text-5xl mb-4">🔄</p>
        <h2 className="font-display text-3xl text-white tracking-wide mb-3">Trade In Coming Soon</h2>
        <p className="text-subtle mb-6">Our trade-in system is launching soon. Submit your email to be notified first.</p>
        <div className="flex gap-3 max-w-sm mx-auto">
          <input type="email" placeholder="your@email.com"
            className="flex-1 bg-surface-3 border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/50" />
          <button className="btn-neon">Notify Me</button>
        </div>
        <p className="text-muted text-xs mt-4">Or email us directly: <a href="mailto:trades@eyesightcollectibles.com" className="text-neon hover:underline">trades@eyesightcollectibles.com</a></p>
      </div>
    </div>
  );
}
