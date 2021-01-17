import {
  Field,
  WidgetFieldMap,
  NumberWidgetField,
  ObjectWidgetField,
  ListWidgetField,
  RelationWidgetField,
  HiddenWidgetField,
  FolderCollection,
  FileCollectionEntry,
  SelectWidgetField,
} from 'netlify-cms-app'
import {
  If,
  Or,
  Equal,
  Matches,
  Not,
  AllPaths,
  FollowPath,
  UnionToIntersection,
} from '@util/types'

type WidgetTypeMapBase<F extends Field> = {
  [k in keyof Exclude<WidgetFieldMap, 'number'>]: Exclude<
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

type GetListFieldType<F extends ListWidgetField> = If<
  Not<Equal<F['field'], unknown>>,
  Array<DataForField<Exclude<F['field'], undefined>>>,
  If<
    Not<Equal<F['fields'], unknown>>,
    Array<GetObjectFieldType<{ fields: Exclude<F['fields'], undefined> }>>,
    WidgetTypeMapBase<F>['list']
  >
>

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
      Or<Equal<F['required'], true>, Matches<undefined, F['required']>>,
      { [k in F['name']]: DataForField<F> },
      { [k in F['name']]?: DataForField<F> }
    >
  : null

export type FolderCollectionData<
  C extends FolderCollection
> = GetObjectFieldType<C>

export type FileCollectionEntryData<
  C extends FileCollectionEntry
> = GetObjectFieldType<C>

declare module 'netlify-cms-app' {
  export interface EditorComponent<Fields extends readonly Field[]> {
    fromBlock(match: RegExpMatchArray): GetObjectFieldType<{ fields: Fields }>
    toBlock(obj: GetObjectFieldType<{ fields: Fields }>): string
    toPreview(obj: GetObjectFieldType<{ fields: Fields }>): JSX.Element | string
  }
}
