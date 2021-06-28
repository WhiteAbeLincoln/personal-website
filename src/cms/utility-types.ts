import {
  Field,
  WidgetFieldMap,
  NumberWidgetField,
  ObjectWidgetField,
  ListWidgetField,
  StaticListWidgetField,
  VariableListWidgetField,
  RelationWidgetField,
  HiddenWidgetField,
  FolderCollection,
  FileCollectionEntry,
  SelectWidgetField,
} from 'netlify-cms-app'
import {
  Indices,
  Primitive,
  If,
  Or,
  Some,
  Equal,
  Matches,
  Not,
  AllPaths,
  FollowPath,
  UnionToIntersection,
  MatchesExact,
} from '../util/types'
import {
  TypogStylesData,
  WidgetStylesData,
} from './utility-fields'

type WidgetTypeMapBase<F extends Field> = {
  [k in Exclude<keyof WidgetFieldMap, 'number' | 'list'>]: Exclude<
    WidgetFieldMap[k]['default'],
    undefined
  >
} & {
  number: F extends NumberWidgetField
    ? If<
        Or<Equal<F['valueType'], 'int'>, Equal<F['valueType'], 'float'>>,
        number,
        string
      >
    : Exclude<WidgetFieldMap['number']['default'], undefined>
  list: F extends StaticListWidgetField
    ? Exclude<StaticListWidgetField['default'], 'undefined'>
    : unknown
}

type WidgetTypeMap<F extends Field> = Omit<
  WidgetTypeMapBase<F>,
  'object' | 'list' | 'relation' | 'hidden' | 'select'
> & {
  object: F extends ObjectWidgetField ? GetObjectFieldType<F> : unknown
  list: F extends ListWidgetField ? GetListFieldType<F> : unknown
  relation: F extends RelationWidgetField ? GetRelationFieldType<F> : unknown
  hidden: F extends HiddenWidgetField
    ? Exclude<F['default'], undefined>
    : unknown
  select: F extends SelectWidgetField ? GetSelectFieldType<F> : unknown
}

type GetPhantomType<T> = Matches<undefined, T> extends '1'
  ? never
  : [T] extends [{ __type: infer A }]
  ? Equal<A, unknown> extends '1'
    ? never
    : A
  : never

type DataForField<F extends Field> = GetPhantomType<F['pattern']> extends never
  ? WidgetTypeMap<F>[F['widget']]
  : GetPhantomType<F['pattern']>

type GetSelectFieldType<F extends SelectWidgetField> = GetPhantomType<
  F['options']
> extends never
  ? NonNullable<F['default']>
  : GetPhantomType<F['options']>

type GetStaticListFieldType<F extends StaticListWidgetField> = If<
  Not<Equal<F['field'], unknown>>,
  Array<DataForField<Exclude<F['field'], undefined>>>,
  If<
    Not<Equal<F['fields'], unknown>>,
    Array<GetObjectFieldType<{ fields: Exclude<F['fields'], undefined> }>>,
    WidgetTypeMapBase<F>['list']
  >
>

type TypeKey<T extends { typeKey?: string }> = If<
  Or<
    Matches<undefined, T['typeKey']>,
    Or<Matches<string, T['typeKey']>, Matches<string | undefined, T['typeKey']>>
  >,
  'type',
  Exclude<T['typeKey'], undefined>
>

type GetVariableListFieldType<
  F extends VariableListWidgetField,
  types = GetObjectFieldType<{ fields: F['types'] }>,
  key extends string = TypeKey<F>
> = Array<{ [t in keyof types]: { [k in key]: t } & types[t] }[keyof types]>

type GetListFieldType<
  F extends ListWidgetField
> = F extends VariableListWidgetField
  ? GetVariableListFieldType<F>
  : GetStaticListFieldType<F>

type GetRelationFieldType<
  F extends RelationWidgetField
> = F extends RelationWidgetField & { __collectionType: object }
  ? CollTypeFromPath<F>
  : Exclude<F['default'], undefined>

type CollTypeFromPath<F extends { __collectionType: object }> = F extends {
  __valuePath: AllPaths<F['__collectionType']>
}
  ? FollowPath<F['__collectionType'], F['__valuePath']>
  : unknown

export type GetObjectFieldType<
  F extends { fields: Field[] | readonly Field[] }
> = UnionToIntersection<
  { [k in keyof F['fields']]: DataForObjectField<F['fields'][k]> }[number]
>
// common widget options
// `required`: specify as `false` to make a field optional; defaults to `true`
type DataForObjectField<F> = F extends Field
  ? If<
      Equal<F['widget'], 'list'>,
      // even when list widgets are required, an empty list is not added
      // to the output data - see https://github.com/netlify/netlify-cms/issues/2613
      // only solution is to always treat them as optional in the type
      { [k in F['name']]?: DataForField<F> },
      If<
        Or<Equal<F['required'], true>, Matches<undefined, F['required']>>,
        { [k in F['name']]: DataForField<F> },
        { [k in F['name']]?: DataForField<F> }
      >
    >
  : null

export type FolderCollectionData<
  C extends FolderCollection
> = GetObjectFieldType<C>

export type FileCollectionEntryData<
  C extends FileCollectionEntry
> = GetObjectFieldType<C>

type TemplateLiteralPart = string | number | bigint | boolean | null | undefined
export type LabelToValue<
  T extends TemplateLiteralPart
> = T extends `label_${infer R}` ? `value_${R}` : never

type NonObj = Primitive | ((...args: any) => any)
type BuildParent<
  Parent extends TemplateLiteralPart,
  Child extends keyof any
> = `${Parent extends '' ? '' : `${Parent}.`}${Child & TemplateLiteralPart}`

type GetStyleKeysArr<
  Obj extends any[],
  Parent extends TemplateLiteralPart = ''
> = NonNullable<
  {
    [k in Indices<Obj>]: GetStyleKeys<Obj[k], BuildParent<Parent, k>>
  }[Indices<Obj>]
>

type GetStyleKeysObj<
  Obj extends object,
  Parent extends TemplateLiteralPart = ''
> = If<
  Matches<Obj, NonObj>,
  never,
  NonNullable<
    {
      [k in keyof Obj]: GetStyleKeys<Obj[k], BuildParent<Parent, k>>
    }[keyof Obj]
  >
>

/**
 * Given a cms object, creates a union of keys that should
 * hold style information
 */
export type GetStyleKeys<Obj, Parent extends TemplateLiteralPart = ''> = If<
  Matches<NonNullable<Obj>, NonObj>,
  never,
  If<
    Some<
      [
        MatchesExact<NonNullable<Obj>, WidgetStylesData>,
        MatchesExact<NonNullable<Obj>, TypogStylesData>,
      ]
    >,
    Parent,
    [NonNullable<Obj>] extends [any[]]
      ? GetStyleKeysArr<NonNullable<Obj>, Parent>
      : [NonNullable<Obj>] extends [object]
      ? GetStyleKeysObj<NonNullable<Obj>, Parent>
      : never
  >
>

declare module 'netlify-cms-app' {
  export interface EditorComponent<Fields extends readonly Field[]> {
    fromBlock(match: RegExpMatchArray): GetObjectFieldType<{ fields: Fields }>
    toBlock(obj: GetObjectFieldType<{ fields: Fields }>): string
    toPreview(obj: GetObjectFieldType<{ fields: Fields }>): JSX.Element | string
  }
}
