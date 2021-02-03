import React, { PropsWithChildren } from 'react'
import { DefaultThemeProvider } from '@src/styles/theme/theme'
import CSSBaseline from '@styles/theme/CSSBaseline'
import { MDXProvider, MDXProviderComponents } from '@mdx-js/react'
import { P, Pre } from './typography/Elements'
import Link from './Link'
import { partial } from '@util/react-util'
import Typography from './typography'

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

export default ({ children }: PropsWithChildren<unknown>) => (
  <DefaultThemeProvider>
    <CSSBaseline />
    <MDXProvider components={components}>{children}</MDXProvider>
  </DefaultThemeProvider>
)
