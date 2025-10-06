/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          '500': 'rgb(120 113 108)',
          '600': 'rgb(87 83 78)',
        },
      },
    },
  },
  plugins: [],
}
