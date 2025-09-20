/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(59, 130, 246)", // blue-500
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "rgb(139, 92, 246)", // purple-500
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "rgb(236, 72, 153)", // pink-500
          foreground: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};
