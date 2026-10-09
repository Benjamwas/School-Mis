export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1F3A5F',
          deep: '#152847',
          dark: '#0F1F33',
          soft: '#315281',
          50: '#EEF3F8',
          100: '#D6E0EC',
          200: '#A8BBD2',
          700: '#2A4A73',
          800: '#1F3A5F',
          900: '#152847',
        },
        gold: {
          DEFAULT: '#F4C243',
          dark: '#E0B030',
          soft: '#FBD574',
          glow: '#FFE9B3',
          50: '#FFF9EB',
          100: '#FDF0C8',
          200: '#FBD574',
          300: '#F7C84A',
          400: '#F4C243',
          500: '#E0B030',
          600: '#C49820',
        },
        yellow: {
          DEFAULT: '#F4C243',
          soft: '#FBD574',
          glow: '#FFE9B3',
        },
        heading: {
          DEFAULT: '#152847',
          dark: '#F4C243',
        },
        ink: {
          DEFAULT: '#1A2233',
          muted: '#4B5568',
          soft: '#6B7280',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F5F7FA',
          border: '#E2E8F0',
        },
        accent: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          pink: '#EC4899',
          teal: '#14B8A6',
          sky: '#7DD3FC',
          lightblue: '#38BDF8',
          whatsapp: '#25D366',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Fraunces', 'Georgia', 'ui-serif', 'serif'],
        display: ['Fraunces', 'Georgia', 'ui-serif', 'serif'],
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
        '3xl': '1.5rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        lift: '0 20px 60px -15px rgba(21, 40, 71, 0.35)',
        card: '0 1px 3px rgba(21, 40, 71, 0.06), 0 10px 30px -10px rgba(21, 40, 71, 0.12)',
        pop: '0 15px 50px -12px rgba(21, 40, 71, 0.25)',
        soft: '0 10px 30px -12px rgba(21, 40, 71, 0.18)',
        elevated: '0 25px 60px -20px rgba(21, 40, 71, 0.35)',
        yellow: '0 15px 40px -12px rgba(244, 194, 67, 0.55)',
        glass: '0 8px 32px rgba(21, 40, 71, 0.12)',
        glow: '0 0 30px rgba(244, 194, 67, 0.35)',
        'glow-lg': '0 0 60px rgba(244, 194, 67, 0.45)',
      },
      transitionTimingFunction: {
        sala: 'cubic-bezier(0.32, 0.72, 0, 1)',
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
        'shimmer': 'shine 2.4s linear infinite',
        'marquee': 'marquee 38s linear infinite',
        'marquee-fast': 'marquee 28s linear infinite',
        'kenburns': 'kenburns 20s ease-out forwards',
        'blob': 'blob 22s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1.5deg)' },
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
        shine: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        kenburns: {
          '0%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
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
