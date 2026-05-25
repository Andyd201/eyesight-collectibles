export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="mb-10">
        <p className="section-label">Say hello</p>
        <h1 className="section-title">Contact Us</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Info */}
        <div className="space-y-5">
          {[
            { icon: "📧", label: "Email",    value: "hello@eyesightcollectibles.com",       href: "mailto:hello@eyesightcollectibles.com" },
            { icon: "💬", label: "Discord",  value: "discord.gg/eyesight",                 href: "https://discord.gg/eyesight" },
            { icon: "📸", label: "Instagram",value: "@eyesightcollectibles",               href: "https://instagram.com/eyesightcollectibles" },
            { icon: "🎵", label: "TikTok",   value: "@eyesightcollectibles",               href: "https://tiktok.com/@eyesightcollectibles" },
          ].map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
              className="glass-hover flex items-center gap-4 p-4 rounded-xl">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="font-mono text-xs text-neon uppercase tracking-wider">{c.label}</p>
                <p className="text-sm text-white mt-0.5">{c.value}</p>
              </div>
            </a>
          ))}
          <div className="glass p-4 rounded-xl">
            <p className="font-mono text-xs text-neon uppercase tracking-wider mb-1">Response Time</p>
            <p className="text-sm text-subtle">We typically respond within 24 hours. For urgent inquiries, Discord is fastest.</p>
          </div>
        </div>

        {/* Form */}
        <form className="glass p-6 space-y-4">
          {[
            { label: "Name",    name: "name",    type: "text",  placeholder: "John Doe" },
            { label: "Email",   name: "email",   type: "email", placeholder: "john@example.com" },
            { label: "Subject", name: "subject", type: "text",  placeholder: "Order question, buying inquiry..." },
          ].map((f) => (
            <div key={f.name}>
              <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">{f.label}</label>
              <input type={f.type} placeholder={f.placeholder}
                className="w-full bg-surface-3 border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/50" />
            </div>
          ))}
          <div>
            <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">Message</label>
            <textarea rows={5} placeholder="How can we help?"
              className="w-full bg-surface-3 border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/50 resize-none" />
          </div>
          <button type="submit" className="btn-neon w-full py-3">Send Message →</button>
        </form>
      </div>
    </div>
  );
}
