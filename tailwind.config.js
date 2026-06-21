/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.{tsx,ts}',
    './components/**/*.{tsx,ts}',
    './pages/**/*.{tsx,ts}',
  ],
  theme: {
    extend: {
      fontSize: {
        '4xl': ['2rem', { lineHeight: '2.25rem' }],
        '5xl': ['2.75rem', { lineHeight: '1.1' }],
        '6xl': ['3.375rem', { lineHeight: '1.1' }],
        '7xl': ['4.125rem', { lineHeight: '1' }],
        '8xl': ['5.25rem', { lineHeight: '1' }],
      },
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
