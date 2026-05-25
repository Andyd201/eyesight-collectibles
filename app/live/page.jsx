export const metadata = { title: "Live Breaks" };

export default function LivePage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="section-label">📡 Live selling</p>
        <h1 className="section-title">Live Breaks</h1>
        <p className="text-subtle mt-2">Box breaks, rip & ship, and mystery packs — live on TikTok & Whatnot</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Embed placeholder */}
        <div className="glass rounded-2xl aspect-video flex flex-col items-center justify-center gap-4">
          <span className="text-5xl">📺</span>
          <p className="font-display text-2xl text-white tracking-wide">Live Stream</p>
          <p className="text-muted text-sm">Embed Whatnot / TikTok live here</p>
        </div>

        {/* Upcoming breaks */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-white tracking-wide">Upcoming Breaks</h2>
          {[
            { title: "Scarlet & Violet Case Break", date: "Saturday 8PM EST", platform: "Whatnot", spots: "12 spots left", price: 25 },
            { title: "151 Korean Mystery Box", date: "Sunday 7PM EST", platform: "TikTok", spots: "Open", price: 35 },
            { title: "Obsidian Flames Box Break", date: "Next Monday 8PM EST", platform: "Whatnot", spots: "6 spots left", price: 20 },
          ].map((b) => (
            <div key={b.title} className="glass-hover p-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-body font-semibold text-white">{b.title}</h3>
                <p className="font-mono text-xs text-muted mt-0.5">{b.date} · {b.platform}</p>
                <span className="badge badge-neon mt-2">{b.spots}</span>
              </div>
              <div className="text-right shrink-0">
                <p className="font-body font-bold text-white">${b.price}</p>
                <button className="btn-neon py-1 px-3 text-xs mt-2">Grab Spot</button>
              </div>
            </div>
          ))}

          <div className="glass p-4 text-center">
            <p className="text-muted text-sm mb-3">Follow us for live notifications</p>
            <div className="flex gap-3 justify-center">
              <a href="https://whatnot.com" target="_blank" rel="noopener noreferrer" className="btn-outline text-xs py-1.5 px-3">Whatnot ↗</a>
              <a href="https://tiktok.com/@eyesightcollectibles" target="_blank" rel="noopener noreferrer" className="btn-outline text-xs py-1.5 px-3">TikTok ↗</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
