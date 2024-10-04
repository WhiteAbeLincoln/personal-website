import { z, defineCollection, getCollection } from 'astro:content';

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

const writingCollection = defineCollection({
  schema: z.object({
    title: z.optional(z.string()),
    summary: z.optional(z.string()),
    tags: z.optional(z.array(z.string())),
    draft: z.optional(z.boolean()),
    pubDate: z.optional(z.date({ coerce: true })),
    updatedDate: z.optional(z.date({ coerce: true })),
  }),
  type: 'content',
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
