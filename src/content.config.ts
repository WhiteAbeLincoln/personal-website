import { defineCollection, getCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const portfolioCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.optional(z.string()),
    summary: z.string(),
    tags: z.array(z.string()),
    order: z.optional(z.number()),
    draft: z.optional(z.boolean()),
  }),
})

const writingCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.optional(z.string()),
    summary: z.optional(z.string()),
    tags: z.optional(z.array(z.string())),
    draft: z.optional(z.boolean()),
    pubDate: z.optional(z.coerce.date()),
    updatedDate: z.optional(z.coerce.date()),
  }),
})

export const getWriting = () => getCollection('writing', ({ data }) =>
  import.meta.env.PROD ? data.draft !== true && data.pubDate : true
)

export const getPortfolio = () => getCollection('portfolio', ({ data }) =>
  import.meta.env.PROD ? data.draft !== true : true
)

export const collections = {
  'portfolio': portfolioCollection,
  'writing': writingCollection,
}
