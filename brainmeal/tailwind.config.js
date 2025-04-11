/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        secondary: '#5856D6',
        background: '#F2F2F7',
        darkBackground: '#000000',
        card: '#FFFFFF',
        darkCard: '#1C1C1E',
        text: '#000000',
        darkText: '#FFFFFF',
        border: '#C7C7CC',
        darkBorder: '#38383A',
      },
      fontFamily: {
        sans: ['System', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 