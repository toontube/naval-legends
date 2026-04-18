import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const daily = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/daily' }),
  schema: z.object({
    hook: z.string(),
    reveal: z.string(),
    year: z.number(),
    ship: z.string(),
    image: z.string().optional(),
    linkedStory: z.string(),
    order: z.number(),
  }),
});

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()),
    readingTime: z.number(),
  }),
});

export const collections = { daily, stories };
