import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#11131a",
        paper: "#f6f7fb",
        mist: "#e9edf5",
        ocean: "#0f766e",
        coral: "#f97316",
        violet: "#7c3aed"
      },
      boxShadow: {
        glow: "0 24px 90px rgba(21, 26, 42, 0.16)",
        card: "0 18px 50px rgba(31, 41, 55, 0.10)"
      },
      opacity: {
        6: "0.06",
        8: "0.08",
        12: "0.12",
        15: "0.15",
        18: "0.18",
        36: "0.36",
        42: "0.42",
        44: "0.44",
        52: "0.52",
        55: "0.55",
        56: "0.56",
        58: "0.58",
        62: "0.62",
        66: "0.66",
        68: "0.68",
        72: "0.72",
        76: "0.76",
        78: "0.78"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;
