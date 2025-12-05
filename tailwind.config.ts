import type { Config } from "tailwindcss";

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // or 'media' for system preference
  theme: {
    extend: {
      colors: {
        // Custom color palette for crypto/web3 theme
        // Based on: 1A1A1D, 3B1C32, 6A1E55, A64D79
        background: {
          DEFAULT: "#1A1A1D", // Darkest - main background
          secondary: "#3B1C32", // Dark purple - secondary background
          tertiary: "#2A1A26", // In-between shade
        },
        foreground: {
          DEFAULT: "#ffffff",
          secondary: "#e5e5e5",
          muted: "#a0a0a0",
        },
        primary: {
          DEFAULT: "#6A1E55", // Medium purple - main brand color
          50: "#fdf4f9",
          100: "#fbe8f3",
          200: "#f6d1e7",
          300: "#f0aad5",
          400: "#e878bb",
          500: "#d9499e",
          600: "#c2287d",
          700: "#a64d79", // Lighter purple/pink
          800: "#6A1E55", // Medium purple
          900: "#3B1C32", // Dark purple
          950: "#1A1A1D", // Darkest
        },
        secondary: {
          DEFAULT: "#A64D79", // Lighter purple/pink - accents
          50: "#fdf4f9",
          100: "#fbe8f3",
          200: "#f8d1e7",
          300: "#f3abd3",
          400: "#eb7ab7",
          500: "#dd4d9a",
          600: "#c83179",
          700: "#a64d79", // Lighter purple/pink
          800: "#8a3b63",
          900: "#6A1E55", // Medium purple
          950: "#3B1C32", // Dark purple
        },
        accent: {
          DEFAULT: "#A64D79",
          light: "#d9499e",
          dark: "#6A1E55",
        },
        success: {
          DEFAULT: "#10b981",
          light: "#6ee7b7",
          dark: "#047857",
        },
        warning: {
          DEFAULT: "#f59e0b",
          light: "#fbbf24",
          dark: "#d97706",
        },
        error: {
          DEFAULT: "#ef4444",
          light: "#f87171",
          dark: "#dc2626",
        },
        info: {
          DEFAULT: "#3b82f6",
          light: "#60a5fa",
          dark: "#2563eb",
        },
        // Glassmorphism colors
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.1)",
          light: "rgba(255, 255, 255, 0.15)",
          dark: "rgba(0, 0, 0, 0.1)",
        },
        // Crypto specific colors
        crypto: {
          bitcoin: "#f7931a",
          ethereum: "#627eea",
          usdc: "#2775ca",
          usdt: "#26a17b",
          mantle: "#000000",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-roboto-mono)", "Roboto Mono", "monospace"],
        jakarta: [
          "var(--font-plus-jakarta-sans)",
          "Plus Jakarta Sans",
          "sans-serif",
        ],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        "3xs": ["0.5rem", { lineHeight: "0.75rem" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "100": "25rem",
        "112": "28rem",
        "128": "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(106, 30, 85, 0.5)",
        "glow-lg": "0 0 40px rgba(106, 30, 85, 0.6)",
        "glow-xl": "0 0 60px rgba(106, 30, 85, 0.7)",
        "glow-secondary": "0 0 20px rgba(166, 77, 121, 0.5)",
        glass:
          "0 8px 32px 0 rgba(26, 26, 29, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.18)",
        "glass-lg":
          "0 12px 48px 0 rgba(26, 26, 29, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.2)",
        neon: "0 0 5px #A64D79, 0 0 20px #6A1E55",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-purple": "linear-gradient(135deg, #6A1E55 0%, #A64D79 100%)",
        "gradient-dark": "linear-gradient(135deg, #1A1A1D 0%, #3B1C32 100%)",
        "gradient-accent": "linear-gradient(135deg, #A64D79 0%, #d9499e 100%)",
        "gradient-primary": "linear-gradient(135deg, #3B1C32 0%, #6A1E55 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-out": "fadeOut 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "slide-left": "slideLeft 0.5s ease-out",
        "slide-right": "slideRight 0.5s ease-out",
        "bounce-slow": "bounce 2s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 3s ease-in-out infinite",
        "scale-in": "scaleIn 0.3s ease-out",
        "scale-out": "scaleOut 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        glow: {
          "0%": {
            boxShadow: "0 0 5px #667eea, 0 0 10px #667eea, 0 0 15px #667eea",
          },
          "100%": {
            boxShadow:
              "0 0 10px #667eea, 0 0 20px #667eea, 0 0 30px #667eea, 0 0 40px #764ba2",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleOut: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.9)", opacity: "0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionDuration: {
        "2000": "2000ms",
        "3000": "3000ms",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@tailwindcss/forms"),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@tailwindcss/typography"),
    // Add custom utilities
    function ({ addUtilities }: any) {
      const newUtilities = {
        ".text-gradient": {
          "background-clip": "text",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
          "background-image":
            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        ".text-gradient-accent": {
          "background-clip": "text",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
          "background-image":
            "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        },
        ".glass": {
          background: "rgba(255, 255, 255, 0.1)",
          "backdrop-filter": "blur(10px)",
          "-webkit-backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        },
        ".glass-dark": {
          background: "rgba(0, 0, 0, 0.3)",
          "backdrop-filter": "blur(10px)",
          "-webkit-backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".scrollbar-thin": {
          "scrollbar-width": "thin",
          "scrollbar-color": "#667eea #1f2937",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
