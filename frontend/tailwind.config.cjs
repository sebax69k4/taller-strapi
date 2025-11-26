/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // Blue 600
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1F2937', // Gray 800
        },
        background: {
          light: '#F3F4F6', // Gray 100
          dark: '#111827', // Gray 900
        },
        text: {
          light: '#111827', // Gray 900
          dark: '#F9FAFB', // Gray 50
          muted: {
            light: '#6B7280', // Gray 500
            dark: '#9CA3AF', // Gray 400
          }
        },
        border: {
          light: '#E5E7EB', // Gray 200
          dark: '#374151', // Gray 700
        },
        status: {
          success: '#10B981', // Emerald 500
          warning: '#F59E0B', // Amber 500
          error: '#EF4444', // Red 500
          info: '#3B82F6', // Blue 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
