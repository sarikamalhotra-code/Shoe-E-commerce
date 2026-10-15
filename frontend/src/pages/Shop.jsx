import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { products, categories, brands, genders } from "../data/products";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/QuickViewModal";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "discount", label: "Biggest Discount" },
];

const allSizes = [5,6,7,8,9,10,11,12,13];

function FilterPanel({ params, toggleValue, priceMax, setPriceMax, clearAll }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg">Filters</p>
        <button onClick={clearAll} className="stitch text-xs uppercase font-semibold text-graphite hover:text-ink">Clear all</button>
      </div>

      <div>
        <p className="label-eyebrow mb-3">Shop for</p>
        <div className="space-y-2">
          {genders.map((g) => (
            <label key={g.slug} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={params.getAll("gender").includes(g.slug)} onChange={() => toggleValue("gender", g.slug)} className="accent-track" />
              {g.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="label-eyebrow mb-3">Category</p>
        <div className="space-y-2">
          {categories.map((c) => (
            <label key={c.slug} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={params.getAll("category").includes(c.slug)} onChange={() => toggleValue("category", c.slug)} className="accent-track" />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="label-eyebrow mb-3">Brand</p>
        <div className="space-y-2">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={params.getAll("brand").includes(b)} onChange={() => toggleValue("brand", b)} className="accent-track" />
              {b}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="label-eyebrow mb-3">Size (US)</p>
        <div className="grid grid-cols-4 gap-2">
          {allSizes.map((s) => {
            const active = params.getAll("size").includes(String(s));
            return (
              <button
                key={s}
                onClick={() => toggleValue("size", String(s))}
                className={`h-9 text-sm font-mono border ${active ? "bg-ink text-white border-ink" : "border-ink/30 hover:border-ink"}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="label-eyebrow mb-3">Max price: ₹{Number(priceMax).toLocaleString("en-IN")}</p>
        <input type="range" min="1500" max="13000" step="500" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="w-full accent-track" />
      </div>

      <div>
        <p className="label-eyebrow mb-3">Rating</p>
        <div className="space-y-2">
          {[4,3].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="rating" checked={params.get("rating") === String(r)} onChange={() => toggleValue("rating", String(r), true)} className="accent-track" />
              {r}★ &amp; above
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [view, setView] = useState("grid");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [priceMax, setPriceMax] = useState(13000);

  const toggleValue = (key, value, single = false) => {
    const next = new URLSearchParams(params);
    if (single) {
      if (next.get(key) === value) next.delete(key);
      else next.set(key, value);
    } else {
      const current = next.getAll(key);
      next.delete(key);
      const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      updated.forEach((v) => next.append(key, v));
    }
    setParams(next);
  };

  const clearAll = () => { setParams(new URLSearchParams()); setPriceMax(13000); };

  const search = params.get("search")?.toLowerCase() || "";
  const catFilter = params.getAll("category");
  const genderFilter = params.getAll("gender");
  const brandFilter = params.getAll("brand");
  const sizeFilter = params.getAll("size").map(Number);
  const ratingFilter = params.get("rating") ? Number(params.get("rating")) : 0;
  const discountOnly = params.get("discount") === "1";
  const sort = params.get("sort") || "relevance";

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (search && !(`${p.name} ${p.brand} ${p.category} ${p.activity}`.toLowerCase().includes(search))) return false;
      if (catFilter.length && !catFilter.includes(p.category)) return false;
      if (genderFilter.length && !genderFilter.includes(p.gender)) return false;
      if (brandFilter.length && !brandFilter.includes(p.brand)) return false;
      if (sizeFilter.length && !p.colors.some((c) => sizeFilter.some((s) => c.sizes.includes(s) && c.stock[s] > 0))) return false;
      if (p.price > priceMax) return false;
      if (ratingFilter && p.rating < ratingFilter) return false;
      if (discountOnly && p.mrp <= p.price) return false;
      return true;
    });
    switch (sort) {
      case "priceLow": list = [...list].sort((a, b) => a.price - b.price); break;
      case "priceHigh": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      case "newest": list = [...list].sort((a, b) => (b.badges.includes("new") ? 1 : 0) - (a.badges.includes("new") ? 1 : 0)); break;
      case "discount": list = [...list].sort((a, b) => (b.mrp - b.price) / (b.mrp||1) - (a.mrp - a.price) / (a.mrp||1)); break;
      default: break;
    }
    return list;
  }, [search, catFilter, genderFilter, brandFilter, sizeFilter, priceMax, ratingFilter, discountOnly, sort]);

  const activeChips = [...catFilter, ...genderFilter.map((g) => genders.find((x) => x.slug === g)?.name || g), ...brandFilter, ...sizeFilter.map((s) => `Size ${s}`)];

  return (
    <div className="container-x py-10">
      <div className="mb-6">
        <p className="label-eyebrow mb-1">{search ? `Results for "${params.get("search")}"` : "Catalog"}</p>
        <h1 className="font-display font-extrabold text-4xl">
          {genderFilter.length === 1 ? `${genders.find((g) => g.slug === genderFilter[0])?.name}'s Shoes` : "All Shoes"}
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterPanel params={params} toggleValue={toggleValue} priceMax={priceMax} setPriceMax={setPriceMax} clearAll={clearAll} />
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-ink/10 pb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileFiltersOpen(true)} className="lg:hidden btn-outline !px-4 !py-2 text-xs">Filters</button>
              <span className="text-sm text-graphite font-medium">{filtered.length} products</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex border border-ink/20 rounded">
                <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-ink text-white" : ""}`} aria-label="Grid view">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                </button>
                <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-ink text-white" : ""}`} aria-label="List view">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
                </button>
              </div>
              <select
                value={sort}
                onChange={(e) => { const n = new URLSearchParams(params); n.set("sort", e.target.value); setParams(n); }}
                className="input !w-auto text-xs font-medium cursor-pointer"
                aria-label="Sort products"
              >
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeChips.map((chip) => <span key={chip} className="stamp">{chip}</span>)}
              <button onClick={clearAll} className="stamp bg-ink text-white border-ink">Clear ✕</button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-2xl mb-2">No shoes matched</p>
              <p className="text-graphite text-sm mb-6">Try widening your filters or search for something else.</p>
              <button onClick={clearAll} className="btn-primary">Reset filters</button>
            </div>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10" : "flex flex-col gap-5"}>
              {filtered.map((p) => <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} layout={view} />)}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-paper p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <p className="font-display text-xl">Filters</p>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">✕</button>
            </div>
            <FilterPanel params={params} toggleValue={toggleValue} priceMax={priceMax} setPriceMax={setPriceMax} clearAll={clearAll} />
            <button onClick={() => setMobileFiltersOpen(false)} className="btn-primary w-full mt-8">Show {filtered.length} results</button>
          </div>
        </div>
      )}

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
