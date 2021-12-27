/* eslint-disable @typescript-eslint/no-explicit-any */
// tslint:disable-next-line: no-implicit-dependencies
import { Equal, If, Matches } from './typelevel/boolean'
import { Add } from './typelevel/number'
import { Prepend, Reverse, Tail } from './typelevel/tuple'
import { UnionToIntersection } from './typelevel/union'

export type The<T, V extends T> = V
export type Assert<T, V> = T extends V ? T : never

export type PromiseValue<T> = [T] extends [Promise<infer V>] ? V : never
export type ArrayValue<T extends readonly any[]> = T[number]

/**
 * Interface declaring types that should be treated
 * as leaves (not indexable) in a key-value dictionary object
 *
 * Merge the interface declaration to add more types
 */
export interface LeafTypes {
  number: number
  string: string
  boolean: boolean
  null: null
  undefined: undefined
  bigint: bigint
  symbol: symbol
}
export type ObjectLeaves = LeafTypes[keyof LeafTypes]

export type NonLeafKeys<O> = {
  [k in keyof O]-?: If<Matches<O[k], ObjectLeaves>, never, k>
}[keyof O]

// export type Range<L extends number, H extends number> = {
//   end: never
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
//   incr: L | Range<Add<L, 1>, H>
// }[Gt<L, H> extends '1' ? 'end' : 'incr']

export type ValueOf<T> = T[keyof T]
// from https://github.com/microsoft/TypeScript/issues/13298#issuecomment-654906323
export type MustInclude<T, U extends T[]> = [T] extends [ValueOf<U>] ? U : never

export type Primitive = string | number | boolean | bigint | symbol | undefined

export type ToPrimitive<T> = T extends string
  ? string | T
  : T extends number
  ? number | T
  : T extends boolean
  ? boolean | T
  : T extends (...args: infer A) => infer R
  ? (...args: A) => ToPrimitive<R>
  : T extends any[]
  ? {
      [k in keyof T]: ToPrimitive<T[k]>
    }
  : // eslint-disable-next-line @typescript-eslint/ban-types
  T extends object
  ? {
      [k in keyof T]: ToPrimitive<T[k]>
    }
  : T

/**
 * All paths of an key-value dictionary object
 *
 * To treat some value types as leaves instead of
 * nested objects, add to the `LeafTypes` interface,
 * or pass the `Leaves` type parameter
 */
export type AllPaths<
  T,
  Term extends number = 10,
  K extends keyof T = keyof T,
  Path extends (keyof any)[] = [],
  Count extends number = 0,
  Leaves = ObjectLeaves,
> = {
  [k in K]: T[k] extends Leaves
    ? Reverse<Prepend<Path, k>>
    : Equal<Term, Count> extends '1'
    ? Reverse<Prepend<Path, k>>
    :
        | Reverse<Prepend<Path, k>>
        | AllPaths<
            T[k],
            Term,
            keyof T[k],
            Prepend<Path, k>,
            Add<Count, 1>,
            Leaves
          >
}[K]

export type Path_<T, P extends (keyof any)[]> = UnionToIntersection<
  P extends [keyof T]
    ? { [k in P[0]]: T[k] }
    : P extends [keyof T, ...any[]]
    ? { [k in P[0]]: Path_<T[k], Tail<P>> }
    : never
>

/**
 * Like Pick, constructs an object from paths
 */
export type Path<T, K extends AllPaths<T>> = Path_<T, K>
export type FollowPath_<T, P extends (keyof any)[]> = P extends [keyof T]
  ? { [k in P[0]]: T[k] }[P[0]]
  : P extends [keyof T, ...any[]]
  ? { [k in P[0]]: FollowPath_<T[k], Tail<P>> }[P[0]]
  : never
export type FollowPath<T, K extends AllPaths<T>> = FollowPath_<T, K>

// eslint-disable-next-line @typescript-eslint/ban-types
export type IndexSignatureHack<T> = T extends object
  ? { [k in keyof T]: IndexSignatureHack<T[k]> }
  : T
