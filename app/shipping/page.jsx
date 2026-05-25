export const metadata = { title: "Shipping Policy" };

export default function ShippingPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="section-label">📦 Shipping info</p>
        <h1 className="section-title">Shipping Policy</h1>
      </div>

      <div className="space-y-6 text-subtle leading-relaxed">
        {[
          {
            title: "Processing Time",
            content: "Orders placed before 2:00 PM EST on business days ship the same day. Orders placed after 2:00 PM or on weekends ship the next business day.",
          },
          {
            title: "Domestic Shipping (USA)",
            content: "Standard shipping (3–5 business days): $4.99. Express shipping (1–2 business days): $12.99. Free standard shipping on orders over $75.",
          },
          {
            title: "International Shipping",
            content: "We ship worldwide. Rates are calculated at checkout based on destination and package weight. Most international orders arrive in 7–14 business days. Customers are responsible for any applicable customs duties or import taxes.",
          },
          {
            title: "Card Packaging",
            content: "Singles are shipped in penny sleeves inside a toploader, placed in a bubble mailer or rigid cardboard. High-value cards are double-sleeved and shipped in team bags. Graded slabs ship in foam-padded boxes.",
          },
          {
            title: "Tracking",
            content: "All orders include tracking. You'll receive a tracking number via email once your order ships. Allow 24 hours for tracking to update.",
          },
          {
            title: "Damaged or Lost Packages",
            content: "If your package arrives damaged or is lost in transit, contact us within 7 days of the expected delivery date. We'll work with you to resolve the issue, including filing a claim or sending a replacement.",
          },
        ].map((section) => (
          <div key={section.title} className="glass p-6">
            <h2 className="font-display text-xl text-white tracking-wide mb-3">{section.title}</h2>
            <p className="text-sm">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
