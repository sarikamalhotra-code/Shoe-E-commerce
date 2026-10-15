import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProductBySlug, getRelated } from "../data/products";
import PriceTag from "../components/PriceTag";
import Rating from "../components/Rating";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";

const TABS = ["Description", "Materials & Care", "Reviews"];

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = getProductBySlug(slug);
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { push } = useToast();
  const { track } = useRecentlyViewed();

  useEffect(() => {
    if (product) track(product.id);
  }, [product, track]);

  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState(0);
  const [pin, setPin] = useState("");
  const [pinResult, setPinResult] = useState(null);

  if (!product) {
    return (
      <div className="container-x py-24 text-center">
        <p className="font-display text-3xl mb-4">Product not found</p>
        <Link to="/shop" className="btn-primary">Back to shop</Link>
      </div>
    );
  }

  const color = product.colors[colorIdx] || product.colors[0];
  const colorImage = color?.image || product.images?.[colorIdx % product.images.length] || product.images?.[0];
  
  // Gallery shows selected color variant first, followed by other angle views
  const galleryImages = [
    colorImage,
    ...product.images.filter((im) => im !== colorImage)
  ];

  const inStock = size && color.stock[size] > 0;
  const lowStock = size && color.stock[size] > 0 && color.stock[size] <= 3;

  const handleAdd = (buyNow) => {
    if (!size) { push("Pick a size first."); return; }
    if (!inStock) { push("That size is out of stock."); return; }
    addItem(product, color.name, size, 1, colorImage);
    push(`Added ${product.name} · ${color.name} · US ${size}`);
    if (buyNow) navigate("/cart");
  };

  const checkPin = (e) => {
  e.preventDefault();
  if (pin.length !== 6) {
    setPinResult({ ok: false, msg: "Enter a valid 6-digit PIN code." });
    return;
  }
  setPinResult({
    ok: true,
    msg: `Delivery available to ${pin}. Estimated 3–5 business days.`,
  });
};

