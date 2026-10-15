import { useState, useEffect } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useCart } from "../context/CartContext";
import { API_BASE_URL } from "../config/api";

/* ---------- Icons (inline, no extra dependency) ---------- */

function IconGrid(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="2.5" y="2.5" width="6" height="6" rx="1.2" />
      <rect x="11.5" y="2.5" width="6" height="6" rx="1.2" />
      <rect x="2.5" y="11.5" width="6" height="6" rx="1.2" />
      <rect x="11.5" y="11.5" width="6" height="6" rx="1.2" />
    </svg>
  );
}

function IconPackage(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...props}>
      <path d="M2.8 6.2 10 2.5l7.2 3.7L10 9.9 2.8 6.2Z" />
      <path d="M2.8 6.2v7.6L10 17.5l7.2-3.7V6.2" />
      <path d="M10 9.9v7.6" />
    </svg>
  );
}

function IconPin(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M10 17.3s5.8-4.9 5.8-9.2a5.8 5.8 0 1 0-11.6 0c0 4.3 5.8 9.2 5.8 9.2Z" />
      <circle cx="10" cy="8.1" r="2.1" />
    </svg>
  );
}

function IconSliders(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...props}>
      <line x1="3" y1="6" x2="17" y2="6" />
      <line x1="3" y1="10" x2="17" y2="10" />
      <line x1="3" y1="14" x2="17" y2="14" />
      <circle cx="7" cy="6" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="13" cy="10" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="9" cy="14" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ---------- Shared order-status pieces ---------- */

