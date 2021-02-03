import React from 'react'
import Container from '@comps/Container'
import Typography from '@comps/typography'
import { Helmet } from 'react-helmet'
import { defaultLinks, Nav } from '@comps/Nav'
import { bp_lt, spacing } from '@styles/theme'
import { clsx } from '@util/util'
import { makeStyles } from '@material-ui/styles'
import { ClassesProp } from '@util/types'
import useMediaQuery from '@util/hooks/useMediaQuery'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    padding: spacing(theme)(1),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  heading: { textAlign: 'center', lineHeight: 1 },
  para: {
    textAlign: 'center',
    marginTop: spacing(theme)(8),
    marginBottom: spacing(theme)(8),
    fontSize: '1.25rem !important',
    [bp_lt('xs')(theme)]: {
      textAlign: 'unset',
    },
  },
  nav: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    [bp_lt('xs')(theme)]: {
      justifyContent: 'unset',
    },
  },
}))

const IndexPage = ({ className, ...props }: ClassesProp<typeof useStyles>) => {
  const isSm = useMediaQuery(bp_lt('sm'))
  const classes = useStyles(props)
  return (
    <>
      <Helmet>
        <title>Abraham White</title>
      </Helmet>
      <Container
        component="main"
        className={clsx(
          classes.root,
          className,
        )}
      >
        <Typography className={classes.heading} variant="display">
          Abraham White
        </Typography>
        <Typography className={classes.para} paragraph>
          A full-stack web developer with a passion for programming language
          design and type theory. I love the intersection of our messy world
          with mathematics, and I believe that using math to model problems
          leads to safe and elegant programs.
        </Typography>
        <Nav
          links={defaultLinks.filter(l => l.to !== '/')}
          linkProps={{ size: isSm ? 'small' : 'large' }}
          className={classes.nav}
        />
      </Container>
    </>
  )
}

export default IndexPage
