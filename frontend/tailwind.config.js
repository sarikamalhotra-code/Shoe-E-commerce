/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F6FA",
        chalk: "#FFFFFF",
        ink: "#131A2C",
        track: {
          DEFAULT: "#0B1B3D",
          light: "#16294F",
          dark: "#060F24",
        },
        traction: "#FF6B1A",
        cone: "#FF6B1A",
        sale: "#E8402B",
        graphite: "#6B7280",
        haze: "#EEF0F6",
        star: "#FFB800",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        card: "0 2px 10px rgba(11,27,61,0.06)",
        cardHover: "0 12px 28px rgba(11,27,61,0.14)",
        stamp: "0 2px 0 0 rgba(20,24,31,1)",
      },
    },
  },
  plugins: [],
};
