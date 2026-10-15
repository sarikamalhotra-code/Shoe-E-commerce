import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { products, categories } from "../data/products";
import { shoeImg } from "../data/shoeImages";
import ProductRail from "../components/ProductRail";
import HeroCarousel from "../components/HeroCarousel";
import CountdownTimer from "../components/CountdownTimer";
import QuickViewModal from "../components/QuickViewModal";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";

const heroSlides = [
  {
    eyebrow: "New Season · SS26",
    title: "STEP INTO STYLE. EXPLORE OUR COLLECTION.",
    subtitle: "Running, court and trail shoes engineered for the way you actually move. Guest checkout, real returns, SKU-level sizing.",
    cta: "Shop Now",
    ctaLink: "/shop",
    image: shoeImg("heroWhite", 700, 700),
  },
  {
    eyebrow: "Deal Of The Day",
    title: "UP TO 30% OFF SELECT RUNNERS.",
    subtitle: "Limited-time pricing on our most-loved running and trail silhouettes — while sizes last.",
    cta: "Shop The Sale",
    ctaLink: "/shop?discount=1",
    image: shoeImg("redSneaker", 700, 700),
  },
  {
    eyebrow: "Just Landed",
    title: "NEW ARRIVALS, BUILT TO MOVE.",
    subtitle: "Fresh knit trainers and lightweight sneakers just added to the catalog this week.",
    cta: "See New Arrivals",
    ctaLink: "/shop?sort=newest",
    image: shoeImg("whiteHighTop", 700, 700),
  },
];

const catImg = {
  running: shoeImg("grayRunner", 300, 300),
  sneakers: shoeImg("whiteHighTop", 300, 300),
  basketball: shoeImg("blackWhite", 300, 300),
  formal: shoeImg("blackLeather", 300, 300),
  casual: shoeImg("whiteOnClothing", 300, 300),
  boots: shoeImg("brownYellow", 300, 300),
};

export default function Home() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { ids: recentIds } = useRecentlyViewed();

  const newArrivals = useMemo(() => products.filter((p) => p.badges.includes("new")), []);
  const bestsellers = useMemo(() => products.filter((p) => p.badges.includes("bestseller")), []);
  const deal = useMemo(() => products.find((p) => p.badges.includes("sale")) || products[3], []);
  const recentlyViewed = useMemo(() => {
    const found = recentIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);
    return found.length ? found : products.slice(0, 6);
  }, [recentIds]);

  return (
    <div>
      <HeroCarousel slides={heroSlides} />

      {/* Two promo tiles */}
      <section className="container-x -mt-1 sm:mt-0 py-10">
        <div className="grid sm:grid-cols-2 gap-5">
          <PromoTile
            title="Step into style. Explore our collection."
            image={shoeImg("whiteOrangeFloat", 700, 420)}
            link="/shop?category=sneakers"
          />
          <PromoTile
            title="Campaign offers. Explore our collection."
            image={shoeImg("tealAsphalt", 700, 420)}
            link="/shop?discount=1"
          />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container-x py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="label-eyebrow mb-1">Just landed</p>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl">New Arrivals</h2>
          </div>
          <Link to="/shop?sort=newest" className="hidden sm:inline text-sm font-semibold text-track hover:text-traction transition-colors">View all →</Link>
        </div>
        <ProductRail products={newArrivals.length ? newArrivals : products.slice(0, 6)} onQuickView={setQuickViewProduct} />
      </section>

      {/* Best Sellers */}
      <section className="bg-haze py-12">
        <div className="container-x">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="label-eyebrow mb-1">Most reordered</p>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl">Best Sellers</h2>
            </div>
            <Link to="/shop?sort=rating" className="hidden sm:inline text-sm font-semibold text-track hover:text-traction transition-colors">View all →</Link>
          </div>
          <ProductRail products={bestsellers.length ? bestsellers : products.slice(2, 8)} onQuickView={setQuickViewProduct} />
        </div>
      </section>

      {/* Shop by Category */}
      <section className="container-x py-14">
        <div className="text-center mb-8">
          <p className="label-eyebrow mb-1">Find your terrain</p>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl">Shop by Category</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {categories.map((c) => (
            <Link key={c.slug} to={`/shop?category=${c.slug}`} className="flex flex-col items-center gap-3 group">
              <span className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden ring-4 ring-white shadow-card group-hover:ring-traction/40 transition-all">
                <img src={catImg[c.slug]} alt={c.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
              </span>
              <span className="text-sm font-semibold group-hover:text-traction transition-colors">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Deal of the Day */}
      <section className="container-x pb-14">
        <div className="bg-track rounded-2xl overflow-hidden grid md:grid-cols-2 items-center">
          <div className="relative aspect-square md:aspect-auto md:h-full">
            <img src={deal.images[0]} alt={deal.name} className="h-full w-full object-cover" />
          </div>
          <div className="p-8 sm:p-12 text-white">
            <p className="text-traction text-xs font-bold uppercase tracking-wide mb-2">Deal of the Day</p>
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl mb-3">{deal.name}</h3>
            <p className="text-white/70 text-sm mb-6 max-w-sm">
              Featured pick, three products deep in our current rotation — while stocks last on select sizes.
            </p>
            <CountdownTimer hours={26} dark />
            <Link to={`/product/${deal.slug}`} className="btn-primary mt-7 inline-flex">Explore Now</Link>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="container-x pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="label-eyebrow mb-1">Pick up where you left off</p>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl">Recently Viewed Products</h2>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
          {recentlyViewed.map((p) => (
            <Link key={p.id} to={`/product/${p.slug}`} className="shrink-0 w-32 sm:w-40 group">
              <div className="aspect-square rounded-xl overflow-hidden bg-haze mb-2">
                <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
              <p className="text-xs font-semibold truncate">{p.name}</p>
              <p className="text-xs text-graphite">₹{p.price.toLocaleString("en-IN")}</p>
            </Link>
          ))}
        </div>
      </section>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}

function PromoTile({ title, image, link }) {
  return (
    <Link to={link} className="relative rounded-2xl overflow-hidden bg-track text-white flex items-end min-h-[220px] group">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500" />
      <div className="relative p-7 sm:p-8">
        <h3 className="font-display font-extrabold text-xl sm:text-2xl leading-tight mb-4 max-w-xs">{title}</h3>
        <span className="btn-primary !py-2.5 !px-5 !text-xs inline-flex">Shop Now</span>
      </div>
    </Link>
  );
}
