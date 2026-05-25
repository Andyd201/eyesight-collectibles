export const metadata = { title: "Sell to Us" };

export default function SellToUsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="section-label">💰 Get paid fast</p>
        <h1 className="section-title">Sell to Us</h1>
        <p className="text-subtle mt-2">We buy singles, sealed product, collections, and bulk. Fast quotes, fair prices.</p>
      </div>

      {/* Steps */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {[
          { step: "1", title: "Submit your list", desc: "Fill out the form below or email us a list of what you have." },
          { step: "2", title: "Get a quote",      desc: "We'll respond within 24 hours with a fair offer." },
          { step: "3", title: "Get paid",         desc: "Ship to us (we cover shipping) and receive payment in 1–2 days." },
        ].map((s) => (
          <div key={s.step} className="glass p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-neon/20 border border-neon/40 text-neon font-display text-xl flex items-center justify-center mx-auto mb-3">{s.step}</div>
            <h3 className="font-body font-semibold text-white mb-1">{s.title}</h3>
            <p className="text-sm text-muted">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <form className="glass p-8 space-y-5">
        <h2 className="font-display text-2xl text-white tracking-wide mb-2">Submit a Quote Request</h2>
        {[
          { label: "Your Name",    name: "name",    type: "text",  placeholder: "John Doe" },
          { label: "Email",        name: "email",   type: "email", placeholder: "john@example.com" },
          { label: "Phone (optional)", name: "phone", type: "tel", placeholder: "+1 (555) 000-0000" },
        ].map((f) => (
          <div key={f.name}>
            <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">{f.label}</label>
            <input type={f.type} placeholder={f.placeholder}
              className="w-full bg-surface-3 border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/50" />
          </div>
        ))}
        <div>
          <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">What are you selling?</label>
          <textarea rows={5} placeholder="List the cards/products you want to sell. Include set, condition, quantity. (e.g. 4x Charizard VMAX 020/189 NM, 1x Evolving Skies Booster Box sealed)"
            className="w-full bg-surface-3 border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/50 resize-none" />
        </div>
        <button type="submit" className="btn-neon w-full py-3 text-base">Submit Quote Request →</button>
      </form>
    </div>
  );
}
