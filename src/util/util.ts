import { FalsyValues } from './functional/predicates'
import {
  ArrayValue,
  Indices,
  IsFinite,
  MustInclude,
  UnionToIntersection,
} from './types'

type AlwaysForwarded = 'className' | 'children'
export const mkShouldForwardProp = <
  T extends Record<PropertyKey, unknown>,
  P extends Exclude<keyof T, AlwaysForwarded | 'as' | 'theme'> = Exclude<
    keyof T,
    AlwaysForwarded | 'as' | 'theme'
  >
>() => <U extends [P, ...P[]]>(...noForward: MustInclude<P, U>) => {
  const arr = ['as', 'theme', ...noForward] as PropertyKey[]
  return (propName: PropertyKey) => !arr.includes(propName)
}

export const clsx = (
  ...classes: Array<string | FalsyValues | Record<string, true | FalsyValues>>
): string =>
  classes
    .reduce((acc, c) => {
      if (c) {
        if (typeof c === 'string') acc.push(c)
        else
          acc.push(
            ...Object.entries(c).reduce(
              (acc, [key, val]) => (val && acc.push(key), acc),
              [] as string[],
            ),
          )
      }
      return acc
    }, [] as string[])
    .join(' ')

export const omit = <O, K extends keyof O>(
  obj: O,
  ...keys: K[]
): Omit<O, K> => {
  const copy = { ...obj }
  for (const key of keys) {
    delete copy[key]
  }

  return copy
}

/**
 * WARNING: Only type-safe if your object doesn't have excess properties
 */
export const entries: <O>(
  obj: O,
) => Array<{ [k in keyof O]: [k, O[k]] }[keyof O]> = Object.entries.bind(Object)

export const mapRecord = <K extends PropertyKey, A, B>(
  obj: Record<K, A>,
  fn: (value: A, key: K) => B,
): Record<K, B> =>
  entries(obj).reduce((acc, [key, value]) => {
    acc[key] = fn(value, key)
    return acc
  }, {} as Record<K, B>)

type FromEntries<
  E extends readonly [string, unknown][]
> = IsFinite<E> extends '0'
  ? Record<string, ArrayValue<E>[1]>
  : UnionToIntersection<
      {
        [el in Indices<E>]: E[el] extends [string, unknown]
          ? { [k in E[el][0]]: E[el][1] }
          : never
      }[Indices<E>]
    >

export const fromEntries = <E extends readonly [string, unknown][]>(
  entries: E,
): FromEntries<E> =>
  entries.reduce((acc, [key, value]) => {
    acc[key] = value
    return acc
  }, {} as Record<string, unknown>) as FromEntries<E>

export const capitalize = <S extends string>(s: S) =>
  (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<S>
