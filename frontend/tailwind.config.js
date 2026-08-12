/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#090d16",
          card: "#131b2e",
          border: "#1e293b",
          hover: "#1c2842"
        },
        brand: {
          purple: "#8b5cf6",
          cyan: "#06b6d4",
          pink: "#ec4899",
          blue: "#3b82f6"
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
