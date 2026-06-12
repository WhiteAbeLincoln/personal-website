import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { render } from 'astro:content'
import { getTitle } from '../util/util'
import { getWriting } from '../content.config'

export async function GET(context: APIContext) {
  const blog = await getWriting()

  const items = await Promise.all(blog.map(async post => {
    const title = await getTitle(post.data, () => render(post).then(r => r.headings)) ?? post.id
    return {
      title,
      pubDate: post.data.pubDate,
      description: post.data.summary,
      link: `/writing/${post.id}/`,
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
