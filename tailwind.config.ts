import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'SF Pro Text'",
          "'SF Pro Display'",
          "'Inter'",
          "'Segoe UI'",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'SF Pro Display'",
          "'Inter'",
          "sans-serif",
        ],
        mono: [
          "'SF Mono'",
          "ui-monospace",
          "'Menlo'",
          "monospace",
        ],
      },
      colors: {
        brand: {
          50: "#eff5ff",
          100: "#dbe7fe",
          200: "#bfd4fe",
          300: "#93b6fd",
          400: "#5a8ffa",
          500: "#2a6df1",
          600: "#0071e3",
          700: "#005cbf",
          800: "#004d9c",
          900: "#0a3d80",
        },
        ink: {
          950: "#050914",
          900: "#0a0f1c",
          800: "#111827",
          700: "#1f2937",
          600: "#3b465a",
          500: "#5b6577",
          400: "#7d8797",
          300: "#a3abb8",
          200: "#dfe3ea",
          100: "#eef1f5",
          50: "#f7f8fa",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f6f7f9",
          sunken: "#eef0f4",
        },
        line: "#e4e7ec",
        "line-strong": "#d0d5dd",
        success: "#0f9d58",
        "success-soft": "#e6f5ee",
        warning: "#c67c00",
        "warning-soft": "#fcf1de",
        danger: "#dc2626",
        "danger-soft": "#fdecec",
        info: "#0369a1",
        "info-soft": "#e0f2fe",
      },
      borderRadius: {
        none: "0",
        xs: "3px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "10px",
        "2xl": "12px",
        "3xl": "16px",
        pill: "9999px",
      },
      boxShadow: {
        xs: "0 1px 1px rgba(15,23,42,0.03)",
        card: "0 1px 2px rgba(15,23,42,0.04)",
        pop: "0 10px 25px -12px rgba(15,23,42,0.18), 0 4px 8px -4px rgba(15,23,42,0.06)",
        overlay: "0 20px 45px -12px rgba(15,23,42,0.28), 0 10px 20px -10px rgba(15,23,42,0.12)",
        ring: "0 0 0 3px rgba(0,113,227,0.20)",
        "ring-danger": "0 0 0 3px rgba(220,38,38,0.20)",
        "inner-hairline": "inset 0 -1px 0 rgba(15,23,42,0.06)",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.32, 0.72, 0, 1)",
        crisp: "cubic-bezier(0.2, 0, 0.13, 1.5)",
      },
      keyframes: {
        popIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        popIn: "popIn 160ms cubic-bezier(0.32, 0.72, 0, 1)",
        fadeIn: "fadeIn 140ms ease-out",
        slideUp: "slideUp 180ms cubic-bezier(0.32, 0.72, 0, 1)",
      },
      fontSize: {
        "2xs": ["10px", "14px"],
      },
      letterSpacing: {
        tightest: "-0.02em",
        tighter: "-0.015em",
        crisp: "-0.005em",
      },
    },
  },
  plugins: [],
};

export default config;
