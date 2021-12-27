import { css } from '@linaria/core'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import Card, { CardList } from '@src/components/Card'
import Checkbox from '@src/components/Checkbox'
import Layout from '@src/components/Layout'
import Typography from '@src/components/typography'
import { PortfolioPagesQuery } from '@src/graphql.gen'
import { spacing } from '@src/styles'
import { fromEntries } from '@src/util'
import { isTruthy } from '@src/util/functional/predicates'

const styles = {
  cards: css`
    width: 100%;
  `,
  checkboxes: css`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${spacing(2)};
    row-gap: ${spacing(1)};
    padding-bottom: ${spacing(1)};
    width: 100%;
  `,
}

type Item = {
  title: string
  summary: string | { body: string }
  to: string
  tags: string[]
}

const MANUAL_ITEMS: Item[] = []

export const PortfolioTemplate = ({ items }: { items: Item[] }) => {
  const tags = [
    ...new Set(
      items.reduce((acc, i) => (acc.push(...i.tags), acc), [] as string[]),
    ),
  ]
  const [filter, setFilter] = useState(
    fromEntries(tags.map(t => [t, false] as [string, boolean])),
  )

  const getItems = (): typeof items => {
    const filterKeys = Object.entries(filter).reduce((acc, [key, value]) => {
      if (value) acc.push(key)
      return acc
    }, [] as string[])
    return filterKeys.length === 0
      ? items
      : items.filter(i => i.tags.some(t => filterKeys.includes(t)))
  }

  return (
    <>
      <Helmet>
        <title>Abraham White - Portfolio</title>
      </Helmet>
      <Layout>
        <div className={styles.checkboxes}>
          {tags.map(t => (
            <Checkbox
              key={t}
              label={t}
              checked={filter[t]}
              onChange={() => setFilter(old => ({ ...old, [t]: !old[t] }))}
            />
          ))}
        </div>
        <CardList
          className={styles.cards}
          items={getItems()}
          getKey={i => i.to}
        >
          {i => (
            <Card
              link={i.to}
              title={i.title}
              footer={
                <>
                  {i.tags.map(t => (
                    <Typography key={t} variant="subtitle2" component="span">
                      {t}
                    </Typography>
                  ))}
                </>
              }
            >
              {typeof i.summary === 'string' ? (
                <Typography paragraph>{i.summary}</Typography>
              ) : (
                <MDXRenderer>{i.summary.body}</MDXRenderer>
              )}
            </Card>
          )}
        </CardList>
      </Layout>
    </>
  )
}

const Portfolio = ({
  data: { autoPages, manualPages },
}: {
  data: PortfolioPagesQuery
}) => {
  const items = [...autoPages.nodes, ...manualPages.nodes].reduce(
    (acc, n) => {
      const { title, summary, tags } = n.frontmatter ?? {}
      if (title && n.slug) {
        acc.push({
          title,
          summary: summary ?? '',
          tags: tags?.filter(isTruthy) ?? [],
          to: `/${n.slug}`,
        })
      }
      return acc
    },
    [...MANUAL_ITEMS],
  )

  return <PortfolioTemplate items={items} />
}

export const pageQuery = graphql`
  query PortfolioPages {
    autoPages: allMdx(
      filter: {
        fields: { fileRelativePath: { glob: "src/data/pages/portfolio/*" } }
      }
    ) {
      nodes {
        slug
        frontmatter {
          title
          summary {
            body
          }
          tags
        }
      }
    }
    manualPages: allMdx(
      filter: {
        fields: { fileRelativePath: { glob: "src/pages/portfolio/*" } }
      }
    ) {
      nodes {
        slug
        frontmatter {
          title
          summary {
            body
          }
          tags
        }
      }
    }
  }
`

export default Portfolio
