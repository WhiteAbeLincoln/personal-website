
/** Discriminates a tagged union given tag key and value */
export type DiscriminateUnion<
  Union,
  TagKey extends keyof Union,
  TagValue extends Union[TagKey]
> = Union extends Record<TagKey, TagValue> ? Union : never

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never
