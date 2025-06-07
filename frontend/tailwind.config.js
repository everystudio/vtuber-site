/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    "flex",
    "flex-wrap",
    "gap-4",
    "space-x-2",
    "items-center"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

