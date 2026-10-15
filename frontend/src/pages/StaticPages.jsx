import { Link } from "react-router-dom";

function Shell({ eyebrow, title, children }) {
  return (
    <div className="container-x py-14 max-w-3xl">
      <p className="label-eyebrow mb-2">{eyebrow}</p>
      <h1 className="font-display text-4xl mb-8">{title}</h1>
      <div className="prose-sm text-graphite space-y-4 leading-relaxed">{children}</div>
    </div>
  );
}

export function SizeGuide() {
  const rows = [
    { us: 6, uk: 5.5, eu: 39, cm: 24 },
    { us: 7, uk: 6.5, eu: 40, cm: 25 },
    { us: 8, uk: 7.5, eu: 41, cm: 26 },
    { us: 9, uk: 8.5, eu: 42.5, cm: 27 },
    { us: 10, uk: 9.5, eu: 44, cm: 28 },
    { us: 11, uk: 10.5, eu: 45, cm: 29 },
    { us: 12, uk: 11.5, eu: 46, cm: 30 },
  ];
  return (
    <Shell eyebrow="Fit" title="Size guide">
      <p>Measure your foot in the evening, when it's at its largest. Stand on a sheet of paper, mark the heel and longest toe, then measure the distance in centimetres.</p>
      <div className="overflow-x-auto not-prose">
        <table className="w-full text-sm border border-ink/15 mt-4">
          <thead className="bg-haze"><tr className="text-left"><th className="p-3">US</th><th className="p-3">UK</th><th className="p-3">EU</th><th className="p-3">Foot length (cm)</th></tr></thead>
          <tbody className="divide-y divide-ink/10">
            {rows.map((r) => (
              <tr key={r.us}><td className="p-3 font-mono">{r.us}</td><td className="p-3 font-mono">{r.uk}</td><td className="p-3 font-mono">{r.eu}</td><td className="p-3 font-mono">{r.cm}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Brand fit can vary — runs-small or runs-large notes from verified reviewers are shown on each product page.</p>
    </Shell>
  );
}

export function FAQ() {
  const qas = [
    ["Do I need an account to order?", "No — guest checkout is available on every order. Creating an account just saves your addresses and order history for next time."],
    ["What's your return window?", "30 days from delivery for unworn pairs in original packaging. Size exchanges are free."],
    ["How long does delivery take?", "Standard delivery is 3–5 business days; express is 1–2 business days, shown at checkout by PIN code."],
    ["Which payment methods do you accept?", "UPI, credit/debit cards, net banking, and Cash on Delivery where available."],
  ];
  return (
    <Shell eyebrow="Support" title="Frequently asked questions">
      <div className="space-y-6">
        {qas.map(([q, a]) => (
          <div key={q}>
            <p className="text-ink font-semibold mb-1">{q}</p>
            <p>{a}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function Returns() {
  return (
    <Shell eyebrow="Support" title="Returns & exchanges">
      <p>Start a return from <Link to="/account/orders" className="stitch text-ink">your order history</Link> within 30 days of delivery. Choose a reason, add photos if the item arrived damaged, and we'll schedule a reverse pickup.</p>
      <p>Refunds are issued to your original payment method after quality check, typically within 5–7 business days. Store credit is available instantly as an alternative.</p>
    </Shell>
  );
}

export function About() {
  return (
    <Shell eyebrow="Company" title="About SoleSpace">
      <p>SoleSpace is a footwear storefront built to get out of your way — fast browsing, accurate sizing, and checkout that doesn't demand an account before you can buy.</p>
      <p>This build is a frontend implementation of the SoleSpace MERN specification: React, React Router and Tailwind CSS on the client, designed to sit in front of an Express/MongoDB API.</p>
    </Shell>
  );
}

export function Contact() {
  return (
    <Shell eyebrow="Get in touch" title="Contact us">
      <form className="not-prose space-y-4 max-w-md" onSubmit={(e) => e.preventDefault()}>
        <input required placeholder="Your name" className="input" />
        <input required type="email" placeholder="Email" className="input" />
        <textarea required placeholder="Message" rows={4} className="input" />
        <button className="btn-primary">Send message</button>
      </form>
    </Shell>
  );
}

export function Privacy() {
  return (
    <Shell eyebrow="Legal" title="Privacy policy">
      <p>We collect only the information needed to fulfil orders: contact details, delivery address, and order history. Marketing communication is opt-in and stored separately from transactional preferences.</p>
      <p>You can request a copy of your data or its deletion at any time from Account → Settings.</p>
    </Shell>
  );
}

export function Terms() {
  return (
    <Shell eyebrow="Legal" title="Terms of service">
      <p>By placing an order you agree to pay the listed price at checkout, inclusive of applicable taxes. Prices and totals are calculated server-side and cannot be altered by the client.</p>
      <p>Coupon codes are subject to minimum cart value, usage limits and exclusions listed at checkout.</p>
    </Shell>
  );
}

export function NotFound() {
  return (
    <div className="container-x py-32 text-center">
      <p className="font-display text-8xl mb-4">404</p>
      <p className="text-graphite mb-8">This page took a wrong turn on the trail.</p>
      <Link to="/" className="btn-primary">Back to home</Link>
    </div>
  );
}
