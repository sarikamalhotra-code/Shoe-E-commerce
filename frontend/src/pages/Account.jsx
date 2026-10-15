import { useState, useEffect, useMemo, useCallback } from "react";
import { NavLink, Route, Routes, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { API_BASE_URL } from "../config/api";

/* ==========================================================================
   ICONS (Modern, lightweight, zero-dependency inline SVGs)
   ========================================================================== */

function IconOverview(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconOrders(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16.5 9.4 7.55 4.24a1.78 1.78 0 0 0-1.8 0L2.5 6.1a1.8 1.8 0 0 0 0 3.12l8.95 5.16a1.78 1.78 0 0 0 1.8 0l8.25-4.76a1.8 1.8 0 0 0 0-3.12Z" />
      <path d="M2.5 9.3v5.4a1.8 1.8 0 0 0 .9 1.56l8 4.62a1.8 1.8 0 0 0 1.8 0l8-4.62a1.8 1.8 0 0 0 .9-1.56V9.3" />
      <path d="M12 14.5v7" />
    </svg>
  );
}

function IconPin(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconSettings(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconShoppingBag(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconCheckCircle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconHeart(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function IconArrowRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function IconTruck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-5.5a1 1 0 0 0-.29-.71l-3.5-3.5A1 1 0 0 0 17.5 7H14v11Z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

function IconTrash(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function IconEdit(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function IconEye(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

function IconLock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconBell(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

/* ==========================================================================
   STATUS BADGES & JOURNEY STEPPERS
   ========================================================================== */

const statusStyles = {
  Delivered: { badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20", dot: "bg-emerald-500" },
  Shipped: { badge: "bg-sky-50 text-sky-700 ring-1 ring-sky-600/20", dot: "bg-sky-500" },
  Processing: { badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20", dot: "bg-amber-500" },
  Pending: { badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20", dot: "bg-amber-500" },
  "Return Requested": { badge: "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20", dot: "bg-rose-500" },
  Cancelled: { badge: "bg-slate-100 text-slate-700 ring-1 ring-slate-400/20", dot: "bg-slate-500" },
};

function StatusBadge({ status }) {
  const currentStatus = status || "Processing";
  const s = statusStyles[currentStatus] || statusStyles.Processing;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {currentStatus}
    </span>
  );
}

const trackingSteps = ["Placed", "Processing", "Shipped", "Delivered"];

function TrackingJourney({ status }) {
  const currentStatus = status || "Processing";

  if (currentStatus === "Return Requested") {
    return (
      <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-medium text-rose-700">
        <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
        Return Requested — Our customer support team will contact you within 24 hours.
      </div>
    );
  }

  if (currentStatus === "Cancelled") {
    return (
      <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600">
        <span className="h-2 w-2 rounded-full bg-slate-400" />
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = trackingSteps.indexOf(currentStatus === "Pending" ? "Processing" : currentStatus);
  const activeIdx = currentIndex === -1 ? 1 : currentIndex;

  return (
    <div className="py-2">
      <div className="flex items-center justify-between relative">
        {trackingSteps.map((step, i) => {
          const isCompleted = i <= activeIdx;
          const isCurrent = i === activeIdx;
          return (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              {/* Connecting line */}
              {i < trackingSteps.length - 1 && (
                <div
                  className={`absolute top-3.5 left-1/2 w-full h-0.5 -z-0 transition-colors duration-300 ${
                    i < activeIdx ? "bg-[#111827]" : "bg-slate-200"
                  }`}
                />
              )}
              {/* Step indicator node */}
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 relative z-10 ${
                  isCurrent
                    ? "bg-[#F97316] text-white ring-4 ring-[#F97316]/20 shadow-sm"
                    : isCompleted
                    ? "bg-[#111827] text-white"
                    : "bg-white text-slate-400 border-2 border-slate-200"
                }`}
              >
                {isCompleted && !isCurrent ? "✓" : i + 1}
              </div>
              <span
                className={`mt-2 text-[11px] font-semibold uppercase tracking-wider text-center ${
                  isCurrent ? "text-[#F97316]" : isCompleted ? "text-[#111827]" : "text-slate-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================================================
   OVERVIEW PAGE
   ========================================================================== */

function Overview({ orders, loadingOrders }) {
  const { user } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => {
    const s = (o.status || "Pending").toLowerCase();
    return s === "pending" || s === "processing" || s === "shipped";
  }).length;
  const deliveredOrders = orders.filter((o) => (o.status || "").toLowerCase() === "delivered").length;
  const wishlistCount = wishlistItems ? wishlistItems.length : 0;

  const recentOrders = useMemo(() => {
    return orders.slice(0, 3);
  }, [orders]);

  return (
    <div className="space-y-8">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Orders</span>
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#111827]">
              <IconShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <p className="font-display font-bold text-3xl text-[#111827]">{loadingOrders ? "..." : totalOrders}</p>
          <p className="text-xs text-slate-400 mt-1">Lifetime orders placed</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending</span>
            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#F97316]">
              <IconClock className="h-5 w-5" />
            </div>
          </div>
          <p className="font-display font-bold text-3xl text-[#F97316]">{loadingOrders ? "..." : pendingOrders}</p>
          <p className="text-xs text-slate-400 mt-1">Processing or in transit</p>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Delivered</span>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <IconCheckCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="font-display font-bold text-3xl text-emerald-600">{loadingOrders ? "..." : deliveredOrders}</p>
          <p className="text-xs text-slate-400 mt-1">Successfully received</p>
        </div>

        {/* Wishlist Items */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Wishlist</span>
            <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
              <IconHeart className="h-5 w-5" />
            </div>
          </div>
          <p className="font-display font-bold text-3xl text-[#111827]">{wishlistCount}</p>
          <p className="text-xs text-slate-400 mt-1">Saved favorite shoes</p>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-lg text-[#111827]">Looking to upgrade your rotation?</h2>
          <p className="text-sm text-slate-500 mt-0.5">Explore our latest performance drops, sneakers, and member exclusives.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate("/account/orders")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#111827] hover:bg-slate-50 transition"
          >
            <IconOrders className="h-4 w-4" />
            View Orders
          </button>
          <button
            onClick={() => navigate("/shop")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#ea580c] shadow-sm transition"
          >
            <IconShoppingBag className="h-4 w-4" />
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-display font-bold text-lg text-[#111827]">Recent Orders</h2>
            <p className="text-xs text-slate-500 mt-0.5">Track and view updates for your most recent purchases</p>
          </div>
          {orders.length > 0 && (
            <Link
              to="/account/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:underline"
            >
              All Orders ({orders.length}) <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {loadingOrders ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                <div className="h-16 w-16 bg-slate-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map((order, orderIdx) => {
              const orderId = order._id ? `#${order._id.slice(-6).toUpperCase()}` : `ORDER-${orderIdx + 1}`;
              const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              }) : "Recent";
              const firstItem = order.orderItems?.[0];
              const totalItems = order.orderItems?.reduce((sum, it) => sum + (it.qty || 1), 0) || order.orderItems?.length || 1;

              return (
                <div
                  key={order._id || `recent_order_${orderIdx}`}
                  className="rounded-xl border border-slate-200/70 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-300 transition bg-slate-50/50"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={firstItem?.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"}
                      alt={firstItem?.name || "Shoe"}
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-bold text-[#111827] text-sm sm:text-base">{orderId}</span>
                        <StatusBadge status={order.status || "Processing"} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Placed on {dateStr}</p>
                      <p className="text-xs font-medium text-slate-700 truncate mt-0.5">
                        {firstItem?.name || "SoleSpace Footwear"}
                        {order.orderItems?.length > 1 && ` + ${order.orderItems.length - 1} more item(s)`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-200/60">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-slate-400">{totalItems} item{totalItems > 1 ? "s" : ""}</p>
                      <p className="font-display font-bold text-base text-[#111827]">
                        ₹{order.totalPrice?.toLocaleString("en-IN") || "0"}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/account/orders")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#111827] hover:bg-slate-50 transition shadow-2xs"
                    >
                      Track Order <IconArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Helpful Empty State when no orders exist */
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <div className="h-16 w-16 rounded-2xl bg-orange-50 text-[#F97316] flex items-center justify-center mx-auto mb-4 shadow-2xs">
              <IconShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#111827] mb-1">No orders yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              You haven't placed any orders with SoleSpace yet. Explore our curated collections of running shoes, sneakers, and lifestyle footwear!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate("/shop")}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#ea580c] shadow-sm transition"
              >
                <IconShoppingBag className="h-4 w-4" />
                Start Shopping
              </button>
              {wishlistCount > 0 && (
                <button
                  onClick={() => navigate("/wishlist")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-[#111827] hover:bg-slate-50 transition"
                >
                  <IconHeart className="h-4 w-4 text-rose-500" />
                  View Wishlist ({wishlistCount})
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Account Details Quick View */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h2 className="font-display font-bold text-lg text-[#111827] mb-4">Account Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Profile Name</p>
            <p className="font-semibold text-[#111827]">{user?.name || "Valued Customer"}</p>
            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Membership Tier</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-[#F97316]">
                ★ SoleMember
              </span>
              <span className="text-xs text-slate-600 font-medium">{user?.loyaltyPoints || 120} Points</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">Free express shipping on all orders</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Default Shipping</p>
            {user?.addresses && user.addresses.length > 0 ? (
              <div>
                <p className="font-semibold text-xs text-[#111827]">
                  {user.addresses.find((a) => a.isDefault)?.line1 || user.addresses[0]?.line1}
                </p>
                <p className="text-xs text-slate-500">
                  {user.addresses.find((a) => a.isDefault)?.city || user.addresses[0]?.city},{" "}
                  {user.addresses.find((a) => a.isDefault)?.state || user.addresses[0]?.state}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic mt-1">No saved addresses yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   ORDERS PAGE
   ========================================================================== */

function Orders({ orders, loadingOrders, ordersError, onRetry }) {
  const { addItem } = useCart();
  const { push } = useToast();
  const navigate = useNavigate();
  const [statusOverrides, setStatusOverrides] = useState({});
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleReorder = (order) => {
    if (!order.orderItems?.length) return;
    order.orderItems.forEach((it) => {
      addItem(
        {
          id: it.sku || it._id || "SS",
          name: it.name,
          price: it.price,
          mrp: it.price,
          images: [it.image],
        },
        it.color || "Standard",
        it.size || 9,
        it.qty || 1,
        it.image
      );
    });
    push("Items added to your cart!");
    navigate("/cart");
  };

  const handleInvoice = (order) => {
    const id = (order._id || "").slice(-6).toUpperCase();
    push(`Generating invoice for Order #${id}...`);
    window.print();
  };

  const handleReturn = async (orderId) => {
    try {
      await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Return Requested" }),
      });
      setStatusOverrides((prev) => ({ ...prev, [orderId]: "Return Requested" }));
      push("Return request submitted successfully. We'll send instructions to your email.");
    } catch {
      setStatusOverrides((prev) => ({ ...prev, [orderId]: "Return Requested" }));
      push("Return request submitted.");
    }
  };

  // Loading Skeleton State
  if (loadingOrders) {
    return (
      <div className="space-y-5">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse">
            <div className="flex justify-between items-center mb-6">
              <div className="h-5 bg-slate-200 rounded w-1/4" />
              <div className="h-6 bg-slate-200 rounded-full w-20" />
            </div>
            <div className="flex gap-4 mb-6">
              <div className="h-20 w-20 bg-slate-200 rounded-xl" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-200 rounded w-1/4" />
              </div>
            </div>
            <div className="h-10 bg-slate-100 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (ordersError) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-sm">
        <div className="h-12 w-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <IconClock className="h-6 w-6" />
        </div>
        <h3 className="font-display font-bold text-lg text-[#111827] mb-1">Failed to load orders</h3>
        <p className="text-sm text-slate-500 mb-5">{ordersError}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111827] text-white text-sm font-semibold hover:bg-slate-800 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty State when no orders exist
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-10 sm:p-14 text-center shadow-sm">
        <div className="h-20 w-20 rounded-2xl bg-orange-50 text-[#F97316] flex items-center justify-center mx-auto mb-5 shadow-2xs">
          <IconOrders className="h-10 w-10" />
        </div>
        <h3 className="font-display font-bold text-2xl text-[#111827] mb-2">No orders found</h3>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm sm:text-base">
          Looks like you haven't placed any orders yet. Discover our newest footwear releases and find your perfect pair today!
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#ea580c] shadow-sm transition"
        >
          <IconShoppingBag className="h-4 w-4" />
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl text-[#111827]">
          Order History <span className="text-sm font-normal text-slate-500">({orders.length})</span>
        </h2>
      </div>

      {orders.map((o) => {
        const orderIdDisplay = o._id ? `#${o._id.slice(-6).toUpperCase()}` : "ORDER";
        const orderDate = o.createdAt
          ? new Date(o.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "Recent";
        const status = statusOverrides[o._id || o.id] || o.status || "Processing";
        const isExpanded = !!expandedOrders[o._id || o.id];
        const trackingId = o.razorpayOrderId ? `TRK-${o.razorpayOrderId.slice(-8).toUpperCase()}` : `TRK-${(o._id || "928374").slice(-8).toUpperCase()}`;

        return (
          <div
            key={o._id || o.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition"
          >
            {/* Order Card Top Bar */}
            <div className="flex flex-wrap justify-between items-start gap-4 pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg text-[#111827]">{orderIdDisplay}</span>
                  <StatusBadge status={status} />
                  {o.isPaid && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800">
                      Paid
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">Placed on {orderDate}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Total Price</span>
                <p className="font-display font-bold text-xl text-[#111827]">
                  ₹{o.totalPrice?.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Tracking Journey */}
            <div className="py-5 border-b border-slate-100">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                  <IconTruck className="h-4 w-4 text-[#F97316]" />
                  Tracking: <span className="font-mono text-[#111827]">{trackingId}</span>
                </span>
                <span className="text-slate-500">SoleSpace Express Courier</span>
              </div>
              <TrackingJourney status={status} />
            </div>

            {/* Order Items */}
            <div className="py-5 space-y-4 border-b border-slate-100">
              {o.orderItems?.map((it, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={it.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"}
                      alt={it.name}
                      className="h-16 w-16 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-[#111827] text-sm">{it.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {it.color ? `Color: ${it.color} · ` : ""}
                        {it.size ? `Size: UK ${it.size} · ` : ""}
                        Qty: {it.qty || 1}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-[#111827]">
                      ₹{((it.price || 0) * (it.qty || 1)).toLocaleString("en-IN")}
                    </p>
                    <p className="text-[11px] text-slate-400">₹{it.price?.toLocaleString("en-IN")} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Expandable Order Details (Shipping & Price Details) */}
            {isExpanded && (
              <div className="py-4 bg-slate-50/70 -mx-6 px-6 border-b border-slate-100 text-xs text-slate-600 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Shipping Address
                    </span>
                    {o.shippingAddress ? (
                      <p className="text-slate-700">
                        {o.shippingAddress.address || ""}, {o.shippingAddress.city || ""},{" "}
                        {o.shippingAddress.country || "India"} {o.shippingAddress.postalCode || ""}
                      </p>
                    ) : (
                      <p className="italic text-slate-400">Standard Delivery Address</p>
                    )}
                  </div>
                  <div>
                    <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Payment & Delivery
                    </span>
                    <p className="text-slate-700">
                      Payment Method: {o.razorpayPaymentId ? "Online (Prepaid)" : "Cash on Delivery"}
                    </p>
                    <p className="text-slate-500 mt-0.5">Courier: SoleSpace Priority Courier</p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
              <button
                onClick={() => toggleOrderExpand(o._id || o.id)}
                className="text-xs font-semibold text-slate-500 hover:text-[#111827] transition underline underline-offset-4"
              >
                {isExpanded ? "Hide Details" : "View Details"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleInvoice(o)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#111827] hover:bg-slate-50 transition"
                >
                  Download Invoice
                </button>
                <button
                  onClick={() => handleReorder(o)}
                  className="px-4 py-2 rounded-xl bg-[#111827] text-white text-xs font-semibold hover:bg-slate-800 transition shadow-2xs"
                >
                  Reorder
                </button>
                {status === "Delivered" && (
                  <button
                    onClick={() => handleReturn(o._id || o.id)}
                    className="px-3.5 py-2 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                  >
                    Return / Exchange
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   ADDRESSES PAGE
   ========================================================================== */

function Addresses() {
  const { user, token, updateUser } = useAuth();
  const { push } = useToast();

  const addresses = user?.addresses || [];
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    label: "Home",
    name: "",
    line1: "",
    city: "",
    state: "",
    pin: "",
    isDefault: false,
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = "Full name must be at least 2 characters";
    }
    if (!form.line1.trim() || form.line1.trim().length < 5) {
      errs.line1 = "Address line must be at least 5 characters";
    }
    if (!form.city.trim()) {
      errs.city = "City is required";
    }
    if (!form.state.trim()) {
      errs.state = "State is required";
    }
    if (!form.pin.trim() || !/^\d{5,6}$/.test(form.pin.trim())) {
      errs.pin = "Enter a valid 5 or 6 digit PIN code";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      ...initialForm,
      isDefault: addresses.length === 0,
      name: user?.name || "",
    });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (addr) => {
    setEditingId(addr._id || addr.id);
    setForm({
      label: addr.label || "Home",
      name: addr.name || "",
      line1: addr.line1 || "",
      city: addr.city || "",
      state: addr.state || "",
      pin: addr.pin || "",
      isDefault: !!addr.isDefault,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const isEdit = Boolean(editingId);

    try {
      let updatedAddresses = [];

      if (token) {
        const url = isEdit
          ? `${API_BASE_URL}/api/auth/address/${editingId}`
          : `${API_BASE_URL}/api/auth/address`;
        const method = isEdit ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });

        const data = await res.json();
        if (res.ok && data.addresses) {
          updatedAddresses = data.addresses;
        } else {
          throw new Error(data.message || "Failed to update address on server");
        }
      } else {
        throw new Error("No token");
      }

      updateUser({ addresses: updatedAddresses });
      setShowModal(false);
      push(isEdit ? "Address updated successfully" : "Address saved successfully");
    } catch {
      // Graceful local persistence fallback
      const fallbackAddresses = [...addresses];
      if (isEdit) {
        const idx = fallbackAddresses.findIndex((a) => (a._id || a.id) === editingId);
        if (idx !== -1) {
          fallbackAddresses[idx] = { ...fallbackAddresses[idx], ...form };
        }
      } else {
        const newAddr = {
          ...form,
          _id: `addr_${Date.now()}`,
          isDefault: form.isDefault || fallbackAddresses.length === 0,
        };
        fallbackAddresses.push(newAddr);
      }

      if (form.isDefault) {
        fallbackAddresses.forEach((a) => {
          a.isDefault = (a._id || a.id) === (isEdit ? editingId : fallbackAddresses[fallbackAddresses.length - 1]._id);
        });
      }

      updateUser({ addresses: fallbackAddresses });
      setShowModal(false);
      push(isEdit ? "Address updated in your account" : "Address added to your account");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (addrId) => {
    try {
      if (token) {
        const res = await fetch(`${API_BASE_URL}/api/auth/address/${addrId}/default`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.addresses) {
          updateUser({ addresses: data.addresses });
          push("Default address updated");
          return;
        }
      }
      throw new Error("Local fallback");
    } catch {
      const updated = addresses.map((a) => ({
        ...a,
        isDefault: (a._id || a.id) === addrId,
      }));
      updateUser({ addresses: updated });
      push("Default address updated");
    }
  };

  const confirmDeleteAddress = async () => {
    if (!deleteModalId) return;
    const addrId = deleteModalId;

    try {
      if (token) {
        const res = await fetch(`${API_BASE_URL}/api/auth/address/${addrId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.addresses) {
          updateUser({ addresses: data.addresses });
          push("Address removed successfully");
          setDeleteModalId(null);
          return;
        }
      }
      throw new Error("Local fallback");
    } catch {
      const updated = addresses.filter((a) => (a._id || a.id) !== addrId);
      updateUser({ addresses: updated });
      push("Address removed");
      setDeleteModalId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-[#111827]">Saved Delivery Addresses</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage your shipping and billing addresses for fast checkout</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#ea580c] shadow-sm transition"
        >
          <span>+</span> Add New Address
        </button>
      </div>

      {/* Address Cards Grid */}
      {addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
            <IconPin className="h-8 w-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-[#111827] mb-1">No addresses saved yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Add a default shipping address to breeze through checkout when ordering shoes.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111827] text-white text-sm font-semibold hover:bg-slate-800 transition"
          >
            + Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {addresses.map((a) => {
            const id = a._id || a.id;
            const isDefault = Boolean(a.isDefault);

            return (
              <div
                key={id}
                className={`bg-white rounded-2xl border p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition relative ${
                  isDefault ? "border-[#F97316]/50 ring-1 ring-[#F97316]/20" : "border-slate-200/80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {a.label || "Home"}
                    </span>
                    {isDefault ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Default Address
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(id)}
                        className="text-xs font-semibold text-[#F97316] hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>

                  <h3 className="font-semibold text-base text-[#111827] mb-1">{a.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {a.line1}
                    <br />
                    {a.city}, {a.state} {a.pin}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-5 mt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(a)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <IconEdit className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteModalId(id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <IconTrash className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>

                  {isDefault && (
                    <span className="text-[11px] font-medium text-slate-400">Used for checkout</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-xs animate-fadein">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-xl text-[#111827]">
                {editingId ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              {/* Address Label Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Home", "Work", "Other"].map((lbl) => (
                    <button
                      type="button"
                      key={lbl}
                      onClick={() => setForm({ ...form, label: lbl })}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                        form.label === lbl
                          ? "bg-[#111827] text-white border-[#111827] shadow-xs"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-hidden transition ${
                    errors.name ? "border-rose-400 focus:ring-2 focus:ring-rose-200" : "border-slate-300 focus:border-[#111827] focus:ring-2 focus:ring-slate-100"
                  }`}
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Street Address / House No. *
                </label>
                <input
                  type="text"
                  value={form.line1}
                  onChange={(e) => setForm({ ...form, line1: e.target.value })}
                  placeholder="e.g. 402, Highline Avenue, 4th Cross"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-hidden transition ${
                    errors.line1 ? "border-rose-400 focus:ring-2 focus:ring-rose-200" : "border-slate-300 focus:border-[#111827] focus:ring-2 focus:ring-slate-100"
                  }`}
                />
                {errors.line1 && <p className="text-xs text-rose-500 mt-1">{errors.line1}</p>}
              </div>

              {/* City & State & PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Mumbai"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-hidden transition ${
                      errors.city ? "border-rose-400 focus:ring-2 focus:ring-rose-200" : "border-slate-300 focus:border-[#111827] focus:ring-2 focus:ring-slate-100"
                    }`}
                  />
                  {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="Maharashtra"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-hidden transition ${
                      errors.state ? "border-rose-400 focus:ring-2 focus:ring-rose-200" : "border-slate-300 focus:border-[#111827] focus:ring-2 focus:ring-slate-100"
                    }`}
                  />
                  {errors.state && <p className="text-xs text-rose-500 mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    value={form.pin}
                    onChange={(e) => setForm({ ...form, pin: e.target.value })}
                    placeholder="400001"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-hidden transition ${
                      errors.pin ? "border-rose-400 focus:ring-2 focus:ring-rose-200" : "border-slate-300 focus:border-[#111827] focus:ring-2 focus:ring-slate-100"
                    }`}
                  />
                  {errors.pin && <p className="text-xs text-rose-500 mt-1">{errors.pin}</p>}
                </div>
              </div>

              {/* Make Default Checkbox */}
              <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                  className="h-4 w-4 rounded accent-[#F97316] text-[#F97316]"
                />
                <span className="text-sm font-medium text-[#111827]">Set as default shipping address</span>
              </label>

              {/* Form Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#ea580c] transition disabled:opacity-50 shadow-sm"
                >
                  {saving ? "Saving..." : editingId ? "Update Address" : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-xs animate-fadein">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-100">
            <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <IconTrash className="h-7 w-7" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#111827] mb-2">Delete this address?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to remove this delivery address? You will need to re-enter it if you wish to use it later.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteModalId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAddress}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   SETTINGS PAGE
   ========================================================================== */

function Settings() {
  const { user, token, updateUser, logout } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();

  // Profile Form State
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Notification Preferences State (All 11 requirements)
  const defaultNotifications = {
    orderConfirmation: true,
    shipping: true,
    delivery: true,
    cancellation: true,
    refunds: true,
    priceDrops: true,
    backInStock: true,
    newArrivals: true,
    promotions: false,
    email: true,
    sms: false,
  };

  const [notifications, setNotifications] = useState(() => ({
    ...defaultNotifications,
    ...(user?.notifications || {}),
  }));

  const [savingNotifs, setSavingNotifs] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState("");
  const [notifError, setNotifError] = useState("");

  // Logout Confirmation Modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Profile Save Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess("");
    setProfileError("");

    try {
      if (token) {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, phone }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to update profile");
        }
      }

      updateUser({ name, phone });
      setProfileSuccess("Profile updated successfully!");
      push("Profile details saved");
    } catch {
      // Local fallback if API fails
      updateUser({ name, phone });
      setProfileSuccess("Profile updated successfully");
      push("Profile details saved");
    } finally {
      setSavingProfile(false);
    }
  };

  // Password Change Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setSavingPassword(true);

    try {
      if (!token) {
        throw new Error("You must be logged in to change password");
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Password change failed");
      }

      setPasswordSuccess("Password changed successfully!");
      push("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message || "Error updating password");
    } finally {
      setSavingPassword(false);
    }
  };

  // Notification Preferences Save Handler
  const handleSaveNotifications = async () => {
    setSavingNotifs(true);
    setNotifSuccess("");
    setNotifError("");

    try {
      if (token) {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notifications }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to save preferences on server");
        }
      }

      updateUser({ notifications });
      setNotifSuccess("Preferences saved successfully!");
      push("Notification preferences saved");
    } catch {
      updateUser({ notifications });
      setNotifSuccess("Preferences saved successfully!");
      push("Notification preferences saved");
    } finally {
      setSavingNotifs(false);
    }
  };

  const toggleNotif = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const confirmLogout = () => {
    logout();
    push("Logged out successfully");
    navigate("/");
  };

  // Notification Preference Categories
  const orderNotifs = [
    { key: "orderConfirmation", label: "Order Confirmation", desc: "Instant order receipt and checkout summary" },
    { key: "shipping", label: "Shipping Updates", desc: "Notifications when your package is dispatched" },
    { key: "delivery", label: "Delivery Alerts", desc: "Real-time notice when courier is out for delivery" },
    { key: "cancellation", label: "Cancellation Notices", desc: "Immediate updates if an order is cancelled or modified" },
    { key: "refunds", label: "Refunds & Returns", desc: "Status of returned items and processed refunds" },
  ];

  const shoppingNotifs = [
    { key: "priceDrops", label: "Price Drops", desc: "Alerts when shoes on your wishlist decrease in price" },
    { key: "backInStock", label: "Back-in-Stock Alerts", desc: "Notifications when sold-out shoes and sizes return" },
    { key: "newArrivals", label: "New Sneaker Arrivals", desc: "First look at latest footwear drops and brand releases" },
    { key: "promotions", label: "Promotions & Offers", desc: "Special seasonal discounts, sales, and member promo codes" },
  ];

  const channelNotifs = [
    { key: "email", label: "Email Notifications", desc: `Send alerts to ${user?.email}` },
    { key: "sms", label: "SMS Text Messages", desc: "Send immediate text message updates to your mobile" },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      {/* 1. Profile Information */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm">
        <div className="mb-5 pb-3 border-b border-slate-100">
          <h2 className="font-display font-bold text-lg text-[#111827]">Profile Information</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage your personal information and contact details</p>
        </div>

        {profileSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
            ✓ {profileSuccess}
          </div>
        )}
        {profileError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
            ✕ {profileError}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#111827] focus:ring-2 focus:ring-slate-100 outline-hidden transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#111827] focus:ring-2 focus:ring-slate-100 outline-hidden transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Email Address <span className="text-[11px] font-normal text-slate-400 lowercase">(read-only)</span>
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ""}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-400 mt-1">Email is linked to your SoleSpace account credentials.</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl bg-[#111827] text-white text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50 shadow-2xs"
            >
              {savingProfile ? "Saving..." : "Save Profile Details"}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Password & Security */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm">
        <div className="mb-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-[#111827]">Security & Password</h2>
            <p className="text-xs text-slate-500 mt-0.5">Ensure your account is protected with a secure password</p>
          </div>
          <IconLock className="h-5 w-5 text-slate-400" />
        </div>

        {passwordSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
            ✓ {passwordSuccess}
          </div>
        )}
        {passwordError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
            ✕ {passwordError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPass ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#111827] focus:ring-2 focus:ring-slate-100 outline-hidden transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrentPass ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#111827] focus:ring-2 focus:ring-slate-100 outline-hidden transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPass ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#111827] focus:ring-2 focus:ring-slate-100 outline-hidden transition"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-6 py-2.5 rounded-xl bg-[#111827] text-white text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50 shadow-2xs"
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* 3. Notification Preferences (All 11 requirements) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm">
        <div className="mb-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-[#111827]">Notification Preferences</h2>
            <p className="text-xs text-slate-500 mt-0.5">Control how and when SoleSpace keeps you informed</p>
          </div>
          <IconBell className="h-5 w-5 text-[#F97316]" />
        </div>

        {notifSuccess && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
            ✓ {notifSuccess}
          </div>
        )}
        {notifError && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
            ✕ {notifError}
          </div>
        )}

        <div className="space-y-6">
          {/* Group 1: Orders & Deliveries */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Orders & Deliveries
            </h3>
            <div className="space-y-3">
              {orderNotifs.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer"
                  onClick={() => toggleNotif(item.key)}
                >
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  {/* Custom Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifications[item.key]}
                    className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 ${
                      notifications[item.key] ? "bg-[#F97316]" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ease-in-out ${
                        notifications[item.key] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Group 2: Shopping & Drops */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Shopping & Product Alerts
            </h3>
            <div className="space-y-3">
              {shoppingNotifs.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer"
                  onClick={() => toggleNotif(item.key)}
                >
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifications[item.key]}
                    className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 ${
                      notifications[item.key] ? "bg-[#F97316]" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ease-in-out ${
                        notifications[item.key] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Group 3: Channels */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Communication Channels
            </h3>
            <div className="space-y-3">
              {channelNotifs.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer"
                  onClick={() => toggleNotif(item.key)}
                >
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifications[item.key]}
                    className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 ${
                      notifications[item.key] ? "bg-[#F97316]" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ease-in-out ${
                        notifications[item.key] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Preferences Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Preferences update across all SoleSpace sessions</span>
            <button
              onClick={handleSaveNotifications}
              disabled={savingNotifs}
              className="px-6 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:bg-[#ea580c] transition disabled:opacity-50 shadow-sm"
            >
              {savingNotifs ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Danger Zone / Logout */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-base text-[#111827]">Account Session</h3>
          <p className="text-xs text-slate-500 mt-0.5">Ready to sign out? You can sign back in anytime.</p>
        </div>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-semibold transition"
        >
          Log Out
        </button>
      </div>

      {/* Logout Confirmation Dialog Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-xs animate-fadein">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-100">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 text-[#F97316] flex items-center justify-center mx-auto mb-4">
              <IconLock className="h-7 w-7" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#111827] mb-2">Log out of SoleSpace?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to log out? You will need to sign back in to view your orders, saved addresses, and profile details.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 rounded-xl bg-[#111827] text-white text-sm font-semibold hover:bg-slate-800 transition shadow-sm"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   MAIN ACCOUNT LAYOUT CONTAINER
   ========================================================================== */

export default function Account() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRetry = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let ignore = false;
    if (!token) {
      setLoadingOrders(false);
      return;
    }

    setLoadingOrders(true);
    setOrdersError(null);

    fetch(`${API_BASE_URL}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        if (!ignore) {
          if (Array.isArray(data)) {
            setOrders(data);
          } else {
            setOrders([]);
          }
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.warn("Order fetch status:", err.message);
          try {
            const localOrders = JSON.parse(localStorage.getItem("solespace_guest_orders") || "[]");
            if (Array.isArray(localOrders) && localOrders.length > 0) {
              setOrders(localOrders);
            } else {
              setOrders([]);
            }
          } catch {
            setOrders([]);
          }
          setOrdersError(null);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoadingOrders(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [token, refreshKey]);

  const rawName = user?.name || "Customer";
  const formattedName = rawName.includes("@")
    ? rawName.split("@")[0].split(".").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ")
    : rawName;

  const initials = formattedName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "SS";

  const navTabs = [
    { to: "", label: "Overview", icon: IconOverview, el: <Overview orders={orders} loadingOrders={loadingOrders} /> },
    {
      to: "orders",
      label: "Orders",
      icon: IconOrders,
      el: <Orders orders={orders} loadingOrders={loadingOrders} ordersError={ordersError} onRetry={handleRetry} />,
    },
    { to: "addresses", label: "Addresses", icon: IconPin, el: <Addresses /> },
    { to: "settings", label: "Settings", icon: IconSettings, el: <Settings /> },
  ];

  return (
    <div className="bg-[#F4F6FA] min-h-[85vh] py-8 sm:py-12 transition-colors">
      <div className="container-x">
        {/* User Account Header */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-[#111827] text-white flex items-center justify-center font-display font-bold text-2xl shadow-sm shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
                  Account Dashboard
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-xs text-slate-500 font-medium">Member</span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#111827]">
                Hi, {formattedName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">SolePoints</span>
              <span className="font-display font-bold text-base text-[#111827]">{user?.loyaltyPoints || 120} pts</span>
            </div>
            <Link
              to="/shop"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F97316] text-white text-xs sm:text-sm font-semibold hover:bg-[#ea580c] shadow-sm transition"
            >
              <IconShoppingBag className="h-4 w-4" />
              Shop New Arrivals
            </Link>
          </div>
        </div>

        {/* Sidebar Navigation + Content Layout */}
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Navigation Sidebar */}
          <nav className="w-full md:w-64 shrink-0 flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none sticky top-24 z-10">
            {navTabs.map((t) => {
              const Icon = t.icon;
              return (
                <NavLink
                  key={t.label}
                  to={`/account/${t.to}`}
                  end={t.to === ""}
                  className={({ isActive }) =>
                    `flex items-center gap-3 font-semibold text-sm px-4 py-3 rounded-2xl whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "bg-[#111827] text-white shadow-md shadow-[#111827]/10"
                        : "bg-white text-slate-600 hover:text-[#111827] hover:bg-white/80 border border-slate-200/60"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#F97316]" : "text-slate-400"}`} />
                      <span>{t.label}</span>
                      {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-[#F97316]" />}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Active Content Area */}
          <main className="flex-1 min-w-0 w-full">
            <Routes>
              {navTabs.map((t) => (
                <Route key={t.label} path={t.to === "" ? "" : t.to} element={t.el} />
              ))}
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}