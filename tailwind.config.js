/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        ink: '#172033',
        muted: '#81899b',
        brand: '#6258e8',
        mint: '#dff7ef',
        peach: '#fff0e3',
        lilac: '#eeecff',
      },
      boxShadow: {
        soft: '0 14px 40px rgba(34, 42, 74, 0.07)',
      },
    },
  },
  plugins: [],
}
