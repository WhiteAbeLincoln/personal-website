import { css } from '@linaria/core'
import { Link } from 'gatsby'
import { hideVisually } from 'polished'
import React from 'react'
import { Nav } from '@src/components/Nav'
import Typography from '@src/components/typography'
import { spacing, bp_gt, bp_lt, typography } from '@src/styles'
import useMediaQuery from '@src/util/hooks/useMediaQuery'

const styles = {
  root: css`
    ${bp_gt('sm')} {
      min-height: 4rem;
    }
    ${bp_gt('xs') + ' and (orientation: landscape)'} {
      min-height: 3rem;
    }
    min-height: 3.5rem;
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    border-bottom: 0.15rem solid black;
    padding-left: ${spacing(2)};
    padding-right: ${spacing(2)};
    ${bp_gt('sm')} {
      padding-left: ${spacing(3)};
      padding-right: ${spacing(3)};
    }
    ${bp_lt('xs')} {
      flex-direction: column;
      padding-bottom: ${spacing(1)};
    }
  `,
  header: css`
    ${typography('h1')}
    font-size: 1.5rem !important;
    font-weight: 400;
    ${bp_lt('xs')} {
      margin-top: ${spacing(1)};
      margin-bottom: ${spacing(1)};
    }
  `,
  link: css`
    text-decoration: none;
    color: inherit !important;
  `,
  nav: css`
    justify-content: flex-end;
    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    ${bp_lt('xs')} {
      justify-content: unset;
    }
    gap: ${spacing(1)};
  `,
}

const Header = ({ ...props }: { className?: string }) => {
  const isSm = useMediaQuery(bp_lt('xs'))
  return (
    <header className={styles.root} {...props}>
      <Typography component="h1" className={styles.header}>
        <Link aria-label="Home" className={styles.link} to="/">
          AW
        </Link>
      </Typography>
      <Nav
        className={styles.nav}
        getProps={({ to }, rest) => ({
          ...rest,
          style: {
            ...rest.style,
            ...(isSm && to === '/' ? hideVisually() : undefined),
          },
        })}
      />
    </header>
  )
}

export default Header
