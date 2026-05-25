export const metadata = { title: "FAQ" };

const FAQS = [
  { q: "Are your cards authentic?",              a: "Yes — 100%. We inspect every card before listing and every order before shipping. We have a zero-tolerance policy for fakes." },
  { q: "How fast do you ship?",                  a: "Orders placed before 2pm ship same day. Standard: 3–5 business days. Express: 1–2 days. Free shipping on orders over $75." },
  { q: "What condition are your singles?",       a: "We use standard grading: NM (Near Mint), LP (Lightly Played), MP (Moderately Played). Condition is always listed on each card." },
  { q: "Do you ship internationally?",           a: "Yes! We ship worldwide. International shipping rates calculated at checkout. Most orders arrive in 7–14 business days." },
  { q: "Can I sell my cards to you?",            a: "Absolutely. Fill out our Sell to Us form and we'll get back to you within 24 hours with a quote." },
  { q: "How do pre-orders work?",               a: "Pre-orders are charged immediately to guarantee your spot. If a product is delayed or cancelled, you get a full refund." },
  { q: "What's your return policy?",            a: "We accept returns within 14 days for unopened sealed product. Singles are final sale unless there was a grading error on our part." },
  { q: "Do you do live breaks?",                a: "Yes! Follow us on TikTok and join our Discord for announcements. We run breaks weekly." },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="section-label">Got questions?</p>
        <h1 className="section-title">FAQ</h1>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq) => (
          <details key={faq.q} className="glass p-5 group open:border-neon/30 transition-colors">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="font-body font-semibold text-white pr-4">{faq.q}</span>
              <span className="text-neon shrink-0 transition-transform group-open:rotate-45 text-xl font-light">+</span>
            </summary>
            <p className="mt-4 text-subtle text-sm leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>

      <div className="glass p-6 text-center mt-10">
        <p className="text-subtle mb-4">Still have questions?</p>
        <a href="/contact" className="btn-neon">Contact Us →</a>
      </div>
    </div>
  );
}
