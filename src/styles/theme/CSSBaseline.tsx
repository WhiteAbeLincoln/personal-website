import './cssreset.css'
import React, { PropsWithChildren } from 'react'
import { CSSProperties, withStyles } from '@material-ui/styles'
import { ClassesProp } from '@util/types'
import { defaultTheme, Theme } from './theme'

const htmlStyles: CSSProperties = {
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  boxSizing: 'border-box',
  WebkitTextSizeAdjust: '100%',
}

const bodyStyles = (theme: Theme): CSSProperties => ({
  color: theme.palette.text.primary,
  ...theme.typography.body1,
  backgroundColor: theme.palette.background.default,
  '@media print': {
    backgroundColor: theme.palette.common.white,
  },
})

const styles = (theme: Theme): CSSProperties => ({
  html: htmlStyles,
  '*, *::before, *::after': {
    boxSizing: 'inherit',
  },
  'strong, b': {
    fontWeight: theme.typography.fontWeightBold,
  },
  body: {
    margin: 0,
    ...bodyStyles(theme),
    '&::backdrop': {
      backgroundColor: theme.palette.background.default,
    },
  },
})

function CSSBaseline({
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  classes: _,
}: // eslint-disable-next-line @typescript-eslint/ban-types
PropsWithChildren<ClassesProp<{}>>) {
  return <>{children}</>
}
export default withStyles((theme: Theme) => ({ '@global': styles(theme) }), {
  name: 'CssBaseline',
  defaultTheme,
})(CSSBaseline)
