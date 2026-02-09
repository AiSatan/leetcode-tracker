/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  darkMode: 'class',
  theme: {
    extend: {
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
          success: "var(--color-status-success)",
          warning: "var(--color-status-warning)",
          error: "var(--color-status-error)",
        },
        // Performance colors are direct values
        performance: {
          1: "var(--color-performance-1)",
          2: "var(--color-performance-2)",
          3: "var(--color-performance-3)",
          4: "var(--color-performance-4)",
          5: "var(--color-performance-5)",
        }
      },
      borderRadius: {
        lg: "1rem", // 16px
        xl: "1.5rem", // 24px
        "2xl": "2rem", // 32px
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
