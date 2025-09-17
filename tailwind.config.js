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
      },
      borderRadius: {
        '2xl': '1rem',
      },
      transitionDuration: {
        250: '250ms',
      },
    },
  },
  plugins: [],
}
