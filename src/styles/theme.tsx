import React, { CSSProperties, PropsWithChildren } from 'react'
import {
  ModularTypographyProps,
  ThemeProvider,
  WithThemeValue,
} from './theme-provider'
import type { RequireKeys } from '@src/util/types/typelevel/object'

export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'button'
  | 'caption'
  | 'overline'

export type PaletteColors = {
  light: string
  main: string
  dark: string
  contrastText: string
}

export interface Theme {
  palette: {
    type: 'light' | 'dark'
    common: {
      white: string
      black: string
    }
    primary: PaletteColors
    secondary: PaletteColors
    error: Pick<PaletteColors, 'main' | 'contrastText'>
    warning: Pick<PaletteColors, 'main' | 'contrastText'>
    info: Pick<PaletteColors, 'main' | 'contrastText'>
    success: Pick<PaletteColors, 'main' | 'contrastText'>
    text: {
      primary: string
      secondary: string
      disabled: string
      hint: string
    }
    background: {
      default: string
    }
  }
  typography: {
    [k in TypographyVariant]: RequireKeys<
      Pick<
        CSSProperties,
        | 'fontFamily'
        | 'fontWeight'
        | 'fontSize'
        | 'lineHeight'
        | 'letterSpacing'
        | 'textTransform'
      >,
      'fontFamily' | 'fontSize'
    >
  } & {
    headlineFamily: CSSProperties['fontFamily']
    bodyFamily: CSSProperties['fontFamily']
    gutter: CSSProperties['fontSize']
    fontWeightBold: CSSProperties['fontWeight']
  }
  border: {
    baseWidth: string
    focusedWidth: string
    style: CSSProperties['borderStyle']
  }
}

export const theme: WithThemeValue<Theme> = {
  typography: {
    fontWeightBold: 500,
    gutter: '0.35rem',
    headlineFamily: '"Fira Code", monospace',
    bodyFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    display: {
      fontFamily: t => t.typography.headlineFamily,
      fontSize: 0,
      fontWeight: 300,
      letterSpacing: -1.5,
    },
    h1: {
      fontFamily: t => t.typography.headlineFamily,
      fontSize: 0,
      fontWeight: 300,
      letterSpacing: -1.5,
    },
    h2: {
      fontFamily: t => t.typography.headlineFamily,
      fontSize: 0,
      fontWeight: 300,
      letterSpacing: -0.5,
    },
    h3: {
      fontFamily: t => t.typography.headlineFamily,
      fontSize: 0,
      fontWeight: 400,
      letterSpacing: 0,
    },
    h4: {
      fontFamily: t => t.typography.headlineFamily,
      fontSize: 0,
      fontWeight: 400,
      letterSpacing: 0.25,
    },
    h5: {
      fontFamily: t => t.typography.headlineFamily,
      fontSize: 0,
      fontWeight: 400,
      letterSpacing: 0,
    },
    h6: {
      fontFamily: t => t.typography.headlineFamily,
      fontSize: 0,
      fontWeight: 500,
      letterSpacing: 0.15,
    },
    subtitle1: {
      fontFamily: t => t.typography.headlineFamily,
      fontSize: 0,
      fontWeight: 400,
      letterSpacing: 0.15,
    },
    subtitle2: {
      fontFamily: t => t.typography.headlineFamily,
      fontSize: 0,
      fontWeight: 500,
      letterSpacing: 0.1,
    },
    body1: {
      fontFamily: t => t.typography.bodyFamily,
      fontSize: 0,
      fontWeight: 400,
      letterSpacing: 0.5,
    },
    body2: {
      fontFamily: t => t.typography.bodyFamily,
      fontSize: 0,
      fontWeight: 400,
      letterSpacing: 0.25,
    },
    button: {
      fontFamily: t => t.typography.headlineFamily,
      fontSize: 0,
      fontWeight: 500,
      letterSpacing: 1.25,
      textTransform: 'uppercase',
    },
    caption: {
      fontFamily: t => t.typography.bodyFamily,
      fontSize: 0,
      fontWeight: 400,
      letterSpacing: 0.4,
    },
    overline: {
      fontFamily: t => t.typography.bodyFamily,
      fontSize: 0,
      fontWeight: 400,
      letterSpacing: 1.5,
    },
  },
  palette: {
    type: 'light',
    common: {
      white: '#fff',
      black: '#000',
    },
    background: {
      default: '#fff',
    },
    text: {
      primary: 'rgba(0,0,0,0.87)',
      secondary: '#fff',
      disabled: 'rgba(0,0,0,0.38)',
      hint: 'rgba(0,0,0,0.6)',
    },
    primary: {
      light: '#000',
      main: '#000',
      dark: '#000',
      contrastText: '#fff',
    },
    secondary: {
      light: '#000',
      main: '#49796b',
      dark: '#000',
      contrastText: '#fff',
    },
    error: {
      main: '#b00020',
      contrastText: '#fff',
    },
    warning: {
      main: '#fd9726',
      contrastText: '#3d2409',
    },
    info: {
      main: '#2196f3',
      contrastText: '#fff',
    },
    success: {
      main: '#4caf50',
      contrastText: '#fff',
    },
  },
  border: {
    baseWidth: `${1 / 8}rem`,
    focusedWidth: `${3 / 16}rem`,
    style: 'solid',
  },
}

export const displayThemeModular: ModularTypographyProps = {
  scale: 1.2,
  betweenScale: 1.05,
  breakpoints: ['sm', 'md', 'lg'],
}

export const defaultThemeModular: ModularTypographyProps = {
  scale: 1.2,
  betweenScale: 1.02,
  breakpoints: ['sm', 'md'],
}

export const DefaultThemeProvider = ({
  children,
  className,
  root,
}: PropsWithChildren<{ className?: string; root?: boolean }>) => (
  <ThemeProvider
    theme={theme}
    modTypography={defaultThemeModular}
    className={className}
    root={root}
  >
    {children}
  </ThemeProvider>
)
