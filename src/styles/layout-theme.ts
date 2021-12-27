import type { DeepReadonly } from '@src/util/types'

export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type LayoutTheme = DeepReadonly<{
  spacing?: number | number[]
  breakpoints: {
    values: Record<BreakpointKey, number>
    unit?: 'px' | 'em' | 'rem'
    step?: number
  }
}>

function makeLayoutTheme<T extends LayoutTheme>(theme: T): T & LayoutTheme {
  return theme
}

export const layoutTheme = makeLayoutTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
    unit: 'px',
    step: 5,
  },
})

export type SpacingOpts<T = number | string> =
  | [T]
  | [T, T]
  | [T, T, T]
  | [T, T, T, T]
export const spacing = (...args: SpacingOpts) => {
  const { spacing: values = 0.5 } = layoutTheme
  const getValue = (t: number | string) =>
    typeof t === 'string'
      ? t
      : typeof values === 'number'
      ? `${t * values}rem`
      : `${values[t] ?? values[values.length - 1]}rem`
  return args.map(getValue).join(' ')
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
  const { values, unit } = layoutTheme.breakpoints
  const value = typeof key === 'number' ? key : values[key]
  return `${media(limit)} (min-width:${value}${unit})`
}
export function bp_lt(key: number | BreakpointKey, limit?: 'screen' | 'print') {
  if (key === 'xl') return bp_gt('xs', limit)
  const { values, unit, step } = layoutTheme.breakpoints
  const value = typeof key === 'number' ? key : values[nextKey(key)]
  return `${media(limit)} (max-width:${value - step / 100}${unit})`
}
export function bp_between(
  start: number | BreakpointKey,
  end: number | BreakpointKey,
  limit?: 'screen' | 'print',
) {
  if (end === 'xl') return bp_gt(start, limit)
  const { values, unit, step } = layoutTheme.breakpoints
  const endvalue = typeof end === 'number' ? end : values[nextKey(end)]

  return `${media(limit)} (min-width:${
    typeof start === 'number' ? start : values[start]
  }${unit}) and (max-width:${endvalue - step / 100}${unit})`
}
export function bp_exact(
  key: number | BreakpointKey,
  limit?: 'screen' | 'print',
) {
  return bp_between(key, key, limit)
}
