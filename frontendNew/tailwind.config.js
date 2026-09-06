/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Lexend"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        teal: {
          50: '#eef7f7',
          100: '#d6ecec',
          200: '#aed9d9',
          300: '#7ec0c0',
          400: '#4a9fa0',
          500: '#2f8283',
          600: '#0f7173',
          700: '#0c5c5e',
          800: '#0a494a',
          900: '#083a3b',
        },
        ink: {
          50: '#f5f7f8',
          100: '#e7ebed',
          200: '#cdd6da',
          300: '#a4b2b9',
          400: '#748690',
          500: '#556673',
          600: '#42505c',
          700: '#37424c',
          800: '#252d34',
          900: '#161b1f',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(22, 27, 31, 0.04), 0 4px 16px rgba(22, 27, 31, 0.06)',
        'card-hover': '0 2px 4px rgba(22, 27, 31, 0.06), 0 8px 24px rgba(22, 27, 31, 0.08)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.55 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 300ms ease-out',
        pulseSoft: 'pulseSoft 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
