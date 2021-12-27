/* eslint-env node, es6 */
import { css } from '@linaria/core'
import React from 'react'
import { Helmet } from 'react-helmet'
import Container from '@src/components/Container'
import Link from '@src/components/GLink'
import Typography from '@src/components/typography'
import { spacing } from '@src/styles'

const codeStyles = css`
  color: #8a6534;
  padding: 4px;
  background-color: #fff4db;
  font-size: 1.25rem;
  border-radius: 4px;
`

// markup
const NotFoundPage = () => (
  <>
    <Helmet>
      <title>404: Not Found</title>
    </Helmet>
    <Container
      component="main"
      className={css`
        display: flex;
        padding: ${spacing(1)};
        align-items: center;
        justify-content: center;
        flex-direction: column;
        min-height: 100vh;
      `}
    >
      <Typography gutterBottom variant="h1">
        404
      </Typography>
      <Typography paragraph>
        Sorry, the page you are looking doesn&apos;t exist.
        <br />
        {process.env.NODE_ENV === 'development' ? (
          <>
            <br />
            Try creating a page in{' '}
            <code className={codeStyles}>src/pages/</code>.
            <br />
          </>
        ) : null}
        <br />
        <Link to="/">Go home</Link>.
      </Typography>
    </Container>
  </>
)

export default NotFoundPage