const handleShare = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name}`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      push("Product link copied to clipboard!");
    }
  } catch (error) {
    console.log(error);
  }
};

const related = getRelated(product);

  return (
    <div className="container-x py-8">
      <nav className="text-xs text-graphite font-medium mb-6 flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-ink">Home</Link> /
        <Link to={`/shop?category=${product.category}`} className="hover:text-ink capitalize">{product.category}</Link> /
        <span className="text-ink font-semibold">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-haze overflow-hidden mb-3 rounded-xl border border-ink/5">
            <img 
              src={galleryImages[activeImg] || colorImage} 
              alt={`${product.name} - ${color.name} view ${activeImg + 1}`} 
              className="h-full w-full object-cover transition-all duration-300" 
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {galleryImages.map((im, i) => (
              <button 
                key={im + i} 
                onClick={() => setActiveImg(i)} 
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${i === activeImg ? "border-ink scale-105 shadow-sm" : "border-transparent opacity-75 hover:opacity-100"}`}
              >
                <img src={im} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          {product.badges.length > 0 && (
            <div className="flex gap-2 mb-3">
              {product.badges.map((b) => <span key={b} className="stamp">{b}</span>)}
            </div>
          )}
          <p className="label-eyebrow">{product.brand}</p>
          <h1 className="font-display text-4xl mt-1">{product.name}</h1>
          <div className="mt-2"><Rating value={product.rating} count={product.reviewCount} size="lg" /></div>
          <div className="mt-4"><PriceTag price={product.price} mrp={product.mrp} size="lg" /></div>
          <p className="text-xs text-graphite mt-1">MRP inclusive of all taxes.</p>

          <div className="mt-6">
            <p className="label-eyebrow mb-2">Color — <span className="text-ink font-semibold">{color.name}</span></p>
            <div className="flex gap-2.5">
              {product.colors.map((c, i) => (
                <button 
                  key={c.name} 
                  onClick={() => { setColorIdx(i); setSize(null); setActiveImg(0); }} 
                  className={`h-10 w-10 rounded-full border-2 transition-transform ${i === colorIdx ? "scale-110 border-ink ring-2 ring-ink/30" : "border-transparent ring-1 ring-ink/20 hover:scale-105"}`} 
                  style={{ backgroundColor: c.hex }} 
                  aria-label={c.name}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="label-eyebrow">Size (US) <Link to="/size-guide" className="stitch normal-case ml-2 text-ink">Size guide</Link></p>
              {lowStock && <span className="text-cone text-xs font-semibold">Only {color.stock[size]} left</span>}
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {color.sizes.map((s) => {
                const disabled = color.stock[s] === 0;
                return (
                  <button
                    key={s}
                    disabled={disabled}
                    onClick={() => setSize(s)}
                    className={`h-11 font-semibold text-sm border relative rounded-md transition ${size === s ? "bg-ink text-white border-ink shadow-sm" : "border-ink/20 hover:border-ink"} ${disabled ? "opacity-30 cursor-not-allowed line-through" : ""}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

       <div className="mt-7 flex flex-col sm:flex-row gap-3">
  <button onClick={() => handleAdd(false)} className="btn-primary flex-1">
    Add to cart
  </button>

  <button onClick={() => handleAdd(true)} className="btn-accent flex-1">
    Buy now
  </button>

  <button
    onClick={() => toggle(product.id)}
    aria-pressed={isWishlisted(product.id)}
    className="btn-outline !px-4"
    aria-label="Toggle wishlist"
  >
    {isWishlisted(product.id) ? "♥" : "♡"}
  </button>

  <button
    onClick={handleShare}
    className="btn-outline !px-4"
  >
    Share
  </button>
</div>



          <form onSubmit={checkPin} className="mt-8 border border-ink/15 p-4">
            <p className="label-eyebrow mb-2">Check delivery</p>
            <div className="flex gap-2">
              <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="PIN code" className="input" />
              <button className="btn-outline shrink-0 !px-5">Check</button>
            </div>
            {pinResult && <p className={`mt-2 text-sm ${pinResult.ok ? "text-track" : "text-cone"}`}>{pinResult.msg}</p>}
            <p className="text-xs text-graphite mt-2">Free returns &amp; exchanges within 30 days.</p>
          </form>

          <div className="mt-8 flex gap-2 border-b border-ink/10">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} className={`px-3 py-2.5 text-sm font-medium ${tab === i ? "border-b-2 border-ink text-ink" : "text-graphite"}`}>{t}</button>
            ))}
          </div>
          <div className="py-5 text-sm text-graphite leading-relaxed">
            {tab === 0 && <p>{product.description}</p>}
            {tab === 1 && (
              <ul className="space-y-1.5">
                <li><strong className="text-ink">Upper:</strong> {product.material}</li>
                <li><strong className="text-ink">Activity:</strong> {product.activity}</li>
                <li><strong className="text-ink">Care:</strong> Wipe with a damp cloth. Air dry away from direct heat.</li>
              </ul>
            )}
            {tab === 2 && (
  <div>
    <div className="flex items-center gap-3 mb-6">
      <Rating value={product.rating} size="lg" />
      <span className="font-semibold text-sm text-ink">
        {product.rating} out of 5 · {product.reviewCount} reviews
      </span>
    </div>

    <h4 className="font-semibold mb-4">
      Ratings Breakdown
    </h4>

    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="w-10 text-sm">5★</span>
        <div className="flex-1 h-2 bg-gray-200 rounded">
          <div className="h-2 bg-yellow-400 rounded w-[78%]"></div>
        </div>
        <span className="text-xs w-10">78%</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-10 text-sm">4★</span>
        <div className="flex-1 h-2 bg-gray-200 rounded">
          <div className="h-2 bg-yellow-400 rounded w-[15%]"></div>
        </div>
        <span className="text-xs w-10">15%</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-10 text-sm">3★</span>
        <div className="flex-1 h-2 bg-gray-200 rounded">
          <div className="h-2 bg-yellow-400 rounded w-[4%]"></div>
        </div>
        <span className="text-xs w-10">4%</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-10 text-sm">2★</span>
        <div className="flex-1 h-2 bg-gray-200 rounded">
          <div className="h-2 bg-yellow-400 rounded w-[2%]"></div>
        </div>
        <span className="text-xs w-10">2%</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-10 text-sm">1★</span>
        <div className="flex-1 h-2 bg-gray-200 rounded">
          <div className="h-2 bg-yellow-400 rounded w-[1%]"></div>
        </div>
        <span className="text-xs w-10">1%</span>
      </div>
    </div>

    <div className="mt-8 border-t border-ink/10 pt-6">
      <h4 className="font-semibold mb-4 text-ink">Customer Reviews ({product.reviewCount})</h4>
      <div className="space-y-4">
        {[
          {
            name: "Rohit S.",
            rating: 5,
            date: "2 weeks ago",
            title: "Super comfortable & premium finish",
            comment: "The cushioning on these is unreal. Wore them all day on feet and zero fatigue. Colors look even better in real life than the photos."
          },
          {
            name: "Pooja M.",
            rating: 5,
            date: "1 month ago",
            title: "True to size & great grip",
            comment: "Fit is spot-on true to US size. Delivery arrived in 3 days. Definitely purchasing another colorway soon!"
          },
          {
            name: "Aman K.",
            rating: 4,
            date: "Last month",
            title: "Great everyday shoes",
            comment: "Excellent breathability and lightweight feel. Premium packaging as well."
          }
        ].map((rev, i) => (
          <div key={i} className="border border-ink/10 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-track text-white text-xs font-bold flex items-center justify-center">
                  {rev.name[0]}
                </span>
                <span className="font-semibold text-xs text-ink">{rev.name}</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full border border-emerald-200">
                  ✓ Verified Buyer
                </span>
              </div>
              <span className="text-[11px] text-graphite font-medium">{rev.date}</span>
            </div>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, s) => (
                <span key={s} className={`text-xs ${s < rev.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
              ))}
              <span className="text-xs font-semibold text-ink ml-1.5">{rev.title}</span>
            </div>
            <p className="text-xs text-graphite leading-relaxed">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>

    <p className="text-xs text-graphite mt-5 flex items-center gap-1.5">
      <span>🛡️</span> Only customers with a verified purchase can leave a review.
    </p>
  </div>
)}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl mb-6">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}