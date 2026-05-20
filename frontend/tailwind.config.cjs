/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "wine-primary": "#810b38",
        "wine-bg": "#f1e2d1",
        "wine-card": "#dcc3aa",
        "wine-dark": "#541a1a",
      },
    },
  },
  plugins: [],
};

