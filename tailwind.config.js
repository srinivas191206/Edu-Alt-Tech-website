/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.{tsx,ts}',
    './components/**/*.{tsx,ts}',
    './pages/**/*.{tsx,ts}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          900: '#14532d',
        }
      }
    }
  },
  plugins: [],
}
