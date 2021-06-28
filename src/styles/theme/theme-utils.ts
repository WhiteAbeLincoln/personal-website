import { CSSProperties } from '@material-ui/styles'
import { mapRecord } from '@util/util'
import { Theme, BreakpointKey, TypographyVariant } from './theme'

export const modularTypography = (
  inTheme: Theme,
  {
    scale,
    betweenScale,
    breakpoints = ['sm', 'md', 'lg'],
    typographyMapping = {
      display: 7,
      h1: 6,
      h2: 5,
      h3: 4,
      h4: 3,
      h5: 2,
      h6: 1,
      subtitle1: 0,
      subtitle2: -1,
      body1: 0,
      body2: -0.55,
      button: -0.55,
      caption: -1,
      overline: -1.15,
    },
  }: {
    scale: number
    betweenScale: number
    breakpoints?: readonly BreakpointKey[]
    typographyMapping?: { [k in TypographyVariant]: number }
  },
): Theme => {
  const theme = { ...inTheme }
  theme.typography = { ...theme.typography }
  const typography = theme.typography

  const mediaQueries = breakpoints.map((curr, i) => {
    const next = breakpoints[i + 1] as BreakpointKey | undefined
    const s = scale * betweenScale ** (i + 1)
    return {
      query: (next == null ? bp_gt(curr) : bp_between(curr, next))(theme),
      scale: s
    }
  })

  mapRecord(typographyMapping, (pow, variant) => {
    const style = typography[variant]
    typography[variant] = {
      ...style,
      ...mediaQueries.reduce((acc, { query, scale }) => {
        acc[query] = { fontSize: `${1 * scale ** pow}rem` }
        return acc
      }, {} as Record<string, { fontSize: string }>),
      fontSize: `${1 * scale ** pow}rem`,
    }
  })

  return theme
}

function withthemebp(
  fn: (data: {
    values: Record<BreakpointKey, number>
    unit: 'px' | 'em' | 'rem'
    step: number
  }) => string,
) {
  return (theme: Theme) => {
    const {
      breakpoints: {
        values = {
          xs: 0,
          sm: 600,
          md: 960,
          lg: 1280,
          xl: 1920,
        },
        unit = 'px',
        step = 5,
      },
    } = theme

    return fn({ values, unit, step })
  }
}

function nextKey(key: BreakpointKey): BreakpointKey {
  return key === 'xs'
    ? 'sm'
    : key === 'sm'
    ? 'md'
    : key === 'md'
    ? 'lg'
    : key === 'lg'
    ? 'xl'
    : 'xs'
}

function media(limit?: 'screen' | 'print') {
  return limit ? `@media ${limit} and` : `@media`
}

export function bp_gt(key: BreakpointKey | number, limit?: 'screen' | 'print') {
  return withthemebp(({ values, unit }) => {
    const value = typeof key === 'number' ? key : values[key]
    return `${media(limit)} (min-width:${value}${unit})`
  })
}
export function bp_lt(key: number | BreakpointKey, limit?: 'screen' | 'print') {
  if (key === 'xl') return bp_gt('xs', limit)
  return withthemebp(({ values, unit, step }) => {
    const value = typeof key === 'number' ? key : values[nextKey(key)]
    return `${media(limit)} (max-width:${value - step / 100}${unit})`
  })
}
export function bp_between(
  start: number | BreakpointKey,
  end: number | BreakpointKey,
  limit?: 'screen' | 'print',
) {
  if (end === 'xl') return bp_gt(start, limit)
  return withthemebp(({ values, unit, step }) => {
    const endvalue = typeof end === 'number' ? end : values[nextKey(end)]

    return `${media(limit)} (min-width:${
      typeof start === 'number' ? start : values[start]
    }${unit}) and (max-width:${endvalue - step / 100}${unit})`
  })
}
export function bp_exact(
  key: number | BreakpointKey,
  limit?: 'screen' | 'print',
) {
  return bp_between(key, key, limit)
}

type SpacingOpts<T = number | string> = [T] | [T, T] | [T, T, T] | [T, T, T, T]
export const spacing = (theme: Theme) => (...args: SpacingOpts) => {
  const { spacing: values = 0.5 } = theme
  const getValue = (t: number | string) =>
    typeof t === 'string'
      ? t
      : typeof values === 'number'
      ? `${t * values}rem`
      : `${values[t] ?? values[values.length - 1]}rem`
  return args.map(getValue).join(' ')
}

export const clearOutline = ({
  focused = true,
}: { focused?: boolean } = {}): CSSProperties => ({
  outlineColor: 'transparent',
  outlineWidth: `${focused ? 3 / 16 : 1 / 8}rem`,
  outlineStyle: 'solid',
})

export const shadowBorder = (
  theme: Theme,
  {
    focused = false,
    disabled = false,
    color = theme.palette.primary.main,
  }: { focused?: boolean; disabled?: boolean; color?: string } = {},
): CSSProperties => ({
  outlineWidth: `${focused ? 3 / 16 : 1/ 8}rem`,
  outlineStyle: 'solid',
  outlineColor: disabled ? theme.palette.text.disabled : color,
  // boxShadow: `0 0 0 ${focused ? 3 / 16 : 1 / 8}rem ${
  //   disabled ? theme.palette.text.disabled : color
  // }`,
  // ...clearOutline({ focused }),
  // '@media screen and (-ms-high-contrast: active)': {
  //   border: `${focused ? 3 / 16 : 1 / 8}rem solid ${
  //     disabled ? theme.palette.text.disabled : color
  //   }`,
  // },
})

export const wrappedRow = (m: number | string, bm = m) => (
  theme: Theme,
): CSSProperties => {
  const margin = typeof m === 'number' ? `${m}rem` : m
  const bottomMargin = typeof bm === 'number' ? `${bm}rem` : bm
  return {
    display: 'flex',
    flexFlow: 'row wrap',
    marginBottom: `-${bottomMargin}`,
    [bp_lt('xs')(theme)]: {
      marginLeft: `-${margin}`,
      '& > *:first-of-type': {
        marginLeft: `${margin}`,
      },
    },
    '& > *': {
      marginBottom: `${bottomMargin}`,
    },
    '& > * + *': {
      marginLeft: `${margin}`,
    },
  }
}
