/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // Blue 600
        secondary: "#f1f5f9", // Slate 100
        accent: "#dbeafe", // Blue 100
        card: "#FFFFFF",
        muted: "#64748b", // Slate 500
        danger: "#ef4444",
      },

      textColor: {
        primary: "#2563eb",
        "muted-foreground": "#64748b",
        "card-foreground": "#0f172a",
        "secondary-foreground": "#1e293b",
        "accent-foreground": "#1e40af",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
