/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    ],
  theme: {
    extend: {
      fontFamily: {
        'asta': ['Asta Sans'],
        'Noto': ['Noto Sans KR'],
      }
    },
    backgroundImage: {
      'noto': "url('../public/images/note.jpg')",
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}

