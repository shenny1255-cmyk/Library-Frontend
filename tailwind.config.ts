import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#EDEAE1",
        surface: "#FFFFFF",
        ink: "#22252A",
        muted: "#6E6A5F",
        forest: {
          DEFAULT: "#26433A",
          light: "#345B4E",
          dark: "#1A2F29",
        },
        brass: {
          DEFAULT: "#A47C3B",
          light: "#C79A54",
          dark: "#815F2A",
        },
        stamp: {
          red: "#8B3A3A",
        },
        line: "#DAD5C6",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(34, 37, 42, 0.06), 0 4px 12px rgba(34, 37, 42, 0.05)",
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
export default config;