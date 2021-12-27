import { css } from '@linaria/core'
import React from 'react'
import { Helmet } from 'react-helmet'
import Container from '@src/components/Container'
import { defaultLinks, Nav } from '@src/components/Nav'
import Typography from '@src/components/typography'
import {
  spacing,
  bp_lt,
  clsx,
  displayThemeModular,
  theme,
  ThemeProvider,
} from '@src/styles'
import useMediaQuery from '@src/util/hooks/useMediaQuery'

const styles = {
  container: css`
    display: flex;
    padding: ${spacing(1)};
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 100vh;
  `,
  header: css`
    text-align: center;
    line-height: 1;
  `,
  paragraph: css`
    text-align: center;
    margin-top: ${spacing(8)} !important; /* REMOVE */
    margin-bottom: ${spacing(8)} !important; /* REMOVE */
    font-size: 1.25rem !important;
    ${bp_lt('xs')} {
      text-align: unset;
    }
  `,
  nav: css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
    ${bp_lt('xs')} {
      justify-content: unset;
      gap: ${spacing(1)};
    }
  `,
}

const IndexPage = () => {
  const isSm = useMediaQuery(bp_lt('sm'))
  return (
    <>
      <Helmet>
        <title>Abraham White</title>
      </Helmet>
      <ThemeProvider theme={theme} modTypography={displayThemeModular}>
        {className => (
          <Container
            component="main"
            className={clsx(styles.container, className)}
          >
            <Typography className={styles.header} variant="display">
              Abraham White
            </Typography>
            <Typography className={styles.paragraph} paragraph>
              I&apos;m a full-stack developer with a passion for programming
              language design and type theory. I love the intersection of our
              messy world with mathematics, and I believe that using math to
              model problems leads to safe and elegant solutions.
            </Typography>
            <Nav
              links={defaultLinks.filter(l => l.to !== '/')}
              linkProps={{ size: isSm ? 'small' : 'large' }}
              className={styles.nav}
            />
          </Container>
        )}
      </ThemeProvider>
    </>
  )
}

export default IndexPage
