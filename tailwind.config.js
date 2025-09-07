/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0d9488', // Teal color for finance (teal-600)
        secondary: '#10b981', // Green color (emerald-500)
      },
    },
  },
  plugins: [],
};
