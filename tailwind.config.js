const { COLORS } = require('./constants/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        ...Object.fromEntries(
          Object.entries(COLORS).map(([k, v]) => [k, v])
        ),
        // Semantic aliases for dark: usage
        'surface-dark': '#1e2340',
        'surface-elevated-dark': '#333a5c',
        'text-primary-dark': '#f7f8fc',
        'text-secondary-dark': '#bdc2d8',
        'text-muted-dark': '#6570a0',
        'border-dark': '#333a5c',
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
    },
  },
  plugins: [],
};
