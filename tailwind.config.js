/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#16223f',
          950: '#0E1320',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Fira Code"', '"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 4s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: 0.2, transform: 'scale(1)' },
          '50%': { opacity: 0.4, transform: 'scale(1.15)' },
        }
      }
    },
  },
  plugins: [],
}
