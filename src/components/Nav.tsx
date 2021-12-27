import React from 'react'
import { GetProps } from './LinkWrapper'
import ButtonLink, { ButtonLinkProps } from '@src/components/ButtonLink'

type LinkDef = { readonly name: string; readonly to: string }
type Links = readonly LinkDef[]

export const defaultLinks: Links = [
  { name: 'Home', to: '/' },
  { name: 'Portfolio', to: '/portfolio' },
  { name: 'Resume', to: '/resume' },
  { name: 'Writing', to: '/writing' },
  { name: 'Contact', to: '/contact' },
]

export const Nav = ({
  links = defaultLinks,
  linkProps,
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
  className?: string
}) => (
  <nav {...props}>
    {links.map(({ name, to }) => (
      <ButtonLink
        key={to}
        to={to}
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
