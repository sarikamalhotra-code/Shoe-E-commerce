import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function QuickViewModal({ product, onClose }) {
  const { addItem } = useCart();
  const { push } = useToast();
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState(null);

  useEffect(() => {
    if (!product) return;
    setColorIdx(0);
    setSize(null);
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [product]);

  if (!product) return null;
  const color = product.colors[colorIdx] || product.colors[0];
  const activeImage = color?.image || product.images?.[colorIdx % product.images.length] || product.images?.[0];

  const add = () => {
    if (!size) { push("Pick a size first."); return; }
    addItem(product, color.name, size, 1, activeImage);
    push(`Added ${product.name} · ${color.name} · US ${size}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto grid sm:grid-cols-2 shadow-2xl">
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white shadow-card flex items-center justify-center z-10 hover:bg-haze transition-colors">✕</button>
        <div className="aspect-square bg-haze overflow-hidden">
          <img src={activeImage} alt={`${product.name} - ${color.name}`} className="h-full w-full object-cover transition-all duration-300" />
        </div>
        <div className="p-6">
          <p className="text-[11px] uppercase tracking-wide text-graphite font-medium">{product.brand}</p>
          <h3 className="font-display font-bold text-2xl mt-0.5">{product.name}</h3>
          <div className="mt-2"><Rating value={product.rating} count={product.reviewCount} /></div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-bold text-2xl">{fmt(product.price)}</span>
            {product.mrp > product.price && <span className="text-graphite line-through text-sm">{fmt(product.mrp)}</span>}
          </div>
          <p className="text-sm text-graphite mt-3 leading-relaxed line-clamp-3">{product.description}</p>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide mb-2">Color — <span className="text-ink">{color.name}</span></p>
            <div className="flex gap-2">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => { setColorIdx(i); setSize(null); }}
                  className={`h-8 w-8 rounded-full border-2 transition-transform ${i === colorIdx ? "scale-110 border-track ring-2 ring-track/30" : "border-transparent ring-1 ring-ink/15 hover:scale-105"}`}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.name}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide mb-2">Size (US)</p>
            <div className="grid grid-cols-5 gap-2">
              {color.sizes.map((s) => (
                <button
                  key={s}
                  disabled={color.stock[s] === 0}
                  onClick={() => setSize(s)}
                  className={`h-10 text-sm rounded-md border ${size === s ? "bg-track text-white border-track" : "border-ink/20 hover:border-track"} disabled:opacity-30 disabled:cursor-not-allowed disabled:line-through`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={add} className="btn-primary flex-1">Add to cart</button>
            <Link to={`/product/${product.slug}`} onClick={onClose} className="btn-outline flex-1 !text-sm">Full details</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
