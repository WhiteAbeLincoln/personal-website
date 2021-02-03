export type TypeName =
  | 'undefined'
  | 'object'
  | 'boolean'
  | 'number'
  | 'string'
  | 'symbol'
  | 'function'
  | 'bigint'

export type TypeFromName<
  T extends TypeName
> = T extends 'undefined' ? undefined     // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/ban-types
  : T extends 'object'    ? object | null // prettier-ignore
  : T extends 'boolean'   ? boolean       // prettier-ignore
  : T extends 'number'    ? number        // prettier-ignore
  : T extends 'string'    ? string        // prettier-ignore
  : T extends 'symbol'    ? symbol        // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/ban-types
  : T extends 'function'  ? Function      // prettier-ignore
  : T extends 'bigint'    ? bigint        // prettier-ignore
  : never // prettier-ignore

type Ensure<O, K extends PropertyKey, KT = unknown> = O & Record<K, KT>

export function has<T, K extends PropertyKey>(o: T, k: K): o is Ensure<T, K>
export function has<T, K extends PropertyKey, TN extends TypeName>(
  o: T,
  k: K,
  type: TN,
): o is Ensure<T, K, TypeFromName<TN>>
export function has<T, K extends PropertyKey>(
  o: T,
  k: K,
  type?: TypeName,
): o is Ensure<T, K> {
  return (
    typeof o === 'object' &&
    o != null &&
    k in o &&
    (type ? typeof o[(k as unknown) as keyof T] === type : true)
  )
}

export type FalsyValues = null | undefined | false | 0 | ''

export const isTruthy = <T>(v: T): v is Exclude<T, FalsyValues> => !!v
export const isFalsy = <T>(v: T): v is Extract<T, FalsyValues> => !isTruthy(v)
export const isNull = (x: unknown): x is null => x === null
