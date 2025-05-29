/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand Identity
        primary: "#f7ac8b",     // Royal Purple
        secondary: "#F4A261",   // Soft Orange
        accent: "#2A9D8F",      // Deep Teal
        highlight: "#E9C46A",   // Warm Gold

        // Light Theme
        background: "#FAFAFA",  // Off-white
        foreground: "#1A1A1A",  // Almost black
        border: "#E5E7EB",      // Light gray
        muted: "#6B7280",       // Cool gray

        // Dark Theme
        "dark-background": "#121212",   // Dark gray
        "dark-foreground": "#F5F5F5",   // Light text
        "dark-border": "#2C2C2C",       // Darker gray
        "dark-muted": "#A1A1AA",        // Muted gray
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["var(--font-poppins)", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.05)",
        elevated: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
}; 