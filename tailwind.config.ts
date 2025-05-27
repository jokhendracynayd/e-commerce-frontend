import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand Identity
        primary: "#7F56D9",     // Royal Purple
        secondary: "#F4A261",   // Soft Orange
        accent: "#2A9D8F",      // Deep Teal
        highlight: "#E9C46A",   // Warm Gold

        // Light Theme
        background: "#FAFAFA",  // Off-white
        foreground: "#1A1A1A",  // Almost black
        border: "#E5E7EB",      // Light gray
        muted: "#6B7280",       // Cool gray

        // Dark Theme
        dark: {
          background: "#121212",   // Dark gray
          foreground: "#F5F5F5",   // Light text
          border: "#2C2C2C",       // Darker gray
          muted: "#A1A1AA",        // Muted gray
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.05)",
        elevated: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#1A1A1A",
            a: {
              color: "#7F56D9",
              "&:hover": {
                color: "#6941C6",
              },
            },
            h1: {
              color: "#1A1A1A",
            },
            h2: {
              color: "#1A1A1A",
            },
            h3: {
              color: "#1A1A1A",
            },
            h4: {
              color: "#1A1A1A",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};

export default config; 