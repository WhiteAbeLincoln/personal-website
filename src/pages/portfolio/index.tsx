import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import Typography from '@comps/typography'
import Card, { CardList } from '@comps/Card'
import { fromEntries } from '@util/util'
import { makeStyles } from '@material-ui/styles'
import { ClassesProp } from '@util/types'
import Checkbox from '@comps/Checkbox'
import { spacing, wrappedRow } from '@src/styles/theme'
import { graphql } from 'gatsby'
import { PortfolioPagesQuery } from '@src/graphql.gen'
import { isTruthy } from '@util/functional/predicates'
import Layout from '@comps/Layout'

const MANUAL_ITEMS: Array<{
  title: string
  summary: string
  to: string
  tags: string[]
}> = []

const useStyles = makeStyles(theme => ({
  cards: {
    width: '100%',
  },
  checkboxes: {
    ...wrappedRow(spacing(theme)(2), spacing(theme)(1))(theme),
    paddingBottom: spacing(theme)(1),
    width: '100%',
  },
}))

export const PortfolioTemplate = ({
  className,
  items,
  ...props
}: {
  items: Array<{ title: string; summary: string; to: string; tags: string[] }>
} & ClassesProp<typeof useStyles>) => {
  const classes = useStyles(props)

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
      <Layout className={className}>
        <div className={classes.checkboxes}>
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
          className={classes.cards}
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
              <Typography paragraph>{i.summary}</Typography>
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
          summary
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
          summary
          tags
        }
      }
    }
  }
`

export default Portfolio
