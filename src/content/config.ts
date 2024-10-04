import { z, defineCollection } from 'astro:content';

const portfolioCollection = defineCollection({
  schema: z.object({
    title: z.optional(z.string()),
    summary: z.string(),
    tags: z.array(z.string()),
    order: z.optional(z.number()),
    draft: z.optional(z.boolean()),
  }),
  type: 'content',
})

export const collections = {
  'portfolio': portfolioCollection,
}
