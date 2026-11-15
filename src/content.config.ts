import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog articles live as one Markdown file each in src/content/blog/.
// Adding an article = adding one file; the listing and article pages
// below pick it up automatically.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      pubDate: z.date(),
      category: z.string(),
      image: image(),
      imageAlt: z.string(),
      readingMinutes: z.number(),
    }),
});

export const collections = { blog };
