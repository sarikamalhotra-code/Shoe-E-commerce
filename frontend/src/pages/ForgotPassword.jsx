import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { push } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setSubmitted(true);
    push(`Password reset link sent to ${identifier}`);
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 md:p-10">
        <Link to="/login" className="inline-flex items-center text-sm font-semibold text-graphite hover:text-ink mb-6">
          ← Back to Sign In
        </Link>

        <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Reset Password</h1>
        <p className="text-gray-500 text-sm mb-6">
          Enter your registered email address or mobile number. We'll send you instructions to reset your password.
        </p>

        {submitted ? (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h3 className="font-semibold text-emerald-900">Reset Link Sent</h3>
            <p className="text-xs text-emerald-700">
              We've dispatched password reset instructions to <span className="font-semibold">{identifier}</span>. Please check your inbox or SMS.
            </p>
            <Link to="/login" className="btn-primary !w-full inline-block mt-4 text-center">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email or Mobile Number
              </label>
              <input
                required
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com or mobile"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="btn-accent w-full py-3 rounded-xl font-semibold text-white transition hover:opacity-95"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
