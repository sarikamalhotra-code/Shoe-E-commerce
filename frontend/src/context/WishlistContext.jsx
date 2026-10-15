import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { products } from "../data/products";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";

const WishlistContext = createContext(null);

const GUEST_KEY = "solespace_wishlist_guest";
const userKey = (email) => `solespace_wishlist_user_${email.toLowerCase()}`;

function readEntries(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    // Back-compat: older builds stored a plain array of product id strings.
    if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === "string") {
      return parsed.map((productId) => ({ productId, addedAt: Date.now(), priceAtAdd: null }));
    }
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEntries(key, entries) {
  try {
    localStorage.setItem(key, JSON.stringify(entries));
  } catch {
    /* storage unavailable — fail silently */
  }
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const cart = useCart();
  const storageKey = user ? userKey(user.email) : GUEST_KEY;

  const [entries, setEntries] = useState(() => readEntries(storageKey));
  const prevUserRef = useRef(user);

  // --- Guest wishlist merge-on-login / cross-device persistence ----------
  // A registered user's wishlist is kept in its own localStorage bucket
  // (standing in for a per-account record on the server) so it survives
  // logout/login on this device; in production the same bucket would be
  // synced from the backend on every device the person signs into.
  useEffect(() => {
    const wasGuest = !prevUserRef.current;
    const isNowUser = !!user;
    if (wasGuest && isNowUser) {
      const guestEntries = readEntries(GUEST_KEY);
      const existing = readEntries(userKey(user.email));
      if (guestEntries.length > 0) {
        const merged = [...existing];
        for (const g of guestEntries) {
          if (!merged.find((e) => e.productId === g.productId)) merged.push(g);
        }
        setEntries(merged);
        writeEntries(userKey(user.email), merged);
        localStorage.removeItem(GUEST_KEY);
      } else {
        setEntries(existing);
      }
    } else if (!isNowUser && prevUserRef.current) {
      setEntries(readEntries(GUEST_KEY));
    }
    prevUserRef.current = user;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    writeEntries(storageKey, entries);
  }, [entries, storageKey]);

  const toggle = (productId) => {
    setEntries((prev) => {
      if (prev.find((e) => e.productId === productId)) {
        return prev.filter((e) => e.productId !== productId);
      }
      const product = products.find((p) => p.id === productId);
      return [...prev, { productId, addedAt: Date.now(), priceAtAdd: product?.price ?? null }];
    });
  };

  const isWishlisted = (productId) => entries.some((e) => e.productId === productId);
  const remove = (productId) => setEntries((prev) => prev.filter((e) => e.productId !== productId));

  // Move a wishlisted product into the cart with a chosen variant, then drop
  // it from the wishlist.
  const moveToCart = (productId, colorName, size) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return { ok: false, message: "Product no longer available." };
    const color = product.colors.find((c) => c.name === colorName) || product.colors[0];
    if (!color) return { ok: false, message: "Product no longer available." };
    const pickedSize = size ?? color.sizes.find((s) => color.stock[s] > 0);
    if (!pickedSize || !color.stock[pickedSize]) return { ok: false, message: "That size is out of stock." };
    cart.addItem(product, color.name, pickedSize, 1);
    remove(productId);
    return { ok: true };
  };

  // Enriches each wishlist entry with live product data plus price-drop /
  // price-rise and in-stock / out-of-stock indicators.
  const items = useMemo(
    () =>
      entries
        .map((e) => {
          const product = products.find((p) => p.id === e.productId);
          if (!product) return null;
          const inStock = product.colors.some((c) => c.sizes.some((s) => c.stock[s] > 0));
          const priceAtAdd = e.priceAtAdd ?? product.price;
          const priceDelta = product.price - priceAtAdd;
          return {
            ...e,
            product,
            inStock,
            priceAtAdd,
            currentPrice: product.price,
            priceDelta,
            priceDropped: priceDelta < 0,
            priceRose: priceDelta > 0,
          };
        })
        .filter(Boolean),
    [entries]
  );

  const ids = useMemo(() => entries.map((e) => e.productId), [entries]);

  // Shareable wishlist link — a read-only view keyed off product ids in the
  // URL, no account or backend record required.
  const getShareUrl = () => {
    const idParam = encodeURIComponent(ids.join(","));
    return `${window.location.origin}/wishlist/shared?ids=${idParam}`;
  };

  return (
    <WishlistContext.Provider value={{ ids, entries, items, toggle, isWishlisted, remove, moveToCart, getShareUrl }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
