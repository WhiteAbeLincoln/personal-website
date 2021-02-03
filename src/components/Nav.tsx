import React from 'react'
import ButtonLink, { ButtonLinkProps } from '@comps/ButtonLink'
import { makeStyles } from '@material-ui/styles'
import { bp_lt, spacing } from '@styles/theme'
import { ClassesProp } from '@util/types'
import { clsx } from '@util/util'
import { GetProps } from './LinkWrapper'

type LinkDef = { readonly name: string; readonly to: string }
type Links = readonly LinkDef[]

export const defaultLinks: Links = [
  { name: 'Home', to: '/' },
  { name: 'Portfolio', to: '/portfolio' },
  { name: 'Resume', to: '/resume' },
  { name: 'Writing', to: '/writing' },
  { name: 'Contact', to: '/contact' },
]

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: `-${spacing(theme)(1)}`,
    [bp_lt('xs')(theme)]: {
      marginLeft: `-${spacing(theme)(2)}`,
    },
  },
  link: {
    '& + &': {
      marginLeft: spacing(theme)(1),
    },
    marginBottom: spacing(theme)(1),
    [bp_lt('xs')(theme)]: {
      // fixes indented button when nav wraps
      '&:first-of-type': {
        marginLeft: spacing(theme)(1),
      },
    },
  },
}))

export const Nav = ({
  links = defaultLinks,
  linkProps,
  className,
  getProps,
  ...props
}: {
  links?: Links
  linkProps?:
    | ((link: LinkDef) => Partial<ButtonLinkProps>)
    | Partial<ButtonLinkProps>
  getProps?:
    | ((
        opts: Parameters<GetProps>[0] & LinkDef,
        oldProps: ReturnType<GetProps>,
      ) => ReturnType<GetProps>)
    | ReturnType<GetProps>
} & ClassesProp<typeof useStyles>) => {
  const classes = useStyles(props)
  return (
    <nav className={clsx(classes.root, className)} {...props}>
      {links.map(({ name, to }) => (
        <ButtonLink
          key={to}
          to={to}
          className={classes.link}
          size="small"
          activeStyle={{
            boxShadow: 'none',
            outline: 'none',
            border: 'none',
            cursor: 'default',
          }}
          getProps={(o, old) => {
            const dprops = { ...old, ...(o.isCurrent ? { tabIndex: -1 } : {}) }
            return typeof getProps === 'function'
              ? getProps({ name, to, ...o }, dprops)
              : { ...dprops, ...getProps }
          }}
          {...(typeof linkProps === 'function'
            ? linkProps({ name, to })
            : linkProps)}
        >
          {name}
        </ButtonLink>
      ))}
    </nav>
  )
}
