/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#3b82f6", foreground: "#ffffff" },
        secondary: { DEFAULT: "#8b5cf6", foreground: "#ffffff" },
        accent: { DEFAULT: "#ec4899", foreground: "#ffffff" }
      }
    }
  },
  plugins: []
};
        },
      },
    },
  },
  plugins: [],
};
