import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { products } from "../data/products";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const GUEST_KEY = "solespace_cart_guest";
const userKey = (email) => `solespace_cart_user_${email.toLowerCase()}`;
const CONSENT_KEY = "solespace_cart_recovery_consent";
// Approximate GST baked into MRP-inclusive Indian retail pricing — used only to
// show an informational tax breakout; it does not change the payable total.
const ASSUMED_GST_RATE = 0.12;

function lineKey(productId, color, size) {
  return `${productId}__${color}__${size}`;
}

function makeSku(productId, color, size) {
  const colorCode = (color || "").replace(/\s+/g, "").slice(0, 4).toUpperCase();
  return `${productId}-${colorCode}-${size}`;
}

// Looks up the *live* catalog record for a cart line so we can validate stock
// and detect price drift in real time, instead of trusting the price/stock
// snapshot that was true at add-to-cart time.
function findVariant(productId, colorName, size) {
  const product = products.find((p) => p.id === productId);
  if (!product) return { exists: false, stock: 0, price: 0, mrp: 0 };
  const color = product.colors.find((c) => c.name === colorName);
  if (!color) return { exists: false, stock: 0, price: product.price, mrp: product.mrp };
  const stock = color.stock[size] ?? 0;
  return { exists: true, stock, price: product.price, mrp: product.mrp };
}

function readStore(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : { items: [], savedItems: [], coupon: null };
  } catch {
    return { items: [], savedItems: [], coupon: null };
  }
}

