/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/components/P5.{js,vue}",
    "./src/components/XenBoard.js"],
  safelist: [
    'bg-[#ffd700]',
      'dark:bg-sky-500'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
