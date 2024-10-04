import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getTitle } from '../util/util'
import { getWriting } from '../content/config'

export async function GET(context: APIContext) {
  const blog = await getWriting()

  const items = await Promise.all(blog.map(async post => {
    const title = await getTitle(post.data, () => post.render().then(r => r.headings)) ?? post.slug
    return {
      title,
      pubDate: post.data.pubDate,
      description: post.data.summary,
      link: `/writing/${post.slug}/`,
    }
  }))
  return rss({
    title: "Abe's Blog",
    site: context.site || '',
    description: "Writing and thoughts on just about anything",
    items,
    customData: `<language>en-us</language>`
  })
}
