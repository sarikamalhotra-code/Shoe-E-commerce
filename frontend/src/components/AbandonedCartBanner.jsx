import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

// How long the cart has to sit untouched before we consider it "abandoned"
// enough to prompt for consent. A real backend job would use a much longer
// window (often hours) and would check this server-side, not client-side.
const IDLE_MS = 30_000;

export default function AbandonedCartBanner() {
  const cart = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!cart || cart.recoveryConsent !== null || cart.items.length === 0) {
      setVisible(false);
      return;
    }
    const id = setInterval(() => {
      if (Date.now() - cart.lastActivityAt >= IDLE_MS) setVisible(true);
    }, 3000);
    return () => clearInterval(id);
  }, [cart, cart?.lastActivityAt, cart?.recoveryConsent, cart?.items.length]);

  if (!cart || !visible) return null;

  const decide = (optIn) => {
    cart.setRecoveryOptIn(optIn);
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] w-[calc(100%-2rem)] max-w-md border border-ink bg-white shadow-stamp px-5 py-4">
      <p className="text-sm font-semibold mb-1">Still deciding?</p>
      <p className="text-xs text-graphite mb-3">
        We can email you a reminder if you leave items in your cart. We'll only send it with your OK.
      </p>
      <div className="flex gap-2">
        <button onClick={() => decide(true)} className="btn-primary flex-1 !py-2 !text-xs">Email me a reminder</button>
        <button onClick={() => decide(false)} className="btn-outline flex-1 !py-2 !text-xs">No thanks</button>
      </div>
    </div>
  );
}
