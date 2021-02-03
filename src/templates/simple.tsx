import React from 'react'
import Container from '@comps/Container'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { SimplePageQueryQuery } from '../graphql.gen'
import SEO from '@comps/SEO'
import Layout from '@comps/Layout'
import { makeStyles, ThemeProvider } from '@material-ui/styles'
import { markdownTheme } from '@src/styles/theme'

const useStyles = makeStyles({
  root: {
    '& ul, ol': {
      marginLeft: '2ch',
    },
  },
})

export const SimpleTemplate = ({ body }: { body: string }) => {
  const classes = useStyles()
  return (
    <Container className={classes.root}>
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
        <ThemeProvider theme={markdownTheme}>
          <SimpleTemplate body={body} />
        </ThemeProvider>
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
