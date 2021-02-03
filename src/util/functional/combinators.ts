import { Curry } from '@util/types/typelevel/function';

export const C = <A, B, C>(f: Curry<[A, B], C>) => (b: B) => (a: A) => f(a)(b)

export { C as flip }
