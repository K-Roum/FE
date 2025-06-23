/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // src 폴더 안 모든 js, jsx, ts, tsx 파일 포함
    './public/index.html',          // public 폴더의 index.html 포함 (필요하면)
  ],
  theme: {
    extend: {
      fontFamily: {
        'lg-pc': ['LG_PC', 'sans-serif'],
      },
      gridTemplateColumns: {
        '5': 'repeat(5, minmax(0, 1fr))',
      }
    },
  },
  // plugins: [ require('@tailwindcss/line-clamp'),],
}
