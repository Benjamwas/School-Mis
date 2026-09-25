export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#10201A',
          muted: '#5A6B63',
          soft: '#8A9891',
        },
        forest: {
          50: '#F1F7F3',
          100: '#DCEBE2',
          200: '#B9D7C6',
          300: '#8DBCA4',
          400: '#5B9A7C',
          500: '#37795B',
          600: '#1F5E43',
          700: '#194C37',
          800: '#143C2C',
          900: '#0E2A1F',
        },
        gold: {
          50: '#FDF8EC',
          100: '#F8ECCF',
          200: '#EFD79B',
          300: '#E3BC62',
          400: '#D4A23A',
          500: '#B8862A',
          600: '#95691F',
        },
        cream: '#FAF7F1',
        line: '#E5E2DA',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,32,26,0.04), 0 8px 24px -16px rgba(16,32,26,0.18)',
        pop: '0 12px 40px -12px rgba(16,32,26,0.28)',
      },
      transitionTimingFunction: {
        sala: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
}
