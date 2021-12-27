import './cssreset.css'
import { css } from '@linaria/core'
import { getVar, typography } from './theme-utils'

const globals = css`
  :global() {
    html {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      box-sizing: border-box;
      -webkit-text-size-adjust: 100%;
    }
    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }
    strong,
    b {
      font-weight: ${getVar('typography-fontWeightBold')};
    }
    body {
      margin: 0;
      color: ${getVar('palette-text-primary')};
      ${typography('body1')};
      background-color: ${getVar('palette-background-default')};
      @media print {
        background-color: ${getVar('palette-common-white')};
      }
      &::backdrop {
        background-color: ${getVar('palette-background-default')};
      }
    }
  }
`

export default globals
