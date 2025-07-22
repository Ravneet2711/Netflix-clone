/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "sharp-sans": ["Sharp Sans", "sans-serif"],
      },
      backgroundColor: {
        "custom-dark": "#141414",
      },
    },
  },
  plugins: [],
};
