/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {

      // ─── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        body:    ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      // ─── Color System ──────────────────────────────────────────────────────
      colors: {
        // Brand — Emerald-teal, perceptually balanced across all 10 steps
        brand: {
          50:  '#E3FAF2',
          100: '#C0F3E2',
          200: '#8EEACB',
          300: '#4DD9AC',
          400: '#1DC48E',   // primary CTA
          500: '#1D9E75',   // default brand
          600: '#187D5D',
          700: '#125D45',
          800: '#0C3F2F',
          900: '#06221A',
          950: '#031109',
        },

        // Surface — near-black warm neutrals (dark-mode-first)
        surface: {
          0:   '#080807',   // deepest bg — page body
          50:  '#0F0E0C',   // app background
          100: '#141311',   // subtle elevation
          200: '#1A1917',   // card base
          300: '#201F1C',   // card hover
          400: '#272522',   // elevated card
          500: '#302E2A',   // border / divider
          600: '#3D3B36',   // muted border
          700: '#524F49',   // disabled surface
          800: '#706C65',   // placeholder text
          900: '#969189',   // muted text
          950: '#B8B3AA',   // secondary text
        },

        // Ink — pure neutral text scale (semantic aliases in CSS vars)
        ink: {
          50:  '#F7F6F3',
          100: '#EDECEA',
          200: '#D4D1CB',
          300: '#B4B0A8',
          400: '#94908A',
          500: '#74706A',
          600: '#55524D',
          700: '#3A3834',
          800: '#211F1D',
          900: '#0F0E0C',
        },

        // Glass — translucent overlays used in glassmorphism
        glass: {
          white5:  'rgba(255,255,255,0.05)',
          white8:  'rgba(255,255,255,0.08)',
          white12: 'rgba(255,255,255,0.12)',
          white16: 'rgba(255,255,255,0.16)',
          white24: 'rgba(255,255,255,0.24)',
          black40: 'rgba(0,0,0,0.40)',
          black60: 'rgba(0,0,0,0.60)',
          black80: 'rgba(0,0,0,0.80)',
          brand8:  'rgba(29,158,117,0.08)',
          brand12: 'rgba(29,158,117,0.12)',
          brand20: 'rgba(29,158,117,0.20)',
          brand32: 'rgba(29,158,117,0.32)',
        },

        // Semantic status colors
        success: {
          DEFAULT: '#1D9E75',
          light:   '#4DD9AC',
          dark:    '#0C3F2F',
          subtle:  'rgba(29,158,117,0.12)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light:   '#FCD34D',
          dark:    '#78350F',
          subtle:  'rgba(245,158,11,0.12)',
        },
        danger: {
          DEFAULT: '#EF4444',
          light:   '#FCA5A5',
          dark:    '#7F1D1D',
          subtle:  'rgba(239,68,68,0.10)',
        },
        info: {
          DEFAULT: '#3B82F6',
          light:   '#93C5FD',
          dark:    '#1E3A8A',
          subtle:  'rgba(59,130,246,0.10)',
        },

        // Light-mode palette (CSS vars take over, these are fallbacks)
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
      },

      // ─── Spacing ───────────────────────────────────────────────────────────
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
        '26':  '6.5rem',
        '30':  '7.5rem',
        '34':  '8.5rem',
      },

      // ─── Border Radius ─────────────────────────────────────────────────────
      borderRadius: {
        'xs':  '0.25rem',
        'sm':  '0.375rem',
        DEFAULT: '0.5rem',
        'md':  '0.625rem',
        'lg':  '0.75rem',
        'xl':  '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
        '5xl': '2rem',
        '6xl': '2.5rem',
      },

      // ─── Blur ──────────────────────────────────────────────────────────────
      blur: {
        'xs':   '2px',
        'sm':   '4px',
        DEFAULT: '8px',
        'md':   '12px',
        'lg':   '16px',
        'xl':   '24px',
        '2xl':  '40px',
        '3xl':  '64px',
        '4xl':  '96px',
      },

      // ─── Backdrop Blur ─────────────────────────────────────────────────────
      backdropBlur: {
        'xs':   '2px',
        'sm':   '4px',
        DEFAULT: '8px',
        'md':   '12px',
        'lg':   '16px',
        'xl':   '24px',
        '2xl':  '40px',
        '3xl':  '64px',
      },

      // ─── Box Shadow ────────────────────────────────────────────────────────
      boxShadow: {
        // Elevation system — warm-tinted shadows for dark UI
        'elev-1': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'elev-2': '0 4px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)',
        'elev-3': '0 10px 15px rgba(0,0,0,0.4), 0 4px 6px rgba(0,0,0,0.25)',
        'elev-4': '0 20px 25px rgba(0,0,0,0.45), 0 10px 10px rgba(0,0,0,0.2)',
        'elev-5': '0 32px 48px rgba(0,0,0,0.5), 0 16px 24px rgba(0,0,0,0.25)',

        // Brand glow
        'glow-brand-sm': '0 0 12px rgba(29,158,117,0.25)',
        'glow-brand':    '0 0 24px rgba(29,158,117,0.30), 0 4px 16px rgba(29,158,117,0.15)',
        'glow-brand-lg': '0 0 48px rgba(29,158,117,0.35), 0 8px 32px rgba(29,158,117,0.20)',

        // Glass panel — inset highlight on top edge
        'glass-sm': '0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 12px rgba(0,0,0,0.35)',
        'glass':    '0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 24px rgba(0,0,0,0.4)',
        'glass-lg': '0 1px 0 rgba(255,255,255,0.10) inset, 0 16px 48px rgba(0,0,0,0.5)',

        // Status shadows
        'glow-danger':  '0 0 20px rgba(239,68,68,0.25)',
        'glow-warning': '0 0 20px rgba(245,158,11,0.25)',
        'glow-success': '0 0 20px rgba(29,158,117,0.25)',

        // Inner shadows for inset UI elements
        'inner-sm': 'inset 0 1px 3px rgba(0,0,0,0.4)',
        'inner':    'inset 0 2px 6px rgba(0,0,0,0.5)',
        'inner-lg': 'inset 0 4px 12px rgba(0,0,0,0.6)',
      },

      // ─── Background Image ──────────────────────────────────────────────────
      backgroundImage: {
        // Gradient meshes
        'brand-gradient':   'linear-gradient(135deg, #1D9E75 0%, #4DD9AC 100%)',
        'brand-gradient-v': 'linear-gradient(180deg, #1D9E75 0%, #0C3F2F 100%)',
        'dark-gradient':    'linear-gradient(180deg, #0F0E0C 0%, #141311 100%)',
        'surface-gradient': 'linear-gradient(135deg, #1A1917 0%, #0F0E0C 100%)',

        // Glassmorphism shimmer
        'glass-shimmer':    'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
        'glass-top-edge':   'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',

        // Noise texture overlay (applied via ::after pseudo)
        'noise':            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",

        // Ambient background glow
        'ambient-teal':     'radial-gradient(ellipse 800px 600px at 50% -100px, rgba(29,158,117,0.12) 0%, transparent 70%)',
        'ambient-teal-sm':  'radial-gradient(ellipse 400px 300px at 50% 0%, rgba(29,158,117,0.08) 0%, transparent 70%)',
      },

      // ─── Opacity ───────────────────────────────────────────────────────────
      opacity: {
        '2':  '0.02',
        '3':  '0.03',
        '4':  '0.04',
        '6':  '0.06',
        '7':  '0.07',
        '8':  '0.08',
        '12': '0.12',
        '15': '0.15',
        '16': '0.16',
        '24': '0.24',
        '32': '0.32',
        '48': '0.48',
        '56': '0.56',
        '72': '0.72',
        '84': '0.84',
        '92': '0.92',
        '96': '0.96',
      },

      // ─── Z-Index ───────────────────────────────────────────────────────────
      zIndex: {
        '1':    '1',
        '2':    '2',
        '5':    '5',
        '15':   '15',
        '25':   '25',
        '35':   '35',
        '45':   '45',
        '60':   '60',
        '70':   '70',
        '80':   '80',
        '90':   '90',
        '100':  '100',
        '200':  '200',
        '300':  '300',
        '500':  '500',
        '999':  '999',
        '1000': '1000',
        '9999': '9999',
      },

      // ─── Transitions ───────────────────────────────────────────────────────
      transitionDuration: {
        '80':  '80ms',
        '120': '120ms',
        '180': '180ms',
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      transitionTimingFunction: {
        'spring':      'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'out-expo':    'cubic-bezier(0.19, 1, 0.22, 1)',
        'in-expo':     'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'in-out-soft': 'cubic-bezier(0.45, 0, 0.55, 1)',
        'snap':        'cubic-bezier(0.87, 0, 0.13, 1)',
      },

      // ─── Animations ────────────────────────────────────────────────────────
      animation: {
        // Entrances
        'fade-up':       'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'fade-up-sm':    'fadeUpSm 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'fade-down':     'fadeDown 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':       'fadeIn 0.3s ease both',
        'scale-in':      'scaleIn 0.25s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in-sm':   'scaleInSm 0.2s cubic-bezier(0.16,1,0.3,1) both',
        'slide-up':      'slideUp 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'slide-down':    'slideDown 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-left': 'slideInLeft 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-right':'slideInRight 0.35s cubic-bezier(0.16,1,0.3,1) both',

        // Micro-interactions
        'bounce-in':    'bounceIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'pop':          'pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
        'shake':        'shake 0.4s ease both',
        'wiggle':       'wiggle 0.5s ease both',

        // Continuous
        'spin':         'spin 1s linear infinite',
        'spin-slow':    'spin 3s linear infinite',
        'pulse':        'pulse 2s ease infinite',
        'pulse-slow':   'pulse 3s ease infinite',
        'ping':         'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
        'float':        'float 4s ease-in-out infinite',
        'shimmer':      'shimmer 1.6s linear infinite',
        'glow-pulse':   'glowPulse 2.5s ease-in-out infinite',

        // Glass effect
        'glass-shine':  'glassShine 3s ease-in-out infinite',
      },

      keyframes: {
        // Entrances
        fadeUp:       { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeUpSm:     { from: { opacity: '0', transform: 'translateY(8px)' },  to: { opacity: '1', transform: 'translateY(0)' } },
        fadeDown:     { from: { opacity: '0', transform: 'translateY(-12px)' },to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:       { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn:      { from: { opacity: '0', transform: 'scale(0.90)' }, to: { opacity: '1', transform: 'scale(1)' } },
        scaleInSm:    { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideUp:      { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        slideDown:    { from: { transform: 'translateY(-100%)' }, to: { transform: 'translateY(0)' } },
        slideInLeft:  { from: { opacity: '0', transform: 'translateX(-24px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(24px)' },  to: { opacity: '1', transform: 'translateX(0)' } },

        // Micro
        bounceIn:  { '0%': { transform: 'scale(0.8)', opacity: '0' }, '60%': { transform: 'scale(1.15)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        pop:       { '0%': { transform: 'scale(0.9)', opacity: '0' }, '70%': { transform: 'scale(1.05)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        shake:     { '0%,100%': { transform: 'translateX(0)' }, '20%,60%': { transform: 'translateX(-6px)' }, '40%,80%': { transform: 'translateX(6px)' } },
        wiggle:    { '0%,100%': { transform: 'rotate(0deg)' }, '25%': { transform: 'rotate(-8deg)' }, '75%': { transform: 'rotate(8deg)' } },

        // Continuous
        pulse:     { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.45' } },
        ping:      { '75%,100%': { transform: 'scale(2)', opacity: '0' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer:   { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 16px rgba(29,158,117,0.2)' }, '50%': { boxShadow: '0 0 32px rgba(29,158,117,0.45)' } },
        glassShine:{ '0%,100%': { backgroundPosition: '-200% 0' }, '50%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
