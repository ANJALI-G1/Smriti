/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          ivory: '#f4e7d2',
          card: '#FFFFFF',
          surface: '#F4EFE6',
          teal: '#0F5E5E',
          tealDark: '#0A4343',
          tealLight: '#187B7B',
          tealSubtle: '#E6F0F0',
          amber: '#A55A00',
          amberLight: '#D47814',
          amberSubtle: '#FCF3E8',
          border: '#E8E3DA',
          borderDark: '#D4CDC2',
          charcoal: '#212B2B',
          slate: '#5A6565',
          muted: '#7C8888',
          sage: '#E3EBE6',
          // Semantic status colors added for the Caregiver Dashboard —
          // reused across any future page needing success/caution/concern states.
          positive: '#2E7D5B',
          positiveTint: '#EDF8F3',
          caution: '#C77700',
          concern: '#B23B2E',
          concernTint: '#FDF2F0',
        },
      },
      fontFamily: {
        serif: ['Literata', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        // Accessibility-focused body font for the elderly-facing Patient
        // interface (large, high-legibility). Headlines there still use
        // the existing `font-serif` (Literata) for visual consistency.
        elderly: ['"Atkinson Hyperlegible Next"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px -4px rgba(15, 94, 94, 0.06), 0 2px 10px -2px rgba(15, 94, 94, 0.04)',
        elevated: '0 20px 40px -8px rgba(15, 94, 94, 0.12), 0 4px 16px -2px rgba(15, 94, 94, 0.06)',
        glow: '0 0 25px rgba(165, 90, 0, 0.18)',
        card: '0 4px 20px rgba(33, 43, 43, 0.04)',
        popover: '0 12px 36px rgba(15, 94, 94, 0.12)',
      },
      keyframes: {
        wavePulse: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '38px' },
        },
      },
      animation: {
        wavePulse: 'wavePulse 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
