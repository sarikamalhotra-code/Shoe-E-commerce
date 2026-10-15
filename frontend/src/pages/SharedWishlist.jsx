import { Link, useSearchParams } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function SharedWishlist() {
  const [params] = useSearchParams();
  const ids = (params.get("ids") || "").split(",").filter(Boolean);
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <div className="container-x py-10">
      <p className="label-eyebrow mb-2">Shared wishlist</p>
      <h1 className="font-display text-4xl mb-2">Someone's picks</h1>
      <p className="text-graphite mb-8">A friend shared this wishlist with you — no account needed to browse it.</p>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-2xl mb-3">This wishlist link looks empty or has expired.</p>
          <Link to="/shop" className="btn-primary">Browse shoes</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
