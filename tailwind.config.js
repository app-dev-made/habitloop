/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Distinctive font pairing: DM Serif Display + DM Sans
        display: ['DM Serif Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        teal: {
          50:  '#E1F5EE',
          100: '#9FE1CB',
          200: '#5DCAA5',
          400: '#1D9E75',
          600: '#0F6E56',
          800: '#085041',
          900: '#04342C',
        },
        ink: {
          50:  '#F5F4F0',
          100: '#E8E6DF',
          200: '#C8C5BB',
          400: '#88867F',
          600: '#4A4844',
          800: '#1E1D1A',
          900: '#0F0E0C',
        },
      },
      animation: {
        'fade-up':   'fadeUp 0.4s ease both',
        'fade-in':   'fadeIn 0.3s ease both',
        'scale-in':  'scaleIn 0.2s ease both',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:   { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        scaleIn:  { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
        pulseDot: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
      },
    },
  },
  plugins: [],
}
