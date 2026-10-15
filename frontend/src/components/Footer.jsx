import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const trust = [
  { icon: "shield", title: "Secure Payment", desc: "UPI, cards & COD" },
  { icon: "return", title: "30-Day Returns", desc: "Free size exchanges" },
  { icon: "check", title: "Authentic Products", desc: "Sourced from brands" },
  { icon: "truck", title: "Free Delivery Over ₹999", desc: "3–5 business days" },
];

const icons = {
  shield: <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />,
  return: <path d="M3 12a9 9 0 109-9M3 12V4M3 12h8" />,
  check: <path d="M20 6L9 17l-5-5" />,
  truck: <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7zM6.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />,
};

export default function Footer() {
  const { push } = useToast();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    push("Subscribed successfully! Use code WELCOME10 for 10% off.");
    setEmail("");
  };

  return (
    <footer className="mt-8">
      <div className="bg-[#778899] mb-1">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-6 py-10">
          {trust.map((t) => (
            <div key={t.title} className="flex items-center gap-3">
              <span className="h-11 w-11 rounded-full bg-white flex items-center justify-center shrink-0 shadow-card text-track">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icons[t.icon]}</svg>
              </span>
              <div>
                <p className="text-sm font-bold leading-tight text-white">{t.title}</p>
                <p className="text-xs text-white/70">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-track text-white">
        <div className="container-x py-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <span className="font-display font-extrabold text-2xl">
              <span className="text-white">SOLE</span><span className="text-traction">SPACE</span>
            </span>
            <p className="text-sm text-white/60 mt-4 max-w-sm">Subscribe to get offers &amp; updates on new drops, restocks and exclusive deals.</p>
            <form className="flex mt-4 max-w-sm" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email…" 
                className="flex-1 rounded-l-md px-4 py-2.5 text-sm text-ink outline-none" 
              />
              <button className="bg-traction px-5 rounded-r-md font-semibold text-sm hover:bg-[#e85d0f] transition-colors">Sign up</button>
            </form>
            <div className="flex gap-3 mt-5">
              {["Instagram","Facebook","Twitter","Youtube"].map((s) => (
                <span key={s} className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-xs hover:bg-white/20 transition-colors cursor-pointer" title={s}>{s[0]}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-traction text-xs font-bold uppercase tracking-wide mb-4">About SoleSpace</p>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/returns" className="hover:text-white">Returns Policy</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-traction text-xs font-bold uppercase tracking-wide mb-4">Shop</p>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link to="/shop?category=running" className="hover:text-white">Running</Link></li>
              <li><Link to="/shop?category=sneakers" className="hover:text-white">Sneakers</Link></li>
              <li><Link to="/shop?category=basketball" className="hover:text-white">Basketball</Link></li>
              <li><Link to="/shop?category=boots" className="hover:text-white">Boots</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-traction text-xs font-bold uppercase tracking-wide mb-4">Legal</p>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/returns" className="hover:text-white">Shipping &amp; Returns</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="container-x py-5 text-center text-xs text-white/40">
            © {new Date().getFullYear()} SoleSpace.
          </div>
        </div>
      </div>
    </footer>
  );
}
