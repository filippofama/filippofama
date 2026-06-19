/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#06080f',
          800: '#0a0e1a',
          700: '#111726',
          600: '#1a2236',
        },
        glow: {
          aqua: '#3ee6d0',
          sky: '#56b0ff',
          violet: '#9b8cff',
          coral: '#ff7a8a',
          amber: '#ffc15e',
          lime: '#a6e85a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '40px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.37), inset 0 1px 0 0 rgba(255,255,255,0.08)',
        'glass-lg': '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(255,255,255,0.12)',
        glow: '0 0 40px rgba(86,176,255,0.25)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        drift: {
          '0%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(40px,-30px) scale(1.1)' },
          '66%': { transform: 'translate(-30px,20px) scale(0.95)' },
          '100%': { transform: 'translate(0,0) scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        drift: 'drift 22s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