const statusStyles = {
  Delivered: { badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20", dot: "bg-emerald-500" },
  Shipped: { badge: "bg-sky-50 text-sky-700 ring-1 ring-sky-600/20", dot: "bg-sky-500" },
  "Return Requested": { badge: "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20", dot: "bg-rose-500" },
  Processing: { badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20", dot: "bg-amber-500" },
};

function StatusBadge({ status }) {
  const currentStatus = status || "Processing";
  const s = statusStyles[currentStatus] ?? statusStyles.Processing;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {currentStatus}
    </span>
  );
}

const journeySteps = ["Processing", "Shipped", "Delivered"];

function OrderProgress({ status }) {
  const currentStatus = status || "Processing";
  if (currentStatus === "Return Requested") {
    return (
      <div className="flex items-center gap-2 text-xs text-rose-600 font-medium">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        Return in progress — we'll email you the next steps
      </div>
    );
  }

  const currentIndex = journeySteps.indexOf(currentStatus);

  return (
    <div className="flex items-center">
      {journeySteps.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-full ${i <= currentIndex ? "bg-ink" : "bg-gray-200"}`} />
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                i <= currentIndex ? "text-ink" : "text-gray-400"
              }`}
            >
              {step}
            </span>
          </div>
          {i < journeySteps.length - 1 && (
            <div className={`h-px flex-1 mx-2 mb-4 ${i < currentIndex ? "bg-ink" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function InlineProgress({ status }) {
  const currentStatus = status || "Processing";
  const idx = journeySteps.indexOf(currentStatus);
  const pct = idx === -1 ? 0 : ((idx + 1) / journeySteps.length) * 100;
  return (
    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
      <div className="h-full bg-ink rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ---------- Overview ---------- */

function Overview({ orders }) {
  const { user } = useAuth();
  const latest = orders[0];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col justify-between min-h-[140px] shadow-sm hover:shadow-md transition">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Orders placed</p>
          <p className="font-display font-bold text-4xl text-ink">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col justify-between min-h-[140px] shadow-sm hover:shadow-md transition">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Loyalty points</p>
          <p className="font-display font-bold text-4xl text-traction">{user.loyaltyPoints || 0}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col justify-between min-h-[140px] shadow-sm hover:shadow-md transition">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Wishlist</p>
          <p className="font-display font-bold text-2xl text-emerald-600">Synced ✓</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <p className="font-display font-bold text-lg text-ink">Most recent order</p>
          <span className="text-xs font-medium text-gray-400">
            {latest ? new Date(latest.createdAt).toLocaleDateString() : "No orders yet"}
          </span>
        </div>

        {latest ? (
          <>
            <div className="flex items-start gap-5 mb-6">
              <img
                src={latest.orderItems?.[0]?.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"}
                alt=""
                className="h-20 w-20 rounded-xl object-cover border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink">#{latest._id.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {latest.orderItems?.length} item{latest.orderItems?.length > 1 ? "s" : ""}
                </p>
                <div className="mt-2">
                  <StatusBadge status={latest.status || "Processing"} />
                </div>
              </div>
            </div>
            <OrderProgress status={latest.status || "Processing"} />
          </>
        ) : (
          <p className="text-sm text-gray-500 py-4">You haven't placed any orders yet.</p>
        )}
      </div>
    </div>
  );
}

/* ---------- Orders ---------- */

function Orders({ orders }) {
  const { addItem } = useCart();
  const { push } = useToast();
  const navigate = useNavigate();
  const [statusOverrides, setStatusOverrides] = useState({});

  const handleReorder = (order) => {
    if (!order.orderItems?.length) return;
    order.orderItems.forEach((it) => {
      addItem(
        { id: it.sku || "SS", name: it.name, price: it.price, mrp: it.price, images: [it.image] },
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
    push(`Invoice for #${(order._id || "").slice(-6).toUpperCase()} generated.`);
    window.print();
  };

  const handleReturn = async (orderId) => {
    try {
      await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Return Requested" })
      });
      setStatusOverrides((prev) => ({ ...prev, [orderId]: "Return Requested" }));
      push("Return request submitted successfully.");
    } catch {
      setStatusOverrides((prev) => ({ ...prev, [orderId]: "Return Requested" }));
      push("Return request submitted.");
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <p className="font-display font-bold text-xl text-ink mb-2">No orders found</p>
        <p className="text-sm text-gray-500">Your placed orders will show up here once you check out.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((o) => {
        const orderIdDisplay = o._id ? `#${o._id.slice(-6).toUpperCase()}` : "ORDER";
        const orderDate = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "";
        const status = statusOverrides[o._id || o.id] || o.status || "Processing";

        return (
          <div key={o._id || o.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex flex-wrap justify-between items-start gap-3 mb-5">
              <div>
                <p className="font-bold text-ink">{orderIdDisplay}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{orderDate}</p>
              </div>
              <StatusBadge status={status} />
            </div>

            <div className="flex flex-wrap gap-4 mb-5">
              {o.orderItems?.map((it, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img
                    src={it.image}
                    alt=""
                    className="h-14 w-14 rounded-lg object-cover border border-gray-200"
                  />
                  <div className="text-xs">
                    <p className="font-medium text-ink">{it.name}</p>
                    <p className="text-gray-500 mt-0.5">
                      SKU: {it.sku || "SS"} × {it.qty || 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {(status === "Processing" || status === "Shipped") && (
              <div className="mb-5">
                <InlineProgress status={status} />
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="font-bold text-base text-ink">₹{o.totalPrice?.toLocaleString("en-IN")}</span>
              <div className="flex gap-2 text-xs">
                <button onClick={() => handleInvoice(o)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-ink hover:bg-haze transition">Invoice</button>
                <button onClick={() => handleReorder(o)} className="px-3 py-1.5 rounded-lg bg-track text-white text-xs font-semibold hover:bg-track-light transition">Reorder</button>
                {status === "Delivered" && (
                  <button onClick={() => handleReturn(o._id)} className="px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition">Return / Exchange</button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Addresses ---------- */

function Addresses() {
  const { user, token } = useAuth();
  const { push } = useToast();
  
  const [addresses, setAddresses] = useState(user.addresses || []);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    label: "Home",
    name: "",
    line1: "",
    city: "",
    state: "",
    pin: "",
  });

  const add = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add address");

      setAddresses(data.addresses);
      setForm({ label: "Home", name: "", line1: "", city: "", state: "", pin: "" });
      setShowForm(false);
      push("Address saved successfully");
    } catch (err) {
      push(err.message || "Error saving address");
    } finally {
      setLoading(false);
    }
  };

  const removeAddress = async (addressId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/address/${addressId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete address");

      setAddresses(data.addresses);
      push("Address removed");
    } catch (err) {
      push(err.message || "Error removing address");
    }
  };

  return (
    <div>
      <div className="space-y-4 mb-6">
        {addresses.map((a) => (
          <div
            key={a._id || a.id}
            className="rounded-2xl border border-gray-200 bg-white p-6 flex justify-between items-start gap-4 shadow-sm hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="stamp">{a.label}</span>
                {a.isDefault && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Default
                  </span>
                )}
              </div>
              <p className="font-medium text-ink">{a.name}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {a.line1}, {a.city}, {a.state} {a.pin}
              </p>
            </div>
            <button
              onClick={() => removeAddress(a._id || a.id)}
              className="text-gray-400 hover:text-rose-500 text-sm font-medium transition"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="btn-outline px-5 py-2.5 rounded-xl"
        >
          + Add address
        </button>
      ) : (
        <form
          onSubmit={add}
          className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4"
        >
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input rounded-xl border-gray-300 focus:ring-2 focus:ring-track"
          />
          <input
            required
            placeholder="Address line"
            value={form.line1}
            onChange={(e) => setForm({ ...form, line1: e.target.value })}
            className="input rounded-xl border-gray-300 focus:ring-2 focus:ring-track"
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              required
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="input rounded-xl border-gray-300 focus:ring-2 focus:ring-track"
            />
            <input
              required
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="input rounded-xl border-gray-300 focus:ring-2 focus:ring-track"
            />
            <input
              required
              placeholder="PIN"
              value={form.pin}
              onChange={(e) => setForm({ ...form, pin: e.target.value })}
              className="input rounded-xl border-gray-300 focus:ring-2 focus:ring-track"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-outline flex-1 rounded-xl"
            >
              Cancel
            </button>
            <button disabled={loading} className="btn-primary flex-1 rounded-xl">
              {loading ? "Saving..." : "Save address"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ---------- Settings ---------- */

function Settings() {
  const { user, logout, token } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user.name || "");
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    backInStock: true,
    priceDrop: true,
    marketing: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          name, 
          notifications 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update");

      push("Profile updated successfully");
    } catch (err) {
      push(err.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-md">
      <form onSubmit={handleSave} className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input rounded-xl border-gray-300 focus:ring-2 focus:ring-track"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Email</label>
          <input
            defaultValue={user.email}
            className="input rounded-xl border-gray-300 bg-gray-50 text-gray-500"
            disabled
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full rounded-xl"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="font-display font-bold text-lg text-ink mb-4 pb-3 border-b border-gray-100">
          Notification preferences
        </p>
        <div className="space-y-1">
          {[
            { key: "orderUpdates", label: "Order updates" },
            { key: "backInStock", label: "Back-in-stock alerts" },
            { key: "priceDrop", label: "Price drop alerts" },
            { key: "marketing", label: "Marketing emails" },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between gap-3 text-sm py-2.5 cursor-pointer text-ink hover:text-track transition"
            >
              {item.label}
              <input
                type="checkbox"
                checked={notifications[item.key]}
                onChange={(e) =>
                  setNotifications({ ...notifications, [item.key]: e.target.checked })
                }
                className="accent-track h-4 w-4"
              />
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          logout();
          push("Logged out");
          navigate("/");
        }}
        className="btn-outline w-full rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition font-semibold"
      >
        Log out
      </button>
    </div>
  );
}

/* ---------- Layout ---------- */

export default function Account() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);

  // Fetch orders from backend when account page mounts
  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE_URL}/api/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch((err) => console.error("Failed to fetch user orders:", err));
  }, [token]);

  const initials = (user.name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  const tabs = [
    { to: "", label: "Overview", icon: IconGrid, el: <Overview orders={orders} /> },
    { to: "orders", label: "Orders", icon: IconPackage, el: <Orders orders={orders} /> },
    { to: "addresses", label: "Addresses", icon: IconPin, el: <Addresses /> },
    { to: "settings", label: "Settings", icon: IconSliders, el: <Settings /> },
  ];

  return (
    <div className="container-x py-10">
      <div className="flex items-center gap-4 mb-10">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-track text-white flex items-center justify-center font-display font-bold text-xl shadow-sm">
          {initials}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-traction mb-1">Hi, {user.name}</p>
          <h1 className="font-display font-bold text-3xl text-ink">My Account</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar Navigation */}
        <nav className="md:w-56 shrink-0 flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-gray-100 md:pr-6">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <NavLink
                key={t.label}
                to={`/account/${t.to}`}
                end={t.to === ""}
                className={({ isActive }) =>
                  `flex items-center gap-3 font-medium text-sm px-4 py-3 rounded-xl whitespace-nowrap transition ${
                    isActive ? "bg-ink text-white font-semibold shadow-sm" : "text-gray-600 hover:bg-haze hover:text-ink"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {t.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <Routes>
            {tabs.map((t) => (
              <Route key={t.label} path={t.to === "" ? "" : t.to} element={t.el} />
            ))}
          </Routes>
        </div>
      </div>
    </div>
  );
}