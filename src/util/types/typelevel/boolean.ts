export type SB = '1' | '0'
export type If<P extends SB, T, F> = P extends '1' ? T : F
export type Not<B extends SB> = B extends '1' ? '0' : '1'
export type And<A extends SB, B extends SB> = A extends '1'
  ? B extends '1'
    ? '1'
    : '0'
  : '0'
export type Every<Ands extends SB[]> = Equal<Ands[number], '1'>

export type Or<A extends SB, B extends SB> = A extends '1'
  ? '1'
  : B extends '1'
  ? '1'
  : '0'
export type Some<Ors extends SB[]> = '1' extends Ors[number] ? '1' : '0'

export type Matches<V, T> = [V] extends [T] ? '1' : '0'
export type Equal<A, B> = And<Matches<A, B>, Matches<B, A>>
export type IsNullable<T> = Not<Equal<Exclude<T, null | undefined>, T>>
