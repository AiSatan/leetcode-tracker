/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Shippori Mincho B1"', 'Georgia', 'serif'],
        sans: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        smallcaps: '0.18em',
        wider: '0.08em',
      },
      colors: {
        background: {
          page: "var(--color-background-page)",
          surface: "var(--color-background-surface)",
          subtle: "var(--color-background-subtle)",
          highlight: "var(--color-background-highlight)",
        },
        text: {
          main: "var(--color-text-main)",
          muted: "var(--color-text-muted)",
          inverted: "var(--color-text-inverted)",
        },
        border: {
          default: "var(--color-border-default)",
          focus: "var(--color-border-focus)",
        },
        primary: {
          DEFAULT: "var(--color-primary-main)",
          hover: "var(--color-primary-hover)",
          text: "var(--color-primary-text)",
          light: "var(--color-primary-light)",
        },
        status: {
          success: "var(--color-status-success-main)",
          "success-hover": "var(--color-status-success-hover)",
          warning: "var(--color-status-warning-main)",
          "warning-hover": "var(--color-status-warning-hover)",
          error: "var(--color-status-error-main)",
          "error-hover": "var(--color-status-error-hover)",
        },
        performance: {
          1: "var(--color-performance-1)",
          2: "var(--color-performance-2)",
          3: "var(--color-performance-3)",
          4: "var(--color-performance-4)",
          5: "var(--color-performance-5)",
        },
        category: {
          blue: "var(--color-categorical-blue)",
          "blue-dim": "var(--color-categorical-blueDim)",
          green: "var(--color-categorical-green)",
          "green-dim": "var(--color-categorical-greenDim)",
          purple: "var(--color-categorical-purple)",
          "purple-dim": "var(--color-categorical-purpleDim)",
          yellow: "var(--color-categorical-yellow)",
          "yellow-dim": "var(--color-categorical-yellowDim)",
          red: "var(--color-categorical-red)",
          "red-dim": "var(--color-categorical-redDim)",
          indigo: "var(--color-categorical-indigo)",
          "indigo-dim": "var(--color-categorical-indigoDim)",
          pink: "var(--color-categorical-pink)",
          "pink-dim": "var(--color-categorical-pinkDim)",
          orange: "var(--color-categorical-orange)",
          "orange-dim": "var(--color-categorical-orangeDim)",
          teal: "var(--color-categorical-teal)",
          "teal-dim": "var(--color-categorical-tealDim)",
          cyan: "var(--color-categorical-cyan)",
          "cyan-dim": "var(--color-categorical-cyanDim)",
        }
      },
      borderRadius: {
        // Tighten everything — Dojo aesthetic uses hairlines, not rounded cards
        sm: "1px",
        DEFAULT: "2px",
        md: "2px",
        lg: "2px",   // was 16px
        xl: "3px",   // was 24px
        "2xl": "4px" // was 32px
      },
      boxShadow: {
        // No drop shadows in this aesthetic — keep names but make them no-op-ish
        sm: "none",
        DEFAULT: "none",
        md: "none",
        lg: "none",
        xl: "none",
        "2xl": "none",
        // Subtle paper edge for floating elements
        seal: "0 1px 0 rgba(0,0,0,0.04)",
      },
    },
  },
  safelist: [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-cyan-500",
  ],
  plugins: [],
};
