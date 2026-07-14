import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "display": ["56px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "h1": ["40px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "h2": ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        "h3": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "label": ["14px", { lineHeight: "1.4", fontWeight: "500" }],
        "display-lg": ["64px", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "700" }],
        "headline-lg": ["40px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg-mobile": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "label-md": ["14px", { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "500" }]
      },
      spacing: {

        "gutter": "24px",
        "base": "4px",
        "md": "24px",
        "sm": "16px",
        "xl": "64px",
        "xs": "8px",
        "lg": "40px",
        "container-max": "1280px",

      },
      colors: {
        brand: {
          blue: '#4F6DFF',
          dark: '#1A1D2B',
          muted: '#6B7280',
          lavender: '#E6EBFF'
        },
        "secondary-fixed": "#dbe1ff",
        "on-tertiary-fixed-variant": "#70380b",
        "on-secondary-fixed-variant": "#003ea8",
        "surface-variant": "#e5e1e9",
        "secondary-container": "#316bf3",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#5f2b00",
        "error-container": "#ffdad6",
        "on-background": "#1b1b21",
        "surface": "#fcf8ff",
        "on-surface": "#1b1b21",
        "tertiary-fixed-dim": "#ffb688",
        "on-secondary-fixed": "#00174b",
        "outline-variant": "#c8c5d3",
        "outline": "#777682",
        "surface-container-low": "#f6f2fa",
        "surface-container-highest": "#e5e1e9",
        "secondary-fixed-dim": "#b4c5ff",
        "on-secondary": "#ffffff",
        "on-tertiary-fixed": "#311300",
        "on-primary-fixed-variant": "#3e3c8f",
        "on-secondary-container": "#fefcff",
        "surface-tint": "#5654a8",
        "inverse-surface": "#303036",
        "on-primary-container": "#9c9af4",
        "on-primary": "#ffffff",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        "primary-container": "#312e81",
        "inverse-on-surface": "#f3eff7",
        "on-tertiary-container": "#de915e",
        "surface-container": "#f0ecf4",
        "tertiary-fixed": "#ffdbc7",
        "surface-dim": "#dcd9e0",
        "on-surface-variant": "#474651",
        "primary-fixed": "#e2dfff",
        "inverse-primary": "#c3c0ff",
        "surface-container-lowest": "#ffffff",
        "primary-fixed-dim": "#c3c0ff",
        "surface-bright": "#fcf8ff",
        "surface-container-high": "#eae7ef",
        "on-primary-fixed": "#100563",

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

        "display-lg": ["var(--font-plus-jakarta)", "sans-serif"],
        "headline-lg": ["var(--font-plus-jakarta)", "sans-serif"],
        "headline-lg-mobile": ["var(--font-plus-jakarta)", "sans-serif"],
        "body-md": ["var(--font-inter)", "sans-serif"],
        "body-lg": ["var(--font-inter)", "sans-serif"],
        "label-sm": ["var(--font-inter)", "sans-serif"],
        "headline-md": ["var(--font-plus-jakarta)", "sans-serif"],
        "label-md": ["var(--font-inter)", "sans-serif"],

        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "float": "float 8s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
