/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        IRANYekanX: 'IRANYekanX',
      },
      colors: {
        primary: '#3f0ecc',
      },
    },
    container: {
      center: true,
    },
  },
  plugins: [],
  important: '#app',
}
