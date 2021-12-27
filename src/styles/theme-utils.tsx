/* eslint-disable @typescript-eslint/ban-types */
import type {
  CSSProperties as LCSSProperties,
  LinariaClassName,
} from '@linaria/core'
import React, { CSSProperties } from 'react'
import type { TypographyVariant } from './theme'
import type { Theme } from './theme-interface'
import type { FalsyValues } from '@src/util/functional/predicates'

export const clsx = (
  ...classes: Array<string | FalsyValues | Record<string, true | FalsyValues>>
): string =>
  classes
    .reduce((acc, c) => {
      if (typeof c === 'string' && c) {
        acc.push(c)
      } else if (c) {
        Object.entries(c).forEach(([key, val]) => {
          if (val) {
            acc.push(key)
          }
        })
      }
      return acc
    }, [] as string[])
    .join(' ')

type AllCSSVars<T, Prefix extends string = ''> = NonNullable<
  T extends (...args: unknown[]) => unknown
    ? never
    : T extends (string | number) & {}
    ? Prefix
    : T extends object
    ? {
        [k in keyof T]: AllCSSVars<
          T[k],
          Prefix extends '' ? k & string : `${Prefix}-${k & string}`
        >
      }[keyof T]
    : Prefix
>

export function getVarBase<T extends Theme = Theme>() {
  function Ret<S extends AllCSSVars<T>, Def extends string>(
    themeVar: S,
    def: Def,
  ): `var(--theme-${S}, ${Def})`
  function Ret<S extends AllCSSVars<T>>(themeVar: S): `var(--theme-${S})`
  function Ret<
    S extends AllCSSVars<T>,
    Def extends string | undefined = undefined,
  >(themeVar: S, def = undefined as Def) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return def
      ? (`var(--theme-${themeVar}, ${def})` as const)
      : (`var(--theme-${themeVar})` as const)
  }

  return Ret
}

export const getVar = getVarBase()

export const typography = <K extends TypographyVariant>(variant: K) => ({
  fontFamily: getVar(`typography-${variant}-fontFamily`),
  fontSize: getVar(`typography-${variant}-fontSize`),
  fontWeight: getVar(`typography-${variant}-fontWeight`),
  lineHeight: getVar(`typography-${variant}-lineHeight`),
  letterSpacing: getVar(`typography-${variant}-letterSpacing`),
  textTransform: getVar(`typography-${variant}-textTransform`),
})

const shadowBorder = {} as Record<'base' | 'focused', CSSProperties>
shadowBorder.base = {
  outlineColor: 'transparent',
  outlineWidth: getVar('border-baseWidth'),
  outlineStyle: 'solid',
  boxShadow: `0 0 0 ${getVar('border-baseWidth')} currentColor`,
}
shadowBorder.focused = {
  ...shadowBorder.base,
  outlineWidth: getVar('border-focusedWidth'),
  boxShadow: `0 0 0 ${getVar('border-focusedWidth')} currentColor`,
}
const realShadowBorder = shadowBorder as {
  [k in keyof typeof shadowBorder]: LCSSProperties
}

export { realShadowBorder as shadowBorder }

const border = {} as Record<'base' | 'focused', CSSProperties>
border.base = {
  borderWidth: getVar('border-baseWidth'),
  borderStyle: getVar('border-style'),
  borderColor: 'currentcolor',
}
border.focused = {
  ...border.base,
  borderWidth: getVar('border-focusedWidth'),
}

const realBorder = border as { [k in keyof typeof border]: LCSSProperties }
export { realBorder as border }

export type ClassesProp<Styles> = Styles extends Record<
  string,
  string | LinariaClassName
>
  ? {
      styles?: CSSProperties
      classes?: { [k in keyof Styles]?: string }
      className?: string
    }
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Styles extends (props: any) => { classes: infer C }
  ? ClassesProp<C>
  : Styles extends string
  ? ClassesProp<Record<Styles, string | LinariaClassName>>
  : never

export type WithStyles<
  Props,
  T extends Record<'root', string | LinariaClassName>,
> = Omit<Props, 'className' | 'classes'> & {
  classes: T
  styles?: CSSProperties
}

export function makeStyles<T extends Record<'root', string | LinariaClassName>>(
  styles: T,
) {
  return function useStyles<P extends ClassesProp<T>>(
    props: P,
  ): WithStyles<P, T> {
    const { className, classes: inClasses = {}, ...rest } = props
    const root = (inClasses as Partial<T>).root ?? styles.root
    const classes = { ...styles, ...inClasses, root: clsx(root, className) }
    return { classes, ...rest }
  }
}

export function withStyles<T extends Record<'root', string | LinariaClassName>>(
  styles: T,
  { name }: { name?: string } = {},
) {
  return <P,>(
    Component: React.ComponentType<WithStyles<P, T>>,
  ): React.ComponentType<P & ClassesProp<T>> => {
    const useStyles = makeStyles(styles)
    const Comp = (inProps: P & ClassesProp<T>) => {
      const props = useStyles(inProps)
      return <Component {...props} />
    }
    Comp.displayName =
      name ?? `withStyles(${Component.displayName ?? 'unnamed'})`
    return Comp
  }
}
