/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#06040A',
          900: '#0C0818',
          850: '#120D24',
          800: '#191233',
          700: '#261B4D',
          600: '#38286E'
        },
        rose: {
          accent: '#FF5E8E',
          soft: '#FFA4BD',
          glow: '#FF2E74'
        },
        lavender: {
          light: '#E4D5FF',
          DEFAULT: '#B794F6',
          dark: '#7E3AF2',
          muted: '#9B8BB4'
        },
        champagne: {
          light: '#FFF6D6',
          DEFAULT: '#FCD34D',
          gold: '#F59E0B',
          deep: '#D97706'
        },
        warm: {
          white: '#FFFDF9',
          cream: '#FAF5EE'
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        script: ['"Dancing Script"', '"Caveat"', 'cursive'],
        handwriting: ['"Caveat"', '"Dancing Script"', 'cursive']
      },
      boxShadow: {
        'glow-pink': '0 0 35px -5px rgba(255, 94, 142, 0.45)',
        'glow-purple': '0 0 40px -5px rgba(183, 148, 246, 0.4)',
        'glow-gold': '0 0 35px -5px rgba(252, 211, 77, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'float-slow': 'float 5s ease-in-out infinite',
        'float-gentle': 'floatGentle 3.5s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'spin-slow': 'spin 18s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' }
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-7px) rotate(1.5deg)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    },
  },
  plugins: [],
}
