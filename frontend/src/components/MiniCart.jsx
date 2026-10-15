import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function MiniCart({ onNavigate }) {
  const cart = useCart();
  const preview = cart.items.slice(0, 4);
  const extraCount = cart.items.length - preview.length;

  return (
    <div className="bg-white rounded-xl shadow-cardHover border border-ink/5 w-80 py-3" role="dialog" aria-label="Cart preview">
      {cart.items.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-graphite mb-3">Your cart is empty.</p>
          <Link to="/shop" onClick={onNavigate} className="btn-outline !py-2 !text-xs inline-block">Shop shoes</Link>
        </div>
      ) : (
        <>
          <div className="max-h-80 overflow-y-auto divide-y divide-ink/8 px-4">
            {preview.map((item) => (
              <div key={item.key} className="py-3 flex gap-3">
                <div className="h-14 w-14 shrink-0 bg-haze overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{item.name}</p>
                  <p className="text-xs text-graphite">{item.color} · US {item.size} · Qty {item.qty}</p>
                  {!item.isAvailable && <p className="text-xs text-cone mt-0.5">Out of stock</p>}
                </div>
                <span className="text-xs font-bold text-ink shrink-0">{fmt(item.currentPrice * item.qty)}</span>
              </div>
            ))}
          </div>
          {extraCount > 0 && (
            <p className="px-4 pt-2 text-xs text-graphite">+{extraCount} more item{extraCount > 1 ? "s" : ""}</p>
          )}
          <div className="px-4 pt-3 mt-1 border-t border-ink/8">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-graphite">Subtotal</span>
              <span className="font-bold text-ink">{fmt(cart.subtotal)}</span>
            </div>
            <div className="flex gap-2">
              <Link to="/cart" onClick={onNavigate} className="btn-outline flex-1 !py-2 !text-xs text-center">View cart</Link>
              <Link to="/checkout" onClick={onNavigate} className="btn-primary flex-1 !py-2 !text-xs text-center">Checkout</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
