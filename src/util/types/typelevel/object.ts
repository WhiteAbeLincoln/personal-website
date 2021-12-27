/* eslint-disable @typescript-eslint/ban-types */
import { Equal, If, Matches } from './boolean'

/**
 * The keys of an object `O` whose value types exactly equal equal the given type `T`
 *
 * @example
 * ```ts
 * KeysOfType<{ x: string, y: number | string }, string | number> -> 'y'
 * ```
 */
export type KeysOfType<O, T> = {
  [k in keyof O]-?: If<Equal<O[k], T>, k, never>
}[keyof O]

/**
 * The keys of an object `O` whose value types match ('>=') the given type `T`
 *
 * @example
 * ```ts
 * KeysOfType2<{ x: string, y: number, z: string | number | boolean }, string | number> -> 'z'
 * KeysOfType2<{ x: string, y: number, z: boolean }, string | number> -> never
 * ```
 */
export type KeysOfType2<O, T> = {
  [k in keyof O]-?: If<Matches<T, O[k]>, k, never>
}[keyof O]

/**
 * The keys of an object `O` whose value types match ('<=') the given type `T`
 *
 * @example
 * ```ts
 * KeysOfType1<{ x: string, y: number, z: string | number | boolean }, string | number> -> 'x' | 'y'
 * KeysOfType1<{ x: string, y: number, z: boolean }, string | number> -> 'x' | 'y'
 * ```
 */
export type KeysOfType1<O, T> = {
  [k in keyof O]-?: If<Matches<O[k], T>, k, never>
}[keyof O]

export type OptionalKeys<T> = KeysOfType2<T, undefined>
export type NullKeys<T> = KeysOfType2<T, null>
export type MaybeKeys<T> = OptionalKeys<T> | NullKeys<T>

export type DeepRequired<T> = NonNullable<
  T extends unknown[]
    ? DeepRequiredArray<T[number]>
    : T extends object
    ? DeepRequiredObject<T>
    : T
>
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DeepRequiredArray<T> extends Array<DeepRequired<T>> {}
type DeepRequiredObject<T> = { [P in keyof T]-?: DeepRequired<T[P]> }

export type DeepMaybe<T> = T extends unknown[]
  ? { [k in keyof T]?: DeepMaybe<T[k]> } | null | undefined
  : T extends object
  ? { [k in keyof T]?: DeepMaybe<T[k]> } | null | undefined
  : T | null | undefined

export type DeepReadonly<T> = T extends unknown[]
  ? Readonly<{ [k in keyof T]: DeepReadonly<T[k]> }>
  : T extends object
  ? Readonly<{ [k in keyof T]: DeepReadonly<T[k]> }>
  : Readonly<T>

export type ObjectEntries<T, A = Required<T>> = Array<
  { [k in keyof A]-?: [k, A[k]] }[keyof A]
>

export type OmitNever<O> = Pick<
  O,
  { [k in keyof O]: O[k] extends never ? never : k }[keyof O]
>

export type RequireKeys<O, K extends keyof O> = O & {
  [k in K]-?: NonNullable<O[k]>
}

export type ReplaceTypeOnce<T, Match, R> = T extends Match ? R : T
export type ReplaceType<T, Match, RT> = T extends object
  ? {
      [k in keyof T]: ReplaceType<T[k], Match, RT>
    }
  : ReplaceTypeOnce<T, Match, RT>

export type ReplaceNull<T, RT = never> = ReplaceType<T, null, RT>

export type ReplaceKeyPair<T, K, Match, RT, k = never> = T extends object
  ? {
      [k in keyof T]: ReplaceKeyPair<T[k], K, Match, RT, k>
    }
  : k extends K
  ? ReplaceTypeOnce<T, Match, RT>
  : T

export type MakePartial<P, K extends keyof P> = Omit<P, K> & { [k in K]?: P[k] }

export type MatchesExact<V, T> = Matches<
  V,
  T & Record<Exclude<keyof V, keyof T>, never>
>
