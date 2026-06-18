import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Dark crypto-feel palette that also reads well inside Telegram
        bg: { 900: "#0a0b0f", 800: "#11131a", 700: "#181b25" },
        line: "#1f2330",
        accent: { 500: "#3b82f6", 600: "#2563eb" },
        // Polymarket YES/NO
        yes: "#10b981",
        no: "#ef4444",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-soft": "pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
