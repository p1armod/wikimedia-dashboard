
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {

        primary: {
          50: '#fdfbfa',
          100: '#fcf3db',
          200: '#f8e3a8',
          300: '#f4d275',
          400: '#f0cf65', // royal-gold
          500: '#f0cf65', // royal-gold
          600: '#f0cf65', // royal-gold
          700: '#d9ba5a',
          800: '#a68f45',
          900: '#8c783b',
        },
        surface: {
          50: '#f8f9fa',  // Wikipedia light gray background
          100: '#eaecf0', // Wikipedia border/hover gray
          200: '#c8ccd1',
          300: '#a2a9b1',
          400: '#72777d',
          500: '#54595d', // Secondary text
          600: '#404244',
          700: '#27292d',
          800: '#202122', // Wikipedia main text color
          900: '#101418',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-dot': 'pulseDot 2s infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
