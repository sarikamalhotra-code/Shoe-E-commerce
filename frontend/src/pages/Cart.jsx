import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function Cart() {
  const cart = useCart();
  const { push } = useToast();
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const onApply = (e) => {
    e.preventDefault();
    const res = cart.applyCoupon(code);
    push(res.ok ? `Coupon applied: ${cart.coupon?.label ?? ""}` : res.message);
  };

  const onSaveForLater = (item) => {
    cart.saveForLater(item.key);
    push(`Saved ${item.name} for later`);
  };

  const onMoveToCart = (item) => {
    cart.moveToCart(item.key);
    push(`Moved ${item.name} to cart`);
  };

  if (cart.items.length === 0 && cart.savedItems.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <p className="font-display text-3xl mb-3">Your cart is empty</p>
        <p className="text-graphite mb-8">Nothing here yet — go find your next pair.</p>
        <Link to="/shop" className="btn-primary">Shop shoes</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-4xl mb-8">Your Cart</h1>

      {cart.hasUnavailableItems && (
        <div className="mb-6 border border-cone/40 bg-cone/10 text-ink text-sm px-4 py-3">
          Some items in your cart have changed — check the notes below before checking out.
        </div>
      )}

      {cart.items.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 divide-y divide-ink/10 border-y border-ink/10">
            {cart.items.map((item) => (
              <div key={item.key} className="py-5 flex gap-4">
                <Link to={`/product/${item.slug}`} className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 bg-haze overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="label-eyebrow">{item.brand}</p>
                      <Link to={`/product/${item.slug}`} className="font-semibold">{item.name}</Link>
                      <p className="text-sm text-graphite mt-1">{item.color} · US {item.size}</p>
                      <p className="text-[11px] text-graphite/70 font-mono mt-0.5">SKU {item.sku}</p>
                    </div>
                    <button onClick={() => cart.removeItem(item.key)} className="text-graphite hover:text-cone text-sm shrink-0" aria-label="Remove item">✕</button>
                  </div>

                  {!item.isAvailable && (
                    <p className="text-xs text-cone font-semibold mt-2">This size is currently out of stock.</p>
                  )}
                  {item.isAvailable && item.exceedsStock && (
                    <p className="text-xs text-cone font-semibold mt-2">Only {item.availableStock} left — quantity was adjusted.</p>
                  )}
                  {item.isAvailable && !item.exceedsStock && item.availableStock <= 3 && (
                    <p className="text-xs text-graphite mt-2">Only {item.availableStock} left in stock.</p>
                  )}
                  {item.priceChanged && (
                    <p className={`text-xs mt-2 font-semibold ${item.currentPrice < item.price ? "text-track" : "text-cone"}`}>
                      Price {item.currentPrice < item.price ? "dropped" : "increased"} from {fmt(item.price)} to {fmt(item.currentPrice)}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-center border border-ink/20">
                      <button onClick={() => cart.updateQty(item.key, item.qty - 1)} className="w-8 h-8 font-mono" aria-label="Decrease quantity">−</button>
                      <span className="w-8 text-center font-mono text-sm">{item.qty}</span>
                      <button
                        onClick={() => cart.updateQty(item.key, item.qty + 1)}
                        disabled={item.isAvailable && item.qty >= item.availableStock}
                        className="w-8 h-8 font-mono disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-mono font-bold">{fmt(item.currentPrice * item.qty)}</span>
                  </div>
                  <button onClick={() => onSaveForLater(item)} className="text-xs stitch mt-2 text-graphite hover:text-ink">
                    Save for later
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="border border-ink/15 p-6">
              <p className="font-display text-xl mb-4">Order Summary</p>
              <form onSubmit={onApply} className="flex gap-2 mb-5">
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" className="input" />
                <button className="btn-outline shrink-0 !px-4 text-xs">Apply</button>
              </form>
              {cart.coupon && (
                <div className="flex justify-between items-center mb-4 stamp bg-traction/30 border-ink w-full">
                  <span>{cart.coupon.label}</span>
                  <button onClick={cart.removeCoupon} aria-label="Remove coupon">✕</button>
                </div>
              )}
              <dl className="space-y-2 text-sm font-mono">
                <div className="flex justify-between"><dt className="text-graphite">Subtotal</dt><dd>{fmt(cart.subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-graphite">Discount</dt><dd className="text-cone">−{fmt(cart.discount)}</dd></div>
                <div className="flex justify-between"><dt className="text-graphite">Shipping</dt><dd>{cart.shipping === 0 ? "Free" : fmt(cart.shipping)}</dd></div>
                <div className="flex justify-between"><dt className="text-graphite">Est. GST (included)</dt><dd className="text-graphite">{fmt(cart.estimatedTax)}</dd></div>
                <div className="flex justify-between pt-3 border-t border-ink/15 text-base font-bold"><dt>Total</dt><dd>{fmt(cart.total)}</dd></div>
              </dl>
              <button
                onClick={() => navigate("/checkout")}
                disabled={cart.hasUnavailableItems}
                className="btn-primary w-full mt-6 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Checkout
              </button>
              {cart.hasUnavailableItems && (
                <p className="text-xs text-cone text-center mt-2">Resolve out-of-stock items above to continue.</p>
              )}
              <p className="text-xs text-graphite text-center mt-3">Guest checkout available — no account required.</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-graphite mb-10">Your cart is empty — items saved for later are below.</p>
      )}

      {cart.savedItems.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl mb-6">Saved for later ({cart.savedItems.length})</h2>
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {cart.savedItems.map((item) => (
              <div key={item.key} className="py-5 flex gap-4">
                <Link to={`/product/${item.slug}`} className="h-20 w-20 shrink-0 bg-haze overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="label-eyebrow">{item.brand}</p>
                    <Link to={`/product/${item.slug}`} className="font-semibold">{item.name}</Link>
                    <p className="text-sm text-graphite mt-1">{item.color} · US {item.size}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold">{fmt(item.price)}</span>
                    <button onClick={() => onMoveToCart(item)} className="btn-outline !py-2 !text-xs">Move to cart</button>
                    <button onClick={() => cart.removeSaved(item.key)} className="text-graphite hover:text-cone text-sm" aria-label="Remove saved item">✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
