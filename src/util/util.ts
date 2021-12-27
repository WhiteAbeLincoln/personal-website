import {
  ArrayValue,
  Indices,
  IsFinite,
  MustInclude,
  UnionToIntersection,
} from './types'

type AlwaysForwarded = 'className' | 'children'
export const mkShouldForwardProp =
  <
    T extends Record<PropertyKey, unknown>,
    P extends Exclude<keyof T, AlwaysForwarded | 'as' | 'theme'> = Exclude<
      keyof T,
      AlwaysForwarded | 'as' | 'theme'
    >,
  >() =>
  <U extends [P, ...P[]]>(...noForward: MustInclude<P, U>) => {
    const arr = ['as', 'theme', ...noForward] as PropertyKey[]
    return (propName: PropertyKey) => !arr.includes(propName)
  }

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

type FromEntries<E extends readonly [string, unknown][]> =
  IsFinite<E> extends '0'
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

// (non-cryptographic) string hashing function
// from https://stackoverflow.com/a/52171480
export const cyrb53 = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}
