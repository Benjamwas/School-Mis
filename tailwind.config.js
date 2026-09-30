export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F1629',
          dark: '#0A0F1C',
          50: '#F0F2F5',
          100: '#D9DDE5',
          200: '#B3BBC9',
          700: '#1A2340',
          800: '#141B33',
          900: '#0F1629',
        },
        gold: {
          DEFAULT: '#D4A843',
          dark: '#B8923A',
          50: '#FBF6E9',
          100: '#F5EAC5',
          200: '#EDDB9E',
          300: '#E3C86E',
          400: '#D4A843',
          500: '#B8923A',
          600: '#9A7A30',
        },
        heading: {
          DEFAULT: '#000000',
          dark: '#D4A843',
        },
        ink: {
          DEFAULT: '#111827',
          muted: '#374151',
          soft: '#4B5563',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F8F9FA',
          border: '#E5E7EB',
        },
        accent: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          pink: '#EC4899',
          teal: '#14B8A6',
          sky: '#7DD3FC',
          lightblue: '#38BDF8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'heading-xs': ['clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-sm': ['clamp(1.125rem, 1rem + 0.625vw, 1.375rem)', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-base': ['clamp(1.25rem, 1.1rem + 0.75vw, 1.625rem)', { lineHeight: '1.25', fontWeight: '700' }],
        'heading-lg': ['clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)', { lineHeight: '1.2', fontWeight: '800' }],
        'heading-xl': ['clamp(1.875rem, 1.4rem + 2.375vw, 3rem)', { lineHeight: '1.15', fontWeight: '800' }],
        'heading-2xl': ['clamp(2.25rem, 1.5rem + 3.75vw, 4rem)', { lineHeight: '1.1', fontWeight: '900' }],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        lift: '0 20px 60px -15px rgba(15,22,41,0.4)',
        card: '0 1px 3px rgba(15,22,41,0.06), 0 10px 30px -10px rgba(15,22,41,0.12)',
        pop: '0 15px 50px -12px rgba(15,22,41,0.25)',
        glow: '0 0 30px rgba(212,168,67,0.3)',
        'glow-lg': '0 0 60px rgba(212,168,67,0.4)',
      },
      transitionTimingFunction: {
        sala: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
    },
  },
}
