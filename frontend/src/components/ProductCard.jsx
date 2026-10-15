import { Link } from "react-router-dom";
import { useState } from "react";
import Rating from "./Rating";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const badgeCls = { new: "badge-new", bestseller: "badge-bestseller", sale: "badge-sale" };
const badgeLabel = { new: "New", bestseller: "Bestseller", sale: "Sale" };
const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function ProductCard({ product, onQuickView, layout = "grid" }) {
  const { isWishlisted, toggle } = useWishlist();
  const { addItem } = useCart();
  const { push } = useToast();
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState("");

  const color = product.colors[colorIdx] || product.colors[0];
  const activeImage = color?.image || product.images?.[colorIdx % product.images.length] || product.images?.[0];
  const wishlisted = isWishlisted(product.id);
  const outOfStock = color.sizes.every((s) => color.stock[s] === 0);

  const quickAdd = () => {
    const pickSize = size || color.sizes.find((s) => color.stock[s] > 0);
    if (!pickSize) { push("Out of stock"); return; }
    addItem(product, color.name, Number(pickSize), 1, activeImage);
    push(`Added ${product.name} (${color.name}) to cart`);
  };

  if (layout === "list") {
    return (
      <div className="card group relative flex flex-col sm:flex-row overflow-hidden border border-ink/10 p-3 sm:p-4 gap-4 bg-white hover:shadow-cardHover transition-shadow">
        <div className="relative aspect-square sm:w-56 shrink-0 overflow-hidden bg-haze rounded-lg">
          <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
            <img
              src={activeImage}
              alt={`${product.brand} ${product.name} - ${color.name}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </Link>
          {product.badges.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.badges.map((b) => (
                <span key={b} className={badgeCls[b]}>{badgeLabel[b]}</span>
              ))}
            </div>
          )}
          <button
            onClick={() => toggle(product.id)}
            aria-pressed={wishlisted}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center bg-white shadow-card hover:scale-105 transition-transform"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted ? "#FF6B1A" : "none"} stroke={wishlisted ? "#FF6B1A" : "#131A2C"} strokeWidth="2">
              <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4 6 3.5 8.5 3.2 10.7 4.6 12 7c1.3-2.4 3.5-3.8 6-3.5 4 .5 5.5 4.5 4 8.2C19.5 16.3 12 21 12 21z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-graphite font-medium">{product.brand}</p>
                <Link to={`/product/${product.slug}`}>
                  <h3 className="font-semibold text-lg text-ink hover:text-traction transition-colors">{product.name}</h3>
                </Link>
              </div>
              <PriceTagInline price={product.price} mrp={product.mrp} />
            </div>

            <div className="mt-1 flex items-center gap-3">
              <Rating value={product.rating} count={product.reviewCount} />
              <span className="text-xs text-graphite font-medium">· {product.category}</span>
            </div>

            <p className="text-sm text-graphite mt-2 line-clamp-2">{product.description}</p>

            {product.colors.length > 1 && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-graphite font-medium">Color: <span className="text-ink font-semibold">{color.name}</span></span>
                <div className="flex gap-1.5" role="group" aria-label="Colors">
                  {product.colors.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => { setColorIdx(i); setSize(""); }}
                      aria-label={c.name}
                      aria-pressed={i === colorIdx}
                      className={`h-4 w-4 rounded-full border transition-transform ${i === colorIdx ? "scale-125 ring-2 ring-offset-1 ring-track" : "border-ink/20 hover:scale-110"}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-ink/5">
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="border border-ink/20 rounded-md text-xs px-3 py-2 text-graphite focus:outline-none"
              aria-label="Select size"
            >
              <option value="">Select Size (US)</option>
              {color.sizes.map((s) => (
                <option key={s} value={s} disabled={color.stock[s] === 0}>
                  US {s} {color.stock[s] === 0 ? "(out of stock)" : ""}
                </option>
              ))}
            </select>
            <button
              onClick={() => onQuickView?.(product)}
              className="border border-ink/20 text-ink text-xs font-semibold px-4 py-2 rounded-md hover:border-track transition-colors"
            >
              Quick View
            </button>
            <button
              onClick={quickAdd}
              disabled={outOfStock}
              className="bg-track text-white text-xs font-semibold px-5 py-2 rounded-md hover:bg-track-light transition-colors disabled:opacity-40"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card group relative flex flex-col overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-haze">
        <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <img
            src={activeImage}
            alt={`${product.brand} ${product.name} - ${color.name}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {product.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badges.map((b) => (
              <span key={b} className={badgeCls[b]}>{badgeLabel[b]}</span>
            ))}
          </div>
        )}

        <button
          onClick={() => toggle(product.id)}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center bg-white shadow-card hover:scale-105 transition-transform"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? "#FF6B1A" : "none"} stroke={wishlisted ? "#FF6B1A" : "#131A2C"} strokeWidth="2">
            <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4 6 3.5 8.5 3.2 10.7 4.6 12 7c1.3-2.4 3.5-3.8 6-3.5 4 .5 5.5 4.5 4 8.2C19.5 16.3 12 21 12 21z" />
          </svg>
        </button>

        {outOfStock && (
          <div className="absolute inset-x-0 bottom-0 bg-ink/85 text-white text-center text-xs font-semibold py-1.5">
            Out of stock
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        {product.colors.length > 1 && (
          <div className="flex items-center justify-between gap-1.5 mb-2">
            <div className="flex gap-1.5" role="group" aria-label="Colors">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => { setColorIdx(i); setSize(""); }}
                  aria-label={c.name}
                  aria-pressed={i === colorIdx}
                  title={c.name}
                  className={`h-3.5 w-3.5 rounded-full border transition-transform ${i === colorIdx ? "scale-125 ring-2 ring-offset-1 ring-track" : "border-ink/20 hover:scale-110"}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <span className="text-[10px] text-graphite font-medium truncate max-w-[110px]">{color.name}</span>
          </div>
        )}

        <Link to={`/product/${product.slug}`}>
          <p className="text-[11px] uppercase tracking-wide text-graphite font-medium">{product.brand}</p>
          <h3 className="font-semibold leading-snug text-[15px] mt-0.5">{product.name}</h3>
        </Link>
        <div className="mt-1"><Rating value={product.rating} count={product.reviewCount} /></div>
        <div className="mt-1.5"><PriceTagInline price={product.price} mrp={product.mrp} /></div>

        <div className="mt-3">
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full border border-ink/15 rounded-md text-xs px-2 py-2 text-graphite"
            aria-label="Select size"
          >
            <option value="">Size — Variant</option>
            {color.sizes.map((s) => (
              <option key={s} value={s} disabled={color.stock[s] === 0}>
                US {s} {color.stock[s] === 0 ? "(out of stock)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-2.5 flex gap-2">
          <button
            onClick={() => onQuickView?.(product)}
            className="flex-1 border border-ink/20 text-ink text-xs font-semibold py-2.5 rounded-md hover:border-track transition-colors"
          >
            Quick View
          </button>
          <button
            onClick={quickAdd}
            disabled={outOfStock}
            className="flex-1 bg-track text-white text-xs font-semibold py-2.5 rounded-md hover:bg-track-light transition-colors disabled:opacity-40"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function PriceTagInline({ price, mrp }) {
  const hasDiscount = mrp && mrp > price;
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className="font-bold text-ink">{fmt(price)}</span>
      {hasDiscount && <span className="text-graphite line-through text-xs">{fmt(mrp)}</span>}
    </span>
  );
}
