import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#1a146b",
          container: "#312e81",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#0051d5",
          container: "#316bf3",
          foreground: "#ffffff",
        },
        tertiary: {
          DEFAULT: "#3e1a00",
        },
        destructive: {
          DEFAULT: "#ba1a1a",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f3f4f6",
          foreground: "#6b7280",
        },
        accent: {
          DEFAULT: "#f3f4f6",
          foreground: "#1a146b",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#252525",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#252525",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "2rem",
      },
      boxShadow: {
        ambient: "0 12px 34px -10px rgba(15, 23, 42, 0.08)",
        premium: "0 4px 20px -2px rgba(14, 16, 61, 0.05)",
        glow: "0 0 20px rgba(37, 99, 235, 0.2)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
