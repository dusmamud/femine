import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://femine.pages.dev',
  // Sitemap lists only pages worth indexing: /offline/ (the offline
  // fallback) and /search/ (a utility page with no search value) are out.
  integrations: [sitemap({
    filter: (page) =>
      page !== 'https://femine.pages.dev/offline/' &&
      page !== 'https://femine.pages.dev/search/',
  })],
  vite: { plugins: [tailwindcss()] },
});
