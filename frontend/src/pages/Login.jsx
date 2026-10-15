 import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const { user, login, googleLogin, logout } = useAuth();
  const navigate = useNavigate();
  const { push } = useToast();

  const [identifier, setIdentifier] = useState(""); // Can be email or phone
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const result = await login(identifier, password);
    if (result.ok) {
      push("Logged in successfully");
      navigate("/account");
    } else {
      push(result.message || "Login failed");
    }
  };

  const handleLogout = () => {
    logout();
    push("Logged out successfully");
    navigate("/");
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
          <p className="uppercase tracking-[0.35em] text-sm mb-4">SOLESPACE</p>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Premium <br /> Footwear <br /> For Every Journey
          </h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Discover trending sneakers, running shoes, casual wear and
            exclusive collections from top brands.
          </p>
          <div className="mt-10 space-y-3 text-white/85">
            <p>✓ Premium Brands</p>
            <p>✓ Secure Checkout</p>
            <p>✓ Fast Delivery</p>
            <p>✓ Exclusive Collections</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          {!user ? (
            <>
              <p className="uppercase tracking-[0.3em] text-xs text-gray-500 mb-2">
                Welcome Back
              </p>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Sign In</h2>
              <p className="text-gray-500 mb-8">
                Continue shopping with your SoleSpace account.
              </p>

              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email or Mobile
                  </label>
                  <input
                    required
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="you@example.com or mobile number"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm hover:underline"
                      style={{ color: "#FF6B1A" }}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-600">
                    <input type="checkbox" />
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full text-white py-3 rounded-xl font-semibold transition hover:opacity-90"
                  style={{ backgroundColor: "#FF6B1A" }}
                >
                  Sign In
                </button>

                <div className="relative py-2">
                  <div className="border-t border-gray-300"></div>
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
                    OR CONTINUE WITH
                  </span>
                </div>

                {/* Google Login */}
               {/* Google Login */}
              <div className="flex justify-center">
                <GoogleLogin onSuccess={async (credentialResponse) => {
                  if (!credentialResponse.credential) {
                    push("Google credential was not received. Please try again.");
                    return;
                  }

      const result = await googleLogin(credentialResponse.credential);
      if (result.ok) {
        push("Google login successful!");
        navigate("/account");
      } else {
        push(result.message || "Google login failed");
      }
    }}
    onError={() => {
      push("Google Sign-In failed. Please try again.");
    }}
    text="continue_with" shape="rectangular" width="350"/>
    </div>
              </form>

              <p className="mt-8 text-center text-sm text-gray-600">
                New here?{" "}
                <Link
                  to="/register"
                  className="font-semibold hover:underline"
                  style={{ color: "#FF6B1A" }}
                >
                  Create an account
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
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome, {user.name || user.email}
              </h2>
              <p className="text-gray-500 mb-6">You are already logged in.</p>
              
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => navigate("/account")}
                  className="w-full text-white py-3 rounded-xl font-semibold transition hover:opacity-90"
                  style={{ backgroundColor: "#FF6B1A" }}
                >
                  Go to Account Page
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-white py-3 rounded-xl font-semibold transition hover:opacity-90"
                  style={{ backgroundColor: "#142F73" }}
                >
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}