import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import type { APIContext } from 'astro'

export async function GET(context: APIContext) {
  const blog: any[] = await getCollection('writing')
  return rss({
    title: "Abe's Blog",
    site: context.site || '',
    description: "Writing and thoughts on just about anything",
    items: blog.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      customData: post.data.customData,
      link: `/writing/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`
  })
}
