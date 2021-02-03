/**
 * converts a tuple of unions to a union of tuples
 *
 * Can be considered the cartesian product of the unions in the tuple
 *
 * Example:
 * ```typescript
 * DeUnionTuple<['a' | 'b', 'd' | 'e', 'f']> -> ['a','d','f'] | ['a','e','f'] | ['b','d','f'] | ['b','e','f']
 * ```
 */
export type DeUnionTuple<T extends any[]> = T extends [any]
  ? { [k in T[0]]: [k] }[T[0]]
  : T extends [any, ...any[]]
  ? { [k in T[0]]: DeUnionHelper<DeUnionTuple<Tail<T>>, k> }[T[0]]
  : []

type DeUnionHelper<Tp, K> = Tp extends any[] ? Prepend<Tp, K> : never

export type Tail<T extends any[]> = ((...args: T) => any) extends (
  _: any,
  ..._1: infer Rest
) => any
  ? Rest
  : []

export type Prepend<Tuple extends any[], Added> = ((
  _: Added,
  ..._1: Tuple
) => any) extends (..._: infer Result) => any
  ? Result
  : never

export type Reverse<Tuple extends any[], Prefix extends any[] = []> = {
  empty: Prefix
  nonEmpty: ((..._: Tuple) => any) extends (
    _: infer First,
    ..._1: infer Next
  ) => any
    ? Reverse<Next, Prepend<Prefix, First>>
    : never
  infinite: []
  // infinite: {
  //   ERROR: 'Cannot reverse an infinite tuple'
  //   CODENAME: 'InfiniteTuple'
  // }
}[Tuple extends [any, ...any[]]
  ? IsFinite<Tuple, 'nonEmpty', 'infinite'>
  : 'empty']

export type IsFinite<
  Tuple extends readonly any[],
  Finite = '1',
  Infinite = '0'
> = {
  empty: Finite
  nonEmpty: ((..._: Tuple) => any) extends (
    _: infer First,
    ..._1: infer Rest
  ) => any
    ? IsFinite<Rest, Finite, Infinite>
    : never
  infinite: Infinite
}[Tuple extends []
  ? 'empty'
  : Tuple extends (infer Element)[]
  ? Element[] extends Tuple
    ? 'infinite'
    : 'nonEmpty'
  : never]

export type ArrayKeys = keyof unknown[]
export type Indices<T> = Exclude<keyof T, ArrayKeys>
export type Idx<Arr, I extends number> = Arr extends unknown[] ? Arr[I] : never
