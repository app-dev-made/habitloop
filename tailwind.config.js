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
        display: ['DM Serif Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        teal: {
          50:  '#E1F5EE',
          100: '#C3EBD9',
          200: '#9FE1CB',
          300: '#5DCAA5',
          400: '#1D9E75',
          500: '#178A65',
          600: '#0F6E56',
          700: '#095442',
          800: '#053D30',
          900: '#02291F',
        },
        ink: {
          50:  '#F5F4F0',
          100: '#E8E6DF',
          200: '#C8C5BB',
          300: '#A8A59C',
          400: '#88867F',
          500: '#68665F',
          600: '#4A4844',
          700: '#2E2D2A',
          800: '#1E1D1A',
          900: '#0F0E0C',
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':    'fadeIn 0.3s ease both',
        'scale-in':   'scaleIn 0.25s cubic-bezier(0.16,1,0.3,1) both',
        'slide-up':   'slideUp 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'bounce-in':  'bounceIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'pulse':      'pulse 2s ease infinite',
        'spin':       'spin 1s linear infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.92)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideUp:   { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        bounceIn:  { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.15)' } },
        pulse:     { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
        spin:      { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
