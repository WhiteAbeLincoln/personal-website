import {
  ThemeProvider,
  Theme,
  Global,
  Interpolation,
  CSSObject,
} from '@emotion/react'
import { Matches, RequireKeys } from '@util/types'
import { CSSProperties, PropsWithChildren } from 'react'

export type TypographyVariant =
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

declare module '@emotion/react' {
  export interface Theme {
    palette: {
      type: 'light' | 'dark'
      common: {
        white: string
        black: string
      }
      primary: PaletteColors
      secondary: PaletteColors
      error: PaletteColors
      warning: PaletteColors
      info: PaletteColors
      success: PaletteColors
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
    }
  }
}

const headlineFamily = '"Fira Code", monospace'
const bodyFamily = '"Montserrat", "Helvetica", "Arial", sans-serif'

export const defaultTheme = {
  typography: {
    gutter: '0.35em',
    h1: {
      fontFamily: headlineFamily,
      fontSize: '6.0625rem',
      fontWeight: 300,
      letterSpacing: -1.5,
    },
    h2: {
      fontFamily: headlineFamily,
      fontSize: '3.8125rem',
      fontWeight: 300,
      letterSpacing: -0.5,
    },
    h3: {
      fontFamily: headlineFamily,
      fontSize: '3rem',
      fontWeight: 400,
      letterSpacing: 0,
    },
    h4: {
      fontFamily: headlineFamily,
      fontSize: '2.125rem',
      fontWeight: 400,
      letterSpacing: 0.25,
    },
    h5: {
      fontFamily: headlineFamily,
      fontSize: '1.5rem',
      fontWeight: 400,
      letterSpacing: 0,
    },
    h6: {
      fontFamily: headlineFamily,
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: 0.15,
    },
    subtitle1: {
      fontFamily: headlineFamily,
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: 0.15,
    },
    subtitle2: {
      fontFamily: headlineFamily,
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: 0.1,
    },
    body1: {
      fontFamily: bodyFamily,
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: 0.5,
    },
    body2: {
      fontFamily: bodyFamily,
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: 0.25,
    },
    button: {
      fontFamily: bodyFamily,
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: 1.25,
      textTransform: 'uppercase',
    },
    caption: {
      fontFamily: bodyFamily,
      fontSize: '0.75rem',
      fontWeight: 400,
      letterSpacing: 0.4,
    },
    overline: {
      fontFamily: bodyFamily,
      fontSize: '0.625rem',
      fontWeight: 400,
      letterSpacing: 1.5,
    },
  },
} as const

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const assertTheme: Matches<typeof defaultTheme, Theme> = '1'

const DefaultThemeProvider = ({ children }: PropsWithChildren<unknown>) => (
  <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
)

const html: Interpolation<Theme> = {
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  boxSizing: 'border-box',
  WebkitTextSizeAdjust: '100%',
}

const body = (theme: Theme): CSSObject => ({
  color: theme.palette.text.primary,
  ...theme.typography.body1,
  backgroundColor: theme.palette.background.default,
  '@media print': {
    backgroundColor: theme.palette.common.white,
  },
})

const styles = (theme: Theme): CSSObject => ({
  html,
  '*, *::before, *::after': {
    boxSizing: 'inherit',
  },
  'strong, b': {
    fontWeight: theme.typography.fontWeightBold,
  },
  body: {
    margin: 0,
    ...body(theme),
    '&::backdrop': {
      backgroundColor: theme.palette.background.default,
    },
  },
})

export const CSSBaseline = () => <Global styles={styles} />

export { Theme }
export default DefaultThemeProvider
