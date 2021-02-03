import React from 'react'
import useMediaQuery from '@util/hooks/useMediaQuery'
import { Link } from 'gatsby'
import { Nav } from '@comps/Nav'
import { spacing, bp_gt, bp_lt } from '@styles/theme'
import Typography from '@comps/typography'
import { hideVisually } from 'polished'
import { makeStyles } from '@material-ui/styles'
import { ClassesProp } from '@util/types'
import { clsx } from '@util/util'

const useStyles = makeStyles(theme => ({
  root: {
    [bp_gt('sm')(theme)]: {
      minHeight: '4rem',
    },
    [`${bp_gt('xs')(theme)} and (orientation: landscape)`]: {
      minHeight: '3rem',
    },
    minHeight: '3.5rem',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    borderBottom: '0.15rem solid black',
    paddingLeft: spacing(theme)(2),
    paddingRight: spacing(theme)(2),
    [bp_gt('sm')(theme)]: {
      paddingLeft: spacing(theme)(3),
      paddingRight: spacing(theme)(3),
    },
    [bp_lt('xs')(theme)]: {
      flexDirection: 'column',
    },
  },
  header: {
    ...theme.typography.h1,
    fontSize: '1.5rem !important',
    fontWeight: 400,
    [bp_lt('xs')(theme)]: {
      marginTop: spacing(theme)(1),
      marginBottom: spacing(theme)(1),
    },
  },
  link: {
    textDecoration: 'none',
    color: 'inherit !important',
  },
  nav: {
    justifyContent: 'flex-end',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    [bp_lt('xs')(theme)]: {
      justifyContent: 'unset',
      marginBottom: 0,
    },
  },
}))

const Header = ({ className, ...props }: ClassesProp<typeof useStyles>) => {
  const classes = useStyles(props)
  const isSm = useMediaQuery(bp_lt('xs'))
  return (
    <header className={clsx(classes.root, className)}>
      <Typography component="h1" className={classes.header}>
        <Link aria-label="Home" className={classes.link} to="/">
          AW
        </Link>
      </Typography>
      <Nav
        className={classes.nav}
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
