/* eslint-disable @typescript-eslint/ban-types */
import React, { ReactNode, useContext, createContext } from 'react'
import Helmet from 'react-helmet'
import { BreakpointKey, bp_between, bp_gt } from './layout-theme'
import type { Theme, TypographyVariant } from './theme'
import { clsx } from './theme-utils'
import { cyrb53, mapRecord } from '@src/util'
import { UnionToIntersection } from '@src/util/types'

export type GetCSSVars<T, Prefix extends string = '--theme'> = T extends (
  ...args: unknown[]
) => unknown
  ? never
  : T extends (string | number) & {}
  ? `var(${Prefix})`
  : T extends object
  ? { [k in keyof T]: GetCSSVars<T[k], `${Prefix}-${k & string}`> }
  : `var(${Prefix})`

type ThemeData<T, Prefix extends string = '--theme'> = T extends (
  ...args: unknown[]
) => unknown
  ? never
  : T extends (string | number) & {}
  ? { [k in Prefix]: T }
  : T extends object
  ? UnionToIntersection<
      { [k in keyof T]: ThemeData<T[k], `${Prefix}-${k & string}`> }[keyof T]
    >
  : { [k in Prefix]: T }

export const ThemeDataSym = Symbol('ThemeData')
type CompiledTheme<T> = GetCSSVars<T> & {
  [k in typeof ThemeDataSym]: ThemeData<T>
}

export type ThemeValue<Vars, T> = T | ((val: Vars) => T)
export type WithThemeValue<T, Vars = GetCSSVars<T>> = T extends object
  ? { [k in keyof T]: WithThemeValue<T[k], Vars> }
  : ThemeValue<Vars, T>

export function buildCSSVars<T, Prefix extends string = '--theme'>(
  theme: T,
  prefix = '--theme' as Prefix,
): GetCSSVars<T, Prefix> {
  if (typeof theme === 'object' && theme != null && !Array.isArray(theme)) {
    const obj = {} as GetCSSVars<T, Prefix>
    for (const key of Object.keys(theme)) {
      ;(obj as Record<string, unknown>)[key] = buildCSSVars(
        theme[key as keyof T],
        `${prefix}-${key}`,
      )
    }
    return obj
  }
  return `var(${prefix})` as GetCSSVars<T, Prefix>
}

export function buildThemeData<T, Prefix extends string = '--theme'>(
  theme: T,
  prefix = '--theme' as Prefix,
  data: Record<string, unknown> = {},
): ThemeData<T, Prefix> {
  if (typeof theme === 'object' && theme != null && !Array.isArray(theme)) {
    for (const key of Object.keys(theme)) {
      buildThemeData(theme[key as keyof T], `${prefix}-${key}`, data)
    }
  } else {
    data[prefix] = theme
  }
  return data as ThemeData<T, Prefix>
}

function resolveTheme<T>(vars: GetCSSVars<T>, theme: WithThemeValue<T>): T {
  if (typeof theme === 'object' && theme != null && !Array.isArray(theme)) {
    const obj = {} as T
    for (const key of Object.keys(theme)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      obj[key as keyof T] = resolveTheme(
        vars,
        theme[key as keyof typeof theme] as any,
      )
    }

    return obj
  }

  if (typeof theme === 'function') {
    return theme(vars) as T
  }

  return theme as T
}

export function makeTheme<T>(theme: WithThemeValue<T>): CompiledTheme<T> {
  const varsObj = buildCSSVars(theme) as GetCSSVars<T>
  const resolvedTheme = resolveTheme(varsObj, theme)
  const finalObj = varsObj as unknown as typeof varsObj & {
    [k in typeof ThemeDataSym]: ThemeData<T>
  }
  finalObj[ThemeDataSym] = buildThemeData(resolvedTheme)

  return finalObj
}

export type ModularTypographyProps = {
  scale: number
  betweenScale: number
  breakpoints?: readonly BreakpointKey[]
  typographyMapping?: { [k in TypographyVariant]: number }
}

export const modularTypography = ({
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
}: ModularTypographyProps) => {
  const mediaQueries = breakpoints.map((curr, i) => {
    const next = breakpoints[i + 1] as BreakpointKey | undefined
    const s = scale * betweenScale ** (i + 1)
    return {
      query: next == null ? bp_gt(curr) : bp_between(curr, next),
      scale: s,
    }
  })

  const key = (variant: string) => `--theme-typography-${variant}-fontSize`

  const result: Record<string, string | Record<string, string>> = {}

  const makeVal = (scale: number, pow: number) => {
    const val = 1 * scale ** pow
    return `${Number.isInteger(val) ? val : val.toFixed(4)}rem`
  }

  mapRecord(typographyMapping, (pow, variant) => {
    result[key(variant)] = makeVal(scale, pow)

    mediaQueries.forEach(({ query, scale }) => {
      const old = (result[query] || {}) as Record<string, string>
      result[query] = {
        ...old,
        [key(variant)]: makeVal(scale, pow),
      }
    })
  })

  return result
}

export const ThemeContext = createContext<GetCSSVars<Theme>>(
  null as unknown as GetCSSVars<Theme>,
)

export const useTheme = () => useContext(ThemeContext)

function buildStyles(
  className: string,
  entries: Record<string, number | string | Record<string, string>>,
): string {
  const [plainStyles, objStyles] = Object.entries(entries).reduce(
    (acc, [k, v]) => {
      if (typeof v === 'object') {
        acc[1].push([k, v])
      } else {
        acc[0].push([k, v])
      }
      return acc
    },
    [[], []] as [
      Array<[string, number | string]>,
      Array<[string, Record<string, string>]>,
    ],
  )
  plainStyles.sort(([a], [b]) => (a < b ? -1 : b < a ? 1 : 0))
  objStyles.sort(([a], [b]) => (a < b ? -1 : b < a ? 1 : 0))

  return (
    `${className} {\n${plainStyles
      .map(([k, v]) => `${k}: ${String(v)};`)
      .join('\n')}\n}\n` +
    objStyles
      .map(([k, v]) => `${k} {\n${buildStyles(className, v)}\n}`)
      .join('\n')
  )
}

export type ThemeProviderProps<T extends Theme> = {
  theme: WithThemeValue<T>
  children: ReactNode | ((className: string) => ReactNode)
  modTypography: ModularTypographyProps
  className?: string
  root?: boolean
}

export const ThemeProvider = <T extends Theme>({
  theme,
  modTypography,
  children,
  className: classNameIn,
  root,
}: ThemeProviderProps<T>) => {
  const compiled = makeTheme(theme)
  const modular = modularTypography(modTypography)

  let styles = buildStyles(root ? ':root' : '.awhite-theme-placeholder', {
    ...compiled[ThemeDataSym],
    ...modular,
  })
  let themeClass = ''
  if (!root) {
    themeClass = `aw-theme-${cyrb53(styles).toString(16)}`
    styles = styles.replace(/\.awhite-theme-placeholder/gm, '.' + themeClass)
  }

  const className = clsx(themeClass, classNameIn)

  return (
    <ThemeContext.Provider value={compiled}>
      <Helmet>
        <style type="text/css">{styles}</style>
      </Helmet>
      {typeof children === 'function' ? (
        children(className)
      ) : (
        <div className={className} style={{ display: 'contents' }}>
          {children}
        </div>
      )}
    </ThemeContext.Provider>
  )
}
