/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transit: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#0047BA',
          600: '#003994',
          700: '#002e77',
        },
        ink: {
          primary: '#0F172A',
          secondary: '#334155',
          muted: '#64748B',
          light: '#94A3B8',
        },
        surface: {
          canvas: '#F8FAFC',
          card: '#FFFFFF',
          subtle: '#F1F5F9',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
