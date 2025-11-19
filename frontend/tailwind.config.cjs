/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#135bec",
        "background-light": "#F4F7FA",
        "background-dark": "#101622",
        "neutral-gray-light": "#7D879C",
        "neutral-gray-dark": "#A0AEC0",
        "status-green": "#2ECC71",
        "status-yellow": "#F39C12",
        "status-red": "#E74C3C",
        "border-light": "#E2E8F0",
        "border-dark": "#2D3748",
        "surface-light": "#FFFFFF",
        "surface-dark": "#1A202C",
        "text-light": "#1A202C",
        "text-dark": "#E2E8F0",
        "text-secondary-light": "#718096",
        "text-secondary-dark": "#A0AEC0",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
