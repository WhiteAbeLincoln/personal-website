import { MDXProvider, MDXProviderComponents } from '@mdx-js/react'
import React, { PropsWithChildren } from 'react'
import Link from './Link'
import Typography from './typography'
import { P, Pre } from './typography/Elements'
import { DefaultThemeProvider } from '@src/styles'
import baselineCSS from '@src/styles/css-baseline'
import { partial } from '@src/util/react-util'

const components: MDXProviderComponents = {
  p: P,
  pre: Pre,
  a: Link,
  h1: partial(Typography, {
    component: 'h1',
    variant: 'h1',
    gutterBottom: true,
  }),
  h2: partial(Typography, {
    component: 'h2',
    variant: 'h2',
    gutterBottom: true,
  }),
  h3: partial(Typography, {
    component: 'h3',
    variant: 'h3',
    gutterBottom: true,
  }),
  h4: partial(Typography, {
    component: 'h4',
    variant: 'h4',
    gutterBottom: true,
  }),
  h5: partial(Typography, {
    component: 'h5',
    variant: 'h5',
    gutterBottom: true,
  }),
  h6: partial(Typography, {
    component: 'h6',
    variant: 'h6',
    gutterBottom: true,
  }),
  Typography,
}

const Providers = ({ children }: PropsWithChildren<unknown>) => (
  <DefaultThemeProvider className={baselineCSS} root>
    <MDXProvider components={components}>{children}</MDXProvider>
  </DefaultThemeProvider>
)

export default Providers
