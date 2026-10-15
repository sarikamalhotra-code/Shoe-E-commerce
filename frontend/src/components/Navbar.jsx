import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { categories, brands } from "../data/products";
import MiniCart from "./MiniCart";

const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

const genderMenus = {
  Men: { gender: "men" },
  Women: { gender: "women" },
  Kids: { gender: "kids" },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(null);
  const [query, setQuery] = useState("");
  const { itemCount, subtotal } = useCart();
  const { ids } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setOpen(false);
  };

  const toggleMobileMenu = (label) => setMobileMenu((m) => (m === label ? null : label));

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Utility bar */}
      <div className="hidden md:block bg-track text-white/80 text-xs">
        <div className="container-x flex items-center justify-between h-8 text-[11px] font-medium">
          <span className="tracking-wide">Free Express Shipping on Orders Above ₹1,999 · 30-Day Easy Returns</span>
          <div className="flex items-center gap-4">
            {user?.role === "admin" && (
              <Link to="/admin" className="text-traction font-bold hover:underline">
                ★ Admin Console
              </Link>
            )}
            <Link to={user ? "/account" : "/login"} className="hover:text-white transition-colors">
              {user ? `Hi, ${user.name.split(" ")[0]}` : "Account / Login"}
            </Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-ink/8">
        <div className="container-x flex items-center gap-4 h-[68px]">
          <button className="lg:hidden p-2 -ml-2" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>

          <Link to="/" className="flex items-center shrink-0" aria-label="SoleSpace home">
            <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight">
              <span className="text-track">SOLE</span><span className="text-traction">SPACE</span>
            </span>
          </Link>

          <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-xl mx-auto relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search for shoes, brands, style…"
              className="w-full bg-haze rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-track/30"
              aria-label="Search products"
            />
          </form>

          <div className="flex items-center gap-1 ml-auto md:ml-0">
            <Link to="/" className="icon-btn hidden sm:flex" aria-label="Home">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 11l9-7 9 7" /><path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" />
              </svg>
            </Link>
            <Link to={user ? "/account" : "/login"} className="icon-btn hidden sm:flex" aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
              </svg>
            </Link>
            <Link to="/wishlist" className="icon-btn relative" aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4 6 3.5 8.5 3.2 10.7 4.6 12 7c1.3-2.4 3.5-3.8 6-3.5 4 .5 5.5 4.5 4 8.2C19.5 16.3 12 21 12 21z" />
              </svg>
              {ids.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-traction text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">{ids.length}</span>
              )}
            </Link>
            <div className="group relative">
              <Link to="/cart" className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-haze transition-colors relative">
                <span className="relative">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" />
                    <path d="M3 4h2l2.4 12.2a2 2 0 002 1.8h7.2a2 2 0 002-1.7L20 8H6" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-traction text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">{itemCount}</span>
                  )}
                </span>
                <span className="hidden sm:flex flex-col leading-tight text-left">
                  <span className="text-[10px] text-graphite uppercase">Cart</span>
                  <span className="text-xs font-bold">{fmt(subtotal)}</span>
                </span>
              </Link>
              {/* Mini-cart preview: hover on desktop, tap the cart link itself on touch devices */}
              <div className="hidden md:block invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute top-full right-0 pt-2 z-30">
                <MiniCart />
              </div>
            </div>
          </div>
        </div>

        {/* Category row with dropdowns */}
        <nav className="hidden lg:flex container-x items-center gap-8 h-11 border-t border-ink/5">
          <NavLink to="/shop?sort=newest" className={({ isActive }) => `text-sm font-semibold tracking-wide ${isActive ? "text-traction" : "text-ink"} hover:text-traction transition-colors`}>
            New Arrivals
          </NavLink>

          {Object.entries(genderMenus).map(([label, cfg]) => (
            <div key={label} className="group relative h-11 flex items-center">
              <button className="text-sm font-semibold tracking-wide text-ink group-hover:text-traction transition-colors flex items-center gap-1">
                {label}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute top-full left-1/2 -translate-x-1/2 pt-2 z-20">
                <div className="bg-white rounded-xl shadow-cardHover border border-ink/5 py-2 w-52">
                  <Link to={`/shop?gender=${cfg.gender}`} className="block px-4 py-2 text-sm font-semibold text-track hover:bg-haze">
                    All {label}'s Shoes
                  </Link>
                  <div className="h-px bg-ink/8 my-1 mx-4" />
                  {categories.map((c) => (
                    <Link key={c.slug} to={`/shop?gender=${cfg.gender}&category=${c.slug}`} className="block px-4 py-2 text-sm text-ink/80 hover:bg-haze hover:text-traction">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="group relative h-11 flex items-center">
            <button className="text-sm font-semibold tracking-wide text-ink group-hover:text-traction transition-colors flex items-center gap-1">
              Brands
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute top-full left-1/2 -translate-x-1/2 pt-2 z-20">
              <div className="bg-white rounded-xl shadow-cardHover border border-ink/5 py-2 w-48">
                {brands.map((b) => (
                  <Link key={b} to={`/shop?brand=${encodeURIComponent(b)}`} className="block px-4 py-2 text-sm text-ink/80 hover:bg-haze hover:text-traction">
                    {b}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {open && (
        <div className="lg:hidden border-b border-ink/10 bg-white max-h-[calc(100vh-68px)] overflow-y-auto">
          <form onSubmit={onSearch} className="container-x py-3">
            <input value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="Search shoes…" className="input" aria-label="Search products" />
          </form>
          <nav className="container-x flex flex-col pb-4">
            <Link to="/" onClick={() => setOpen(false)} className="text-sm font-semibold uppercase tracking-wide py-2.5 border-b border-ink/5 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-7 9 7" /><path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" /></svg>
              Home
            </Link>
            <Link to="/shop?sort=newest" onClick={() => setOpen(false)} className="text-sm font-semibold uppercase tracking-wide py-2.5 border-b border-ink/5">
              New Arrivals
            </Link>
            {Object.entries(genderMenus).map(([label, cfg]) => (
              <div key={label} className="border-b border-ink/5">
                <button onClick={() => toggleMobileMenu(label)} className="w-full flex items-center justify-between py-2.5 text-sm font-semibold uppercase tracking-wide">
                  {label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${mobileMenu === label ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {mobileMenu === label && (
                  <div className="pb-2 pl-3 flex flex-col gap-1">
                    <Link to={`/shop?gender=${cfg.gender}`} onClick={() => setOpen(false)} className="py-1.5 text-sm font-semibold text-track">All {label}'s Shoes</Link>
                    {categories.map((c) => (
                      <Link key={c.slug} to={`/shop?gender=${cfg.gender}&category=${c.slug}`} onClick={() => setOpen(false)} className="py-1.5 text-sm text-ink/70">
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="border-b border-ink/5">
              <button onClick={() => toggleMobileMenu("Brands")} className="w-full flex items-center justify-between py-2.5 text-sm font-semibold uppercase tracking-wide">
                Brands
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${mobileMenu === "Brands" ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
              </button>
              {mobileMenu === "Brands" && (
                <div className="pb-2 pl-3 flex flex-col gap-1">
                  {brands.map((b) => (
                    <Link key={b} to={`/shop?brand=${encodeURIComponent(b)}`} onClick={() => setOpen(false)} className="py-1.5 text-sm text-ink/70">{b}</Link>
                  ))}
                </div>
              )}
            </div>
            <Link to={user ? "/account" : "/login"} onClick={() => setOpen(false)} className="text-sm font-semibold uppercase tracking-wide py-2.5">
              {user ? "My Account" : "Account / Login"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
