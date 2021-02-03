export type Curry<As extends unknown[], R> = As extends []
  ? R
  : As extends [infer A, ...infer B]
  ? (x: A) => Curry<B, R>
  : never

export type Fn<As extends unknown[], R> = (...args: As) => R
