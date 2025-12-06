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
        stormy_teal: {
          DEFAULT: "#006466",
          100: "#001414",
          200: "#002829",
          300: "#003c3d",
          400: "#005052",
          500: "#006466",
          600: "#00b5b8",
          700: "#0afbff",
          800: "#5cfcff",
          900: "#adfeff",
        },
        dark_teal: {
          DEFAULT: "#065a60",
          100: "#011213",
          200: "#022426",
          300: "#04363a",
          400: "#05484d",
          500: "#065a60",
          600: "#0ba2ad",
          700: "#19e2f0",
          800: "#66ecf5",
          900: "#b2f5fa",
        },
        dark_teal_2: {
          DEFAULT: "#0b525b",
          100: "#021012",
          200: "#042124",
          300: "#073136",
          400: "#094149",
          500: "#0b525b",
          600: "#1493a3",
          700: "#25cee4",
          800: "#6edeed",
          900: "#b6eff6",
        },
        dark_teal_3: {
          DEFAULT: "#144552",
          100: "#040e10",
          200: "#081b21",
          300: "#0c2931",
          400: "#103742",
          500: "#144552",
          600: "#247c94",
          700: "#3aafcf",
          800: "#7ccadf",
          900: "#bde4ef",
        },
        charcoal_blue: {
          DEFAULT: "#1b3a4b",
          100: "#050c0f",
          200: "#0b171e",
          300: "#10232d",
          400: "#162f3c",
          500: "#1b3a4b",
          600: "#316987",
          700: "#4b96be",
          800: "#87b9d4",
          900: "#c3dce9",
        },
        deep_space_blue: {
          DEFAULT: "#212f45",
          100: "#07090e",
          200: "#0d131c",
          300: "#141c29",
          400: "#1b2537",
          500: "#212f45",
          600: "#3c547c",
          700: "#5a7baf",
          800: "#91a7ca",
          900: "#c8d3e4",
        },
        space_indigo: {
          DEFAULT: "#272640",
          100: "#08080d",
          200: "#100f1a",
          300: "#171726",
          400: "#1f1f33",
          500: "#272640",
          600: "#464573",
          700: "#6866a3",
          800: "#9a99c2",
          900: "#cdcce0",
        },
        midnight_violet: {
          DEFAULT: "#312244",
          100: "#0a070e",
          200: "#140e1b",
          300: "#1d1529",
          400: "#271b36",
          500: "#312244",
          600: "#583e7a",
          700: "#7f5cad",
          800: "#aa92c8",
          900: "#d4c9e4",
        },
        midnight_violet_2: {
          DEFAULT: "#3e1f47",
          100: "#0c060e",
          200: "#190c1c",
          300: "#25132b",
          400: "#321939",
          500: "#3e1f47",
          600: "#703880",
          700: "#a055b4",
          800: "#bf8ecd",
          900: "#dfc6e6",
        },
        deep_purple: {
          DEFAULT: "#4d194d",
          100: "#0f050f",
          200: "#1f0a1f",
          300: "#2e0f2e",
          400: "#3e143e",
          500: "#4d194d",
          600: "#8b2d8b",
          700: "#c346c3",
          800: "#d784d7",
          900: "#ebc1eb",
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
    function ({
      addUtilities,
    }: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addUtilities: (utilities: Record<string, any>) => void;
    }) {
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
