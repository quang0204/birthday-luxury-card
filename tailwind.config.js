/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Superr Styleguide Exact Tokens
        // Creative Editorial & Landing Love Luxury Tokens
        blush: {
          50: '#FDFBF9',
          100: '#FAF3F0',
          200: '#F5EBE6',
          300: '#EBD7CF',
          400: '#DEACA2',
          500: '#CF877B',
        },
        rose: {
          50: '#FFF5F6',
          100: '#FEEBEF',
          200: '#FCD8E0',
          300: '#F7A8B8',
          400: '#E77C92',
          500: '#D4627A',
          600: '#BE4D66',
          700: '#9E334D',
          800: '#7B2239',
          900: '#541525',
          accent: '#D4627A',
          soft: '#E77C92',
          glow: '#D4627A'
        },
        wine: {
          50: '#FDF2F4',
          100: '#FCE7EB',
          700: '#43192B',
          800: '#2E111D',
          900: '#1C0B13',
          950: '#14060C',
        },
        cream: {
          50: '#FCFAF7',
          100: '#F8F4EE',
          200: '#EFE7DC',
          300: '#E3D7C5',
          900: '#2B1A1E',
        },
        champagne: {
          light: '#FBF5EE',
          DEFAULT: '#E6C29C',
          gold: '#D4A373',
          dark: '#B08354',
        },
        superr: {
          canvas: '#FCFAF7',
          dew: '#FAF3F0',
          cocoa: '#2B1218',
          charcoal: '#1A0E13',
          marker: '#D4627A',
          sienna: '#BE4D66',
          bubblegum: '#E77C92',
          night: '#14060C',
          card: '#1F0B14',
          border: 'rgba(255, 255, 255, 0.12)'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        editorial: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        script: ['"Caveat"', 'cursive'],
        handwriting: ['"Caveat"', 'cursive']
      },
      boxShadow: {
        // Superr Signature Tactile Sticker Shadows
        'sticker-sm': '2px 2px 0px #2B1A07',
        'sticker': '3px 3px 0px #2B1A07',
        'sticker-lg': '5px 5px 0px #2B1A07',
        'sticker-light': '3px 3px 0px rgba(43, 26, 7, 0.6)',
        'sticker-marker': '3px 3px 0px #CE500A',
        'sticker-white': '3px 3px 0px #FFFFFF',
        'glow-marker': '0 0 28px -4px rgba(255, 111, 30, 0.55)',
        'glow-bubblegum': '0 0 28px -4px rgba(255, 102, 207, 0.45)',
        'glow-sunshine': '0 0 28px -4px rgba(251, 191, 36, 0.5)'
      },
      animation: {
        'float-slow': 'float 5s ease-in-out infinite',
        'float-gentle': 'floatGentle 3.5s ease-in-out infinite',
        'wiggle-gentle': 'wiggle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-6px) rotate(1.5deg)' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' }
        }
      }
    },
  },
  plugins: [],
}
