import { css } from '@linaria/core'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import React from 'react'
import { SimplePageQueryQuery } from '../graphql.gen'
import Container from '@src/components/Container'
import Layout from '@src/components/Layout'
import SEO from '@src/components/SEO'
import { clsx } from '@src/styles'

export const SimpleTemplate = ({
  body,
  className,
}: {
  body: string
  className?: string
}) => {
  return (
    <Container
      className={clsx(
        className,
        css`
          & ul,
          ol {
            margin-left: 2ch;
          }
        `,
      )}
    >
      <article>
        <MDXRenderer>{body}</MDXRenderer>
      </article>
    </Container>
  )
}

const Simple = ({ data: { mdx } }: { data: SimplePageQueryQuery }) => {
  const body = mdx?.body ?? ''
  const title = mdx?.frontmatter?.title ?? undefined
  const seo = mdx?.frontmatter?.seo ?? undefined
  return (
    <>
      <SEO title={title} seo={seo} />
      <Layout>
        <SimpleTemplate body={body} />
      </Layout>
    </>
  )
}

export const pageQuery = graphql`
  query SimplePageQuery($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        seo {
          ...SEOFragment
        }
        title
      }
      body
    }
  }
`

export default Simple
