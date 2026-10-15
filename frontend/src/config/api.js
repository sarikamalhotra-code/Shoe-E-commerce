// SoleSpace API Configuration
// In local development: defaults to http://localhost:5000
// In production (e.g. Vercel): set VITE_API_BASE_URL to your deployed backend URL (Render, Railway, Fly.io, etc.)
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default API_BASE_URL;
