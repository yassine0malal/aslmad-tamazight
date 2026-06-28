/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Clay Design System Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Clay Brand Colors
        clay: {
          canvas: "#fffaf0",
          "surface-soft": "#faf5e8",
          "surface-card": "#f5f0e0",
          "surface-strong": "#ebe6d6",
          "surface-dark": "#0a1a1a",
          "surface-dark-elevated": "#1a2a2a",
          ink: "#0a0a0a",
          body: "#3a3a3a",
          "body-strong": "#1a1a1a",
          muted: "#6a6a6a",
          "muted-soft": "#9a9a9a",
          hairline: "#e5e5e5",
          "hairline-soft": "#f0f0f0",
          pink: "#ff4d8b",
          teal: "#1a3a3a",
          lavender: "#b8a4ed",
          peach: "#ffb084",
          ochre: "#e8b94a",
          mint: "#a4d4c5",
          coral: "#ff6b5a",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        // Clay border radius tokens
        "clay-xs": "6px",
        "clay-sm": "8px",
        "clay-md": "12px",
        "clay-lg": "16px",
        "clay-xl": "24px",
        "clay-pill": "9999px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        // Clay elevation
        "clay-card": "0 0 0 1px #e5e5e5",
        "clay-hover": "0 4px 12px rgba(0, 0, 0, 0.08)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      // Clay typography — El Messiri for everything
      fontFamily: {
        display: ['"El Messiri"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        title: ['"El Messiri"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        body: ['"El Messiri"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      spacing: {
        // Clay spacing tokens
        "clay-xxs": "4px",
        "clay-xs": "8px",
        "clay-sm": "12px",
        "clay-md": "16px",
        "clay-lg": "24px",
        "clay-xl": "32px",
        "clay-xxl": "48px",
        "clay-section": "96px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
