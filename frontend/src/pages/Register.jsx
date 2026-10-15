 import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { push } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    const result = await register(form.name, form.email, form.phone, form.password);
    if (result.ok) {
      push("Account created successfully");
      navigate("/login");
    } else {
      push(result.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* Left Branding Panel */}
        <div
          className="hidden md:flex flex-col justify-center p-12 text-white"
          style={{
            background:
              "linear-gradient(135deg, #0B1F4D 0%, #142F73 60%, #FF6B1A 100%)",
          }}
        >
          <p className="uppercase tracking-[0.35em] text-sm mb-4">
            SOLESPACE
          </p>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Join
            <br />
            SoleSpace
          </h1>

          <p className="text-lg text-white/90 leading-relaxed">
            Create your account to save addresses, sync your wishlist,
            track orders, and enjoy a personalized shopping experience.
          </p>

          <div className="mt-10 space-y-3 text-white/85">
            <p>✓ Faster Checkout</p>
            <p>✓ Wishlist Sync</p>
            <p>✓ Order Tracking</p>
            <p>✓ Exclusive Collections</p>
          </div>
        </div>

        {/* Register Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <p className="uppercase tracking-[0.3em] text-xs text-gray-500 mb-2">
            Registration is Optional
          </p>

          <h2 className="text-4xl font-bold text-slate-900 mb-2">
            Create Account
          </h2>

          <p className="text-gray-500 mb-8">
            Sign up and unlock a better shopping experience.
          </p>

          <form onSubmit={submit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>

              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="9876543210"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                required
                type="password"
                minLength={8}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Minimum 8 characters"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full text-white py-3 rounded-xl font-semibold transition hover:opacity-90"
              style={{ backgroundColor: "#FF6B1A" }}
            >
              Create Account
            </button>

            <div className="relative py-2">
              <div className="border-t border-gray-300"></div>

              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
                OR CONTINUE WITH
              </span>
            </div>

            {/* Google Button UI */}
            <button
              type="button"
              onClick={() => push("Google Sign-In is disabled in demo mode. Please register with your details.")}
              className="w-full border border-gray-300 rounded-xl py-3 px-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="22"
                height="22"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 15.3 18.9 12 24 12c3 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.4C9.7 38.8 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6.1 7.1l6.3 5.3C39.3 37.1 44 31.1 44 24c0-1.3-.1-2.4-.4-3.5z"
                />
              </svg>

              <span className="font-medium">
                Continue with Google
              </span>
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold hover:underline"
              style={{ color: "#FF6B1A" }}
            >
              Sign In
            </Link>
          </p>

          <p className="mt-3 text-center text-sm">
            <Link
              to="/shop"
              className="text-gray-700 hover:text-orange-600"
            >
              Continue as Guest →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}