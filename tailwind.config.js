/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'Oswald', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        tech: ['Orbitron', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        space: {
          900: '#0b0f1a',
          800: '#0d1117',
          700: '#090d16',
        },
        neon: {
          cyan: '#00f0ff',
          pink: '#ff3ea5',
          violet: '#7c3aed',
        },
      },
      boxShadow: {
        neon: '0 0 15px rgba(0,240,255,0.4)',
        neonHover: '0 0 20px rgba(0,240,255,0.6)',
        holo: '0 18px 46px rgba(14,116,144,0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        hud: '1.75rem',
      },
      transitionDuration: {
        250: '250ms',
        450: '450ms',
      },
      backgroundImage: {
        'grid-glow': 'linear-gradient(115deg, rgba(56,189,248,0.08) 0%, rgba(15,23,42,0.8) 60%)',
        'nebula': 'radial-gradient(circle at 20% 20%, rgba(14,165,233,0.4), rgba(15,23,42,0) 55%), radial-gradient(circle at 80% 10%, rgba(124,58,237,0.35), rgba(15,23,42,0) 55%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0, -2px, 0)' },
          '50%': { transform: 'translate3d(0, 4px, 0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.75' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
