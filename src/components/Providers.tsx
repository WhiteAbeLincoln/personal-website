import React, { PropsWithChildren } from 'react'
import DefaultThemeProvider from './theme/Theme'

export default ({ children }: PropsWithChildren<unknown>) => (
  <DefaultThemeProvider>{children}</DefaultThemeProvider>
)
