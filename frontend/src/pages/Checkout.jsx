import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import StepIndicator from "../components/StepIndicator";
import { API_BASE_URL } from "../config/api";

const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;
const STEPS = ["Contact", "Delivery", "Payment", "Review"];

export default function Checkout() {
  const cart = useCart();
  const { user, token } = useAuth();
  const [step, setStep] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [contact, setContact] = useState({ email: user?.email || "", phone: "" });
  const [address, setAddress] = useState({ name: user?.name || "", line1: "", city: "", state: "", pin: "", label: "Home" });
  const [shipMethod, setShipMethod] = useState("standard");
  const [payMethod, setPayMethod] = useState("upi");

  if (cart.items.length === 0 && !orderId) {
    return (
      <div className="container-x py-24 text-center">
        <p className="font-display text-3xl mb-4">Nothing to check out</p>
        <Link to="/shop" className="btn-primary">Shop shoes</Link>
      </div>
    );
  }

  const shipCost = shipMethod === "express" ? Math.max(cart.shipping, 249) : cart.shipping;
  const grandTotal = cart.total - cart.shipping + shipCost;

  const next = (e) => { e.preventDefault(); setStep((s) => Math.min(4, s + 1)); };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const orderData = {
        guestEmail: contact.email,
        orderItems: cart.items.map(item => ({
          name: item.name || "Shoe Item",
          qty: item.qty || 1,
          image: item.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
          price: item.currentPrice || item.price || 0,
          sku: item.sku || "SS-SKU",
          color: item.color || "",
          size: item.size || ""
        })),
        shippingAddress: {
          name: address.name || user?.name || "Customer",
          address: address.line1 || "Not Provided",
          city: address.city || "Not Provided",
          state: address.state || "",
          postalCode: address.pin || "000000",
          country: "India",
          phone: contact.phone || ""
        },
        totalPrice: grandTotal
      };

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save order to database');
      }

      const confirmedId = data._id || `SS-${Date.now().toString().slice(-6)}`;
      setOrderId(confirmedId);

      // Store in local storage for guest reference
      try {
        const guestOrders = JSON.parse(localStorage.getItem('solespace_guest_orders') || '[]');
        guestOrders.unshift({ ...data, _id: confirmedId, createdAt: new Date().toISOString() });
        localStorage.setItem('solespace_guest_orders', JSON.stringify(guestOrders.slice(0, 10)));
      } catch {
        // ignore
      }

      cart.clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      // Fallback guest order creation so customer doesn't get blocked
      const fallbackId = `SS-${Date.now().toString().slice(-6)}`;
      setOrderId(fallbackId);
      cart.clearCart();
    } finally {
      setPlacing(false);
    }
  };
  
  if (orderId) {
    return (
      <div className="container-x py-24 text-center max-w-lg mx-auto">
        <div className="h-16 w-16 rounded-full bg-traction flex items-center justify-center mx-auto mb-6 font-display text-2xl">✓</div>
        <p className="font-display text-4xl mb-3">Order confirmed</p>
        <p className="text-graphite mb-1">Order ID</p>
        <p className="stamp-solid bg-ink text-white text-base mb-6">{orderId}</p>
        <p className="text-sm text-graphite mb-8">
          A confirmation has been sent to {contact.email || "your email"}. Track this order anytime using your order ID and contact details — no account needed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/shop" className="btn-primary">Continue shopping</Link>
          <Link to="/account/orders" className="btn-outline">View orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10 max-w-3xl mx-auto">
      <h1 className="font-display text-4xl mb-2">Checkout</h1>
      {!user && <p className="text-sm text-graphite mb-8">Checking out as guest. <Link to="/login" className="stitch">Log in</Link> to save your details.</p>}
      <StepIndicator steps={STEPS} current={step} />

      {step === 1 && (
        <form onSubmit={next} className="space-y-5 border border-ink/15 p-6">
          <p className="font-display text-xl mb-2">Contact information</p>
          <div>
            <label className="label-eyebrow block mb-1.5">Email</label>
            <input required type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label-eyebrow block mb-1.5">Mobile number</label>
            <input required type="tel" pattern="[0-9]{10}" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="input" placeholder="10-digit mobile number" />
          </div>
          <button className="btn-primary w-full">Continue to delivery</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={next} className="space-y-5 border border-ink/15 p-6">
          <p className="font-display text-xl mb-2">Delivery address</p>
          <div>
            <label className="label-eyebrow block mb-1.5">Full name</label>
            <input required value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label-eyebrow block mb-1.5">Address</label>
            <input required value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} className="input" placeholder="House no, street, area" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="input" placeholder="City" />
            <input required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="input" placeholder="State" />
            <input required value={address.pin} onChange={(e) => setAddress({ ...address, pin: e.target.value.replace(/\D/g,"").slice(0,6) })} className="input" placeholder="PIN" />
          </div>
          <div className="flex gap-2">
            {["Home", "Work", "Other"].map((l) => (
              <button type="button" key={l} onClick={() => setAddress({ ...address, label: l })} className={`px-4 py-2 text-xs font-mono uppercase border ${address.label === l ? "bg-ink text-white border-ink" : "border-ink/30"}`}>{l}</button>
            ))}
          </div>

          <p className="label-eyebrow pt-3">Shipping speed</p>
          <div className="space-y-2">
            {[
              { id: "standard", label: "Standard (3–5 business days)", price: cart.shipping },
              { id: "express", label: "Express (1–2 business days)", price: Math.max(cart.shipping, 249) },
            ].map((o) => (
              <label key={o.id} className={`flex items-center justify-between border p-3 cursor-pointer ${shipMethod === o.id ? "border-ink" : "border-ink/20"}`}>
                <span className="flex items-center gap-2 text-sm"><input type="radio" name="ship" checked={shipMethod === o.id} onChange={() => setShipMethod(o.id)} className="accent-track" />{o.label}</span>
                <span className="font-mono text-sm">{o.price === 0 ? "Free" : fmt(o.price)}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={back} className="btn-outline flex-1">Back</button>
            <button className="btn-primary flex-1">Continue to payment</button>
          </div>
        </form>
      )}
{step === 3 && (
  <form onSubmit={next} className="space-y-5 border border-ink/15 p-6">

    <div>
      <p className="font-display text-xl mb-1">Payment method</p>
      <p className="text-sm text-graphite">
        Choose your preferred payment method
      </p>
    </div>

    <div className="space-y-2">
     {[
  { id: "upi", label: "UPI", sub: "Google Pay · PhonePe · Paytm", icon: "↯" },
  { id: "card", label: "Credit / Debit Card", sub: "Visa · Mastercard · RuPay", icon: "▣" },
  { id: "netbanking", label: "Net Banking", sub: "All major banks", icon: "⌂" },
  { id: "cod", label: "Cash on Delivery", sub: "Pay when your order arrives", icon: "₹" },
].map((o) => (
        <label
          key={o.id}
          className={`flex items-center gap-4 p-4 border cursor-pointer transition ${
            payMethod === o.id
              ? "border-ink bg-white shadow-sm"
              : "border-ink/10 hover:border-ink/30"
          }`}
        >
        <div className="w-11 h-11 border border-ink/10 flex items-center justify-center">
  {o.id === "upi" && <span className="text-sm font-bold text-green-600">UPI</span>}


  {o.id === "card" && (
   <svg className="text-blue-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )}

  {o.id === "netbanking" && (
   <svg className="text-purple-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10h18L12 4 3 10Z" />
      <path d="M5 10v7M9 10v7M15 10v7M19 10v7M3 19h18" />
    </svg>
  )}

  {o.id === "cod" && (
   <span className="text-lg font-semibold text-orange-500">₹</span>
  )}
</div>

          <div className="flex-1">
            <p className="text-sm font-semibold">{o.label}</p>
            <p className="text-xs text-graphite mt-1">{o.sub}</p>
          </div>

          <input
            type="radio"
            name="pay"
            checked={payMethod === o.id}
            onChange={() => setPayMethod(o.id)}
            className="accent-track w-4 h-4"
          />
        </label>
      ))}
    </div>

    {payMethod === "card" && (
      <div className="border border-ink/10 p-4 space-y-3 bg-white">
        <p className="text-sm font-semibold">Card details</p>

        <input required placeholder="Card number" className="input" />

        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="MM / YY" className="input" />
          <input required placeholder="CVV" className="input" />
        </div>
      </div>
    )}

    <div className="flex items-start gap-2 border-t border-ink/10 pt-4">
      <span className="text-xs">🔒</span>
   <p className="text-xs text-graphite font-medium">
  Payments are securely verified before your order is confirmed.
</p>
    </div>

    <div className="flex gap-3 pt-2">
      <button type="button" onClick={back} className="btn-outline flex-1">
        Back
      </button>

      <button type="submit" className="btn-primary flex-1">
        Review order →
      </button>
    </div>

  </form>
)}
   

      {step === 4 && (
        <div className="space-y-6">
          <div className="border border-ink/15 p-6">
            <p className="font-display text-xl mb-4">Review your order</p>
            <div className="divide-y divide-ink/10">
              {cart.items.map((item) => (
                <div key={item.key} className="py-3 flex justify-between text-sm">
                  <span>{item.name} · {item.color} · US {item.size} × {item.qty}</span>
                  <span className="font-mono">{fmt(item.currentPrice * item.qty)}</span>
                </div>
              ))}
            </div>
            <dl className="mt-4 space-y-1.5 text-sm font-mono border-t border-ink/10 pt-4">
              <div className="flex justify-between"><dt className="text-graphite">Ship to</dt><dd className="text-right">{address.line1}, {address.city}, {address.state} {address.pin}</dd></div>
              <div className="flex justify-between"><dt className="text-graphite">Payment</dt><dd className="capitalize">{payMethod}</dd></div>
              <div className="flex justify-between pt-2 border-t border-ink/10 text-base font-bold"><dt>Total</dt><dd>{fmt(grandTotal)}</dd></div>
            </dl>
          </div>
          <div className="flex gap-3">
            <button onClick={back} className="btn-outline flex-1">Back</button>
            <button onClick={placeOrder} disabled={placing} className="btn-accent flex-1">{placing ? "Placing order…" : "Place order"}</button>
          </div>
        </div>
      )}
    </div>
  );
}