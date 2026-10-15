import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import Rating from "../components/Rating";

const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function Wishlist() {
  const { items, remove, moveToCart, getShareUrl } = useWishlist();
  const { push } = useToast();

  const onShare = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      push("Wishlist link copied — share it with anyone.");
    } catch {
      push(url);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <p className="font-display text-3xl mb-3">Your wishlist is empty</p>
        <p className="text-graphite mb-8">Save pairs you're eyeing — they'll sync here across sessions.</p>
        <Link to="/shop" className="btn-primary">Browse shoes</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <h1 className="font-display text-4xl">Wishlist</h1>
        <button onClick={onShare} className="btn-outline !text-xs !py-2">Share wishlist</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {items.map((entry) => (
          <WishlistItemRow key={entry.productId} entry={entry} remove={remove} moveToCart={moveToCart} push={push} />
        ))}
      </div>
    </div>
  );
}

function WishlistItemRow({ entry, remove, moveToCart, push }) {
  const { product } = entry;
  const [colorIdx, setColorIdx] = useState(0);
  const color = product.colors[colorIdx] || product.colors[0];
  const activeImage = color?.image || product.images?.[colorIdx % product.images.length] || product.images?.[0];
  const [size, setSize] = useState(() => color.sizes.find((s) => color.stock[s] > 0) ?? null);

  const onColorChange = (i) => {
    setColorIdx(i);
    const nextColor = product.colors[i] || product.colors[0];
    setSize(nextColor.sizes.find((s) => nextColor.stock[s] > 0) ?? null);
  };

  const onMove = () => {
    if (!size) { push("Pick a size first."); return; }
    const res = moveToCart(product.id, color.name, size);
    if (res.ok) push(`Moved ${product.name} (${color.name}) to cart`);
    else push(res.message);
  };

  return (
    <div className="border border-ink/15 p-4 flex gap-4 bg-white rounded-xl">
      <Link to={`/product/${product.slug}`} className="h-24 w-24 shrink-0 bg-haze overflow-hidden rounded-lg">
        <img src={activeImage} alt={`${product.name} - ${color.name}`} className="h-full w-full object-cover transition-all duration-300" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div>
            <p className="label-eyebrow">{product.brand}</p>
            <Link to={`/product/${product.slug}`} className="font-semibold">{product.name}</Link>
            <div className="mt-1"><Rating value={product.rating} count={product.reviewCount} /></div>
          </div>
          <button onClick={() => remove(product.id)} className="text-graphite hover:text-cone text-sm shrink-0" aria-label="Remove from wishlist">✕</button>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="font-mono font-bold text-sm">{fmt(entry.currentPrice)}</span>
          {entry.priceDropped && <span className="text-xs font-semibold text-track">Price dropped {fmt(Math.abs(entry.priceDelta))}</span>}
          {entry.priceRose && <span className="text-xs font-semibold text-cone">Price up {fmt(entry.priceDelta)}</span>}
        </div>
        <p className={`text-xs font-semibold mt-1 ${entry.inStock ? "text-track" : "text-cone"}`}>
          {entry.inStock ? "In stock" : "Out of stock"}
        </p>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-graphite">Color: <span className="text-ink font-medium">{color.name}</span></span>
          <div className="flex gap-1.5">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => onColorChange(i)}
                aria-label={c.name}
                aria-pressed={i === colorIdx}
                title={c.name}
                className={`h-4 w-4 rounded-full border transition-transform ${i === colorIdx ? "scale-125 ring-2 ring-offset-1 ring-track" : "border-ink/20 hover:scale-110"}`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
        <select
          value={size ?? ""}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-full mt-2 border border-ink/15 rounded-md text-xs px-2 py-2 text-graphite"
          aria-label="Select size"
        >
          <option value="" disabled>Size — US</option>
          {color.sizes.map((s) => (
            <option key={s} value={s} disabled={color.stock[s] === 0}>
              US {s} {color.stock[s] === 0 ? "(out of stock)" : ""}
            </option>
          ))}
        </select>

        <button onClick={onMove} className="btn-primary w-full mt-3 !py-2 !text-xs">Move to cart</button>
      </div>
    </div>
  );
}
