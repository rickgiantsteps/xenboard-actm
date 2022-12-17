/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/components/P5.{js,vue}",
    "./src/components/XenBoard.js"],
  safelist: [
    'bg-[#ffd700]',
      'dark:bg-sky-500',
      'bg-[#FA8072]',
    "bg-[#E6E6FA]","bg-[#D8BFD8]","bg-[#FA8072]","bg-[#CD5C5C]","bg-[#FF6347]","bg-[#EEE8AA]","bg-[#AFEEEE]","bg-[#808000]",
    "active:bg-[#ffd700]","active:bg-[#d6d6f7]","active:bg-[#ab76ab]","active:bg-[#fb9185]","active:bg-[#a48585]","active:bg-[#bd1d00]","active:bg-[#a09520]","active:bg-[#156262]","active:bg-[#454500]",
    "hover:bg-[#ffbe5b]","hover:bg-[#8484e6]","hover:bg-[#c9a7c9]","hover:bg-[#f96f5f]","hover:bg-[#dd4c4c]","hover:bg-[#ff846e]","hover:bg-[#e7df89]","hover:bg-[#8fe7e7]","hover:bg-[#bbbb00]",

    "bg-[#ffd700]","bg-[#d6d6f7]","bg-[#ab76ab]","bg-[#fb9185]","bg-[#a48585]","bg-[#bd1d00]","bg-[#a09520]","bg-[#156262]","bg-[#454500]",
    "bg-[#ffbe5b]","bg-[#8484e6]","bg-[#c9a7c9]","bg-[#f96f5f]","bg-[#dd4c4c]","bg-[#ff846e]","bg-[#e7df89]","bg-[#8fe7e7]","bg-[#bbbb00]",


    "dark:bg-[#E6E6FA]","dark:bg-[#D8BFD8]","dark:bg-[#FA8072]","dark:bg-[#CD5C5C]","dark:bg-[#FF6347]","dark:bg-[#EEE8AA]","dark:bg-[#AFEEEE]","dark:bg-[#808000]",
    "dark:active:bg-[#d6d6f7]","dark:active:bg-[#ab76ab]","dark:active:bg-[#fb9185]","dark:active:bg-[#a48585]","dark:active:bg-[#bd1d00]","dark:active:bg-[#a09520]","dark:active:bg-[#156262]","dark:active:bg-[#454500]",
    "dark:hover:bg-[#8484e6]","dark:hover:bg-[#c9a7c9]","dark:hover:bg-[#f96f5f]","dark:hover:bg-[#dd4c4c]","dark:hover:bg-[#ff846e]","dark:hover:bg-[#e7df89]","dark:hover:bg-[#8fe7e7]","dark:hover:bg-[#bbbb00]"

  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
