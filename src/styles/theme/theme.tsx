import React, { CSSProperties, PropsWithChildren } from 'react'
import { DefaultTheme, ThemeProvider } from '@material-ui/styles'
import { ThemeProvider as EmotionTheme  } from '@emotion/react'
import { RequireKeys } from '@util/types'
import { modularTypography } from './theme-utils'

export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
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

export interface MyTheme {
  spacing?: number | number[]
  breakpoints: {
    values: Record<BreakpointKey, number>
    unit?: 'px' | 'em' | 'rem'
    step?: number
  }
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
    gutter: CSSProperties['fontSize']
    fontWeightBold: CSSProperties['fontWeight']
  },
  border: {
    baseWidth: string
    focusedWidth: string
    style: CSSProperties['borderStyle']
  }
}

export { MyTheme as Theme }

declare module '@material-ui/styles/defaultTheme' {
  export interface DefaultTheme extends MyTheme {}
}

declare module '@emotion/react' {
  export interface Theme extends MyTheme {}
}

const headlineFamily = '"Fira Code", monospace'
const bodyFamily = '"Montserrat", "Helvetica", "Arial", sans-serif'

export const themeBase = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    fontWeightBold: 500,
    gutter: '0.35rem',
    display: {
      fontFamily: headlineFamily,
      fontSize: 0,
      fontWeight: 300,
      letterSpacing: -1.5,
    },
    h1: {
      fontFamily: headlineFamily,
      fontSize: 0,
      fontWeight: 300,
      letterSpacing: -1.5,
    },
    h2: {
      fontFamily: headlineFamily,
      fontSize: 0,
      fontWeight: 300,
      letterSpacing: -0.5,
    },
    h3: {
      fontFamily: headlineFamily,
      fontSize: 0,
      fontWeight: 400,
      letterSpacing: 0,
    },
    h4: {
      fontFamily: headlineFamily,
      fontSize: 0,
      fontWeight: 400,
      letterSpacing: 0.25,
    },
    h5: {
      fontFamily: headlineFamily,
      fontSize: 0,
      fontWeight: 400,
      letterSpacing: 0,
    },
    h6: {
      fontFamily: headlineFamily,
      fontSize: 0,
      fontWeight: 500,
      letterSpacing: 0.15,
    },
    subtitle1: {
      fontFamily: headlineFamily,
      fontSize: 0,
      fontWeight: 400,
      letterSpacing: 0.15,
    },
    subtitle2: {
      fontFamily: headlineFamily,
      fontSize: 0,
      fontWeight: 500,
      letterSpacing: 0.1,
    },
    body1: {
      fontFamily: bodyFamily,
      fontSize: 0,
      fontWeight: 400,
      letterSpacing: 0.5,
    },
    body2: {
      fontFamily: bodyFamily,
      fontSize: 0,
      fontWeight: 400,
      letterSpacing: 0.25,
    },
    button: {
      fontFamily: headlineFamily,
      fontSize: 0,
      fontWeight: 500,
      letterSpacing: 1.25,
      textTransform: 'uppercase',
    },
    caption: {
      fontFamily: bodyFamily,
      fontSize: 0,
      fontWeight: 400,
      letterSpacing: 0.4,
    },
    overline: {
      fontFamily: bodyFamily,
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
    style: 'solid'
  }
} as const

export const defaultThemeModular = {
  scale: 1.2,
  betweenScale: 1.05,
  breakpoints: ['sm', 'md', 'lg']
} as const

export const defaultTheme = modularTypography(themeBase, defaultThemeModular)

export const markdownTheme = modularTypography(themeBase, {
  scale: 1.2,
  betweenScale: 1.02,
  breakpoints: ['sm', 'md']
})

export const DefaultThemeProvider = ({
  children,
}: PropsWithChildren<unknown>) => (
  <EmotionTheme theme={defaultTheme}>
    <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
  </EmotionTheme>
)
