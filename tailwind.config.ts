import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        nrfa: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#064e3b",
          950: "#022c22",
        },
        zambia: {
          green: "#064e3b",
          greenHover: "#047857",
          emerald: "#059669",
          red: "#dc2626",
          black: "#0f172a",
          orange: "#ea580c",
          gold: "#d97706",
          goldLight: "#fef3c7",
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)",
        elevation: "0 10px 25px -5px rgba(6, 78, 59, 0.15), 0 8px 10px -6px rgba(6, 78, 59, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
