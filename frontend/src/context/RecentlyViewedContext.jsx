import { createContext, useContext, useEffect, useState } from "react";

const RecentlyViewedContext = createContext(null);
const STORAGE_KEY = "solespace_recent_v1";
const MAX = 8;

export function RecentlyViewedProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const track = (productId) => {
    setIds((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, MAX));
  };

  return (
    <RecentlyViewedContext.Provider value={{ ids, track }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);
