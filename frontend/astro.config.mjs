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

  server: {
    host: true, // <--- ESTO ES LO IMPORTANTE
    port: Number(process.env.PORT) || 4321 // Opcional, pero recomendado
  },
  
  adapter: node({
    mode: 'standalone'
  })
});