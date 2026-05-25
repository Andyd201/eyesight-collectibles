/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Base surfaces
        bg:        "#07070F",
        surface:   "#0E0E1A",
        "surface-2": "#15152A",
        "surface-3": "#1E1E35",
        border:    "#2A2A4A",

        // Neon accents
        neon:      "#7C3AED",       // electric purple (primary)
        "neon-2":  "#06B6D4",       // cyan
        gold:      "#FBBF24",       // Pokémon gold
        "gold-2":  "#F59E0B",

        // Text
        muted:     "#6B7280",
        subtle:    "#9CA3AF",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "Impact", "sans-serif"],
        body:    ["'Inter'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "glass": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        "neon-glow": "radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)",
        "hero-gradient": "linear-gradient(135deg, #07070F 0%, #0E0E1A 50%, #07070F 100%)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)",
      },
      boxShadow: {
        "neon":    "0 0 20px rgba(124,58,237,0.4), 0 0 60px rgba(124,58,237,0.15)",
        "neon-sm": "0 0 10px rgba(124,58,237,0.3)",
        "gold":    "0 0 20px rgba(251,191,36,0.4)",
        "glass":   "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        "card":    "0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset",
      },
      animation: {
        "fade-up":    "fadeUp 0.5s ease forwards",
        "shimmer":    "shimmer 2s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "float":      "float 6s ease-in-out infinite",
        "glow":       "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        glow: {
          "0%":   { boxShadow: "0 0 10px rgba(124,58,237,0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(124,58,237,0.7), 0 0 60px rgba(124,58,237,0.3)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
