/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",        // purple
        secondary: "#DDD6FE",      // light purple
        accent: "#EDE9FE",         // very light purple
        card: "#FFFFFF",          // white
        muted: "#9CA3AF",          // gray
      },

      textColor: {
        "primary": "#7C3AED",
        "muted-foreground": "#6B7280",
        "card-foreground": "#111827",
        "secondary-foreground": "#4C1D95",
        "accent-foreground": "#4C1D95",
      },
    },
  },
  plugins: [],
};
