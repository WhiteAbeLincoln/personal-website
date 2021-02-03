/* eslint-env node, es6 */
import React from 'react'
import { Helmet } from 'react-helmet'
import Typography from '@comps/typography'
import Link from '@comps/GLink'
import Container from '@comps/Container'
import { makeStyles } from '@material-ui/styles'
import { spacing } from '@src/styles/theme'

const codeStyles = {
  color: '#8A6534',
  padding: 4,
  backgroundColor: '#FFF4DB',
  fontSize: '1.25rem',
  borderRadius: 4,
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    padding: spacing(theme)(1),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: '100vh',
  }
}))

// markup
const NotFoundPage = () => {
  const classes = useStyles()
  return (
    <>
      <Helmet>
        <title>404: Not Found</title>
      </Helmet>
      <Container
        component="main"
        className={classes.root}
      >
        <Typography gutterBottom variant="h1">
          404
        </Typography>
        <Typography paragraph>
          Sorry, the page you are looking doesn't exist.
          <br />
          {process.env.NODE_ENV === 'development' ? (
            <>
              <br />
              Try creating a page in <code style={codeStyles}>src/pages/</code>.
              <br />
            </>
          ) : null}
          <br />
          <Link to="/">Go home</Link>.
        </Typography>
      </Container>
    </>
  )
}

export default NotFoundPage
