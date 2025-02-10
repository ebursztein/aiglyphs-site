// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import tailwind from '@astrojs/tailwind';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), tailwind(), icon()],
  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          console.log('Build warning:', warning);
        }
      }
    },
    resolve: {
      alias: {
        events: 'events-browserify',  // This might help
      }
    }
  }
});