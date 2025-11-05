import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-rubik)', 'Rubik', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#009879',
          foreground: '#ffffff',
        },
        navy: {
          DEFAULT: '#003366',
        },
      },
      borderRadius: {
        xl: '0.75rem',
      },
      boxShadow: {
        card: '0 10px 25px -10px rgba(0,0,0,0.2)'
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config

