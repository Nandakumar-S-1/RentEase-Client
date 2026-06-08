/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        card: "var(--color-card)",
        muted: "var(--color-muted)",
        danger: "var(--color-danger)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
      },

      textColor: {
        primary: "var(--color-primary)",
        "muted-foreground": "var(--color-muted-foreground)",
        "card-foreground": "var(--color-card-foreground)",
        "secondary-foreground": "var(--color-secondary-foreground)",
        "accent-foreground": "var(--color-accent-foreground)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
