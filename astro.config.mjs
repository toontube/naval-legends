// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// lastmod for story URLs, from each story's frontmatter (updated, else date).
const storyDates = Object.fromEntries(
  readdirSync('./src/content/stories').filter((f) => f.endsWith('.md')).map((f) => {
    const fm = readFileSync(`./src/content/stories/${f}`, 'utf8').split('---')[1];
    const get = (k) => fm.match(new RegExp(`^${k}:\\s*(\\S+)`, 'm'))?.[1];
    return [get('slug'), get('updated') ?? get('date')];
  }),
);

// https://astro.build/config
export default defineConfig({
  site: 'https://brvzulu.com',
  trailingSlash: 'always',
  integrations: [react(), sitemap({
    serialize(item) {
      const slug = item.url.match(/\/stories\/([^/]+)\/$/)?.[1];
      if (slug && storyDates[slug]) item.lastmod = new Date(storyDates[slug]).toISOString();
      return item;
    },
  })],
});
