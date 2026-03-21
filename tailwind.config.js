/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',

      },
    },
    extend: {
      colors: {
        // Hyper-Cyan: Pure, futuristic energy. Used for Primary Actions/Active States.
        'primary-500': '#00F2FE',
        'primary-600': '#4FACFE', // Hover/Pressed state

        // Quantum Violet: A sophisticated complement for secondary actions (like Follow/Notifications).
        'secondary-500': '#C084FC',

        'off-white': '#F0FDFA', // Extremely clean alternative light background or stark highlight
        'red': '#FF4B4B', // Neural Red for errors and critical actions

        // The Void Surfaces: Deep obsidian tones with a cool cast for incredible depth.
        'dark-1': '#08090A', // Base Background (deepest void)
        'dark-2': '#111315', // Card Surface / Primary Navigation lift
        'dark-3': '#1A1D21', // Input Fields / Secondary elements
        'dark-4': '#2D3139', // Subtle Borders / Dividers (very low contrast)

        // Titanium Typography: Clean, readable hierarchy without being overly harsh.
        'light-1': '#FFFFFF', // Headings / Bold Text
        'light-2': '#E4E7EB', // Primary Body Text
        'light-3': '#94A3B8', // Secondary Text (timestamps, metadata)
        'light-4': '#64748B', // Placeholder Text / Captions
      },
      screens: {
        'xs': '480px',

      },
      width: {
        '420': '420px',
        '465': '465px',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],

      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}