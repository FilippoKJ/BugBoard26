/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#102128',
        paper: '#f6f5ef',
        brand: { 50: '#effaf6', 500: '#15a075', 600: '#0d805e', 700: '#0c654d' },
        amber: { 100: '#fff2cc', 500: '#d68a16' }
      },
      boxShadow: {
        card: '0 16px 48px rgba(16, 33, 40, 0.09)'
      }
    }
  },
  plugins: []
};
