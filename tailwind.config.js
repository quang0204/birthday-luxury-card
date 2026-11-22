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
        superr: {
          canvas: '#FDFBF9',      // Cream Paper
          dew: '#F7EFE9',         // Dew Drop (Soft warm surface)
          cocoa: '#2B1A07',       // Cocoa Ink (Warm high-contrast)
          charcoal: '#171717',    // Deep Charcoal
          marker: '#FF6F1E',      // Marker Orange (Primary CTA & Sparks)
          sienna: '#CE500A',      // Burnt Sienna (Active depth)
          bubblegum: '#FF66CF',   // Bubblegum Pink (Sticker accent)
          sky: '#3B82F6',         // Sky Blue
          sprout: '#22C55E',      // Sprout Green
          sunshine: '#FBBF24',    // Sunshine Gold
          mist: '#BEBCBB',        // Shadow Mist
          // Midnight Plum Celebration Mode
          night: '#130B1C',       // Warm Deep Cocoa Night
          card: '#22152F',        // Elevated Plum Surface
          border: 'rgba(255, 255, 255, 0.14)'
        },
        rose: {
          accent: '#FF6F1E', // Superr Marker Orange harmonized
          soft: '#FF884D',
          glow: '#FF5E1E'
        },
        lavender: {
          light: '#F5E8FF',
          DEFAULT: '#D8B4FE',
          dark: '#A855F7',
          muted: '#C4B5FD'
        },
        champagne: {
          light: '#FEF3C7',
          DEFAULT: '#FBBF24', // Sunshine Gold
          gold: '#F59E0B'
        }
      },
      fontFamily: {
        display: ['"Nunito"', '"Plus Jakarta Sans"', 'sans-serif'],
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
