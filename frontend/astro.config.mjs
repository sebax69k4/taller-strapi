// @ts-check


import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'server', // O 'hybrid'
  vite: {
    plugins: [tailwindcss()]
  },

  adapter: node({
    mode: 'standalone'
  })
});