function writeStore(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* storage unavailable (e.g. private mode) — fail silently */
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const storageKey = user ? userKey(user.email) : GUEST_KEY;

  const [items, setItems] = useState(() => readStore(storageKey).items || []);
  const [savedItems, setSavedItems] = useState(() => readStore(storageKey).savedItems || []);
  const [coupon, setCoupon] = useState(() => readStore(storageKey).coupon || null);
  const [lastActivityAt, setLastActivityAt] = useState(() => Date.now());
  const [recoveryConsent, setRecoveryConsent] = useState(() => {
    try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
  });

  const prevUserRef = useRef(user);

  // --- Guest cart merge-on-login -------------------------------------
  // When AuthContext flips from "no user" to "user" we treat it as a login
  // event: pull the guest cart out of storage, merge each line into whatever
  // that account already has saved (server-side this would be a real API
  // call; here the per-user localStorage bucket stands in for it), then wipe
  // the guest bucket so it doesn't leak into the next guest session.
  useEffect(() => {
    const wasGuest = !prevUserRef.current;
    const isNowUser = !!user;
    if (wasGuest && isNowUser) {
      const guest = readStore(GUEST_KEY);
      const existing = readStore(userKey(user.email));
      if ((guest.items?.length || 0) > 0 || (guest.savedItems?.length || 0) > 0) {
        const mergedItems = [...(existing.items || [])];
        for (const gi of guest.items || []) {
          const match = mergedItems.find((i) => i.key === gi.key);
          if (match) match.qty += gi.qty;
          else mergedItems.push(gi);
        }
        const mergedSaved = [...(existing.savedItems || [])];
        for (const gs of guest.savedItems || []) {
          if (!mergedSaved.find((i) => i.key === gs.key)) mergedSaved.push(gs);
        }
        setItems(mergedItems);
        setSavedItems(mergedSaved);
        setCoupon(existing.coupon || guest.coupon || null);
        writeStore(userKey(user.email), { items: mergedItems, savedItems: mergedSaved, coupon: existing.coupon || guest.coupon || null });
        localStorage.removeItem(GUEST_KEY);
      } else {
        setItems(existing.items || []);
        setSavedItems(existing.savedItems || []);
        setCoupon(existing.coupon || null);
      }
    } else if (!isNowUser && prevUserRef.current) {
      // Logout: switch back to the (now-empty) guest bucket.
      const guest = readStore(GUEST_KEY);
      setItems(guest.items || []);
      setSavedItems(guest.savedItems || []);
      setCoupon(guest.coupon || null);
    }
    prevUserRef.current = user;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Persist whatever bucket is currently active (guest or this user).
  useEffect(() => {
    writeStore(storageKey, { items, savedItems, coupon });
  }, [items, savedItems, coupon, storageKey]);

  const touch = () => setLastActivityAt(Date.now());

  const addItem = (product, color, size, qty = 1, customImage = null) => {
    const key = lineKey(product.id, color, size);
    const { stock } = findVariant(product.id, color, size);
    const colorObj = product.colors?.find((c) => c.name === color);
    const itemImage = customImage || colorObj?.image || product.images?.[0];

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      const currentQty = existing ? existing.qty : 0;
      const nextQty = stock > 0 ? Math.min(currentQty + qty, stock) : currentQty + qty;
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: nextQty, image: itemImage || i.image } : i));
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          image: itemImage,
          price: product.price,
          mrp: product.mrp,
          color,
          size,
          qty: nextQty,
          sku: makeSku(product.id, color, size),
        },
      ];
    });
    touch();
  };

  const updateQty = (key, qty) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.key !== key) return i;
        const { stock } = findVariant(i.productId, i.color, i.size);
        const ceiling = stock > 0 ? stock : Math.max(qty, 1);
        return { ...i, qty: Math.min(Math.max(1, qty), ceiling) };
      })
    );
    touch();
  };

  const removeItem = (key) => { setItems((prev) => prev.filter((i) => i.key !== key)); touch(); };
  const clearCart = () => { setItems([]); setCoupon(null); touch(); };

  // --- Save for later ---------------------------------------------------
  const saveForLater = (key) => {
    const found = items.find((i) => i.key === key);
    if (!found) return;
    setSavedItems((s) => (s.find((i) => i.key === key) ? s : [...s, found]));
    setItems((prev) => prev.filter((i) => i.key !== key));
    touch();
  };

  const moveToCart = (key) => {
    const found = savedItems.find((i) => i.key === key);
    if (!found) return;
    const { stock } = findVariant(found.productId, found.color, found.size);
    setItems((cur) => {
      const existing = cur.find((i) => i.key === key);
      if (existing) {
        const nextQty = stock > 0 ? Math.min(existing.qty + found.qty, stock) : existing.qty + found.qty;
        return cur.map((i) => (i.key === key ? { ...i, qty: nextQty } : i));
      }
      const qty = stock > 0 ? Math.min(found.qty, stock) : found.qty;
      return [...cur, { ...found, qty }];
    });
    setSavedItems((prev) => prev.filter((i) => i.key !== key));
    touch();
  };

  const removeSaved = (key) => setSavedItems((prev) => prev.filter((i) => i.key !== key));

  // --- Coupons ------------------------------------------------------------
  const applyCoupon = (code) => {
    const known = {
      WELCOME10: { code: "WELCOME10", type: "percent", value: 10, label: "10% off" },
      FREESHIP: { code: "FREESHIP", type: "shipping", value: 0, label: "Free shipping" },
    };
    const found = known[code?.toUpperCase()];
    if (found) { setCoupon(found); touch(); return { ok: true }; }
    return { ok: false, message: "That code isn't valid. Try WELCOME10 or FREESHIP." };
  };
  const removeCoupon = () => { setCoupon(null); touch(); };

  // --- Real-time stock / price validation ---------------------------------
  // Enriches each stored line with the *current* catalog stock & price so the
  // cart UI can flag "only 2 left" / "price dropped" / "no longer available"
  // without ever mutating what's actually in localStorage.
  const itemsWithAvailability = useMemo(
    () =>
      items.map((i) => {
        const live = findVariant(i.productId, i.color, i.size);
        return {
          ...i,
          currentPrice: live.exists ? live.price : i.price,
          currentMrp: live.exists ? live.mrp : i.mrp,
          availableStock: live.stock,
          isAvailable: live.exists && live.stock > 0,
          exceedsStock: live.exists && i.qty > live.stock,
          priceChanged: live.exists && live.price !== i.price,
        };
      }),
    [items]
  );

  const subtotal = useMemo(
    () => itemsWithAvailability.reduce((s, i) => s + i.currentPrice * i.qty, 0),
    [itemsWithAvailability]
  );
  const mrpTotal = useMemo(
    () => itemsWithAvailability.reduce((s, i) => s + i.currentMrp * i.qty, 0),
    [itemsWithAvailability]
  );
  const discount = useMemo(() => {
    let d = mrpTotal - subtotal;
    if (coupon?.type === "percent") d += subtotal * (coupon.value / 100);
    return Math.round(d);
  }, [mrpTotal, subtotal, coupon]);
  const shipping = useMemo(() => {
    if (items.length === 0) return 0;
    if (coupon?.type === "shipping") return 0;
    return subtotal >= 4000 ? 0 : 149;
  }, [subtotal, items.length, coupon]);
  const couponSavings = useMemo(
    () => (coupon?.type === "percent" ? Math.round(subtotal * (coupon.value / 100)) : 0),
    [subtotal, coupon]
  );
  const total = useMemo(() => Math.max(0, subtotal - couponSavings) + shipping, [subtotal, couponSavings, shipping]);
  const itemCount = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  // Estimated tax already folded into MRP-inclusive pricing (typical for
  // Indian retail); shown as an informational line, never added on top.
  const estimatedTax = useMemo(() => {
    const netTotal = Math.max(0, subtotal - couponSavings);
    return Math.round(netTotal - netTotal / (1 + ASSUMED_GST_RATE));
  }, [subtotal, couponSavings]);

  const hasUnavailableItems = itemsWithAvailability.some((i) => !i.isAvailable || i.exceedsStock);

  // --- Abandoned-cart recovery (consent-gated) -----------------------------
  // In production this flag would be sent to the backend so a queued job can
  // email a reminder after a period of inactivity. Here we just persist the
  // person's choice locally and expose it so a UI banner can ask/react.
  const setRecoveryOptIn = (optIn) => {
    setRecoveryConsent(optIn ? "true" : "false");
    try { localStorage.setItem(CONSENT_KEY, optIn ? "true" : "false"); } catch { /* ignore */ }
  };

  const value = {
    items: itemsWithAvailability,
    addItem, updateQty, removeItem, clearCart,
    savedItems, saveForLater, moveToCart, removeSaved,
    coupon, applyCoupon, removeCoupon,
    subtotal, mrpTotal, discount, shipping, total, itemCount, couponSavings,
    estimatedTax, hasUnavailableItems,
    lastActivityAt,
    recoveryConsent, setRecoveryOptIn,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
