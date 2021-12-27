import { graphql } from 'gatsby'
import React from 'react'
import Helmet from 'react-helmet'
import { Seo } from '../graphql.gen'

export type SeoOptions = { title?: string; seo?: Seo }

export const SEOFragment = graphql`
  fragment SEOFragment on SEO {
    description
    title
    keywords
    author
    image
    lang
    meta {
      name
      content
    }
  }
`

const metaDescription = (content: string) => [
  { name: 'description', content },
  { property: 'og:description', content },
]

const metaAuthor = (content: string) => [
  { name: 'author', content },
  { name: 'twitter:creator', content },
]

const SEO = (props: SeoOptions) => {
  const seo = props.seo
  const description = seo?.description ?? ''
  const lang = seo?.lang ?? 'en'
  const meta = seo?.meta ?? []
  const keywords = seo?.keywords ?? []
  const title = seo?.title ?? props.title
  const author = seo?.author ?? undefined
  const image = seo?.image ?? undefined
  const site_name = 'Abraham White'
  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site_name}`}
      meta={[
        { property: 'og:title', content: title },
        { property: `og:type`, content: `website` },
        { property: 'og:site_name', content: site_name },
        { name: `twitter:card`, content: `summary` },
        ...metaDescription(description),
        ...(author ? metaAuthor(author) : []),
      ]
        .concat(
          keywords && keywords.length > 0
            ? {
                name: 'keywords',
                content: keywords.join(`, `),
              }
            : [],
        )
        .concat(image ? { property: 'og:image', content: image } : [])
        .concat(meta || [])}
    />
  )
}

export default SEO
