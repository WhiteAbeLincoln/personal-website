declare module 'netlify-cms-app' {
  import React from 'react'
  import { Map, List } from 'immutable'

  type NullPartial<P> = { [k in keyof P]?: P[k] | null | undefined }

  interface RecMap<P extends object>
    extends Map<keyof P, P[keyof P] | null | undefined> {
    set<K extends keyof P>(key: K, val: P[k]): this
    toJS(): NullPartial<P>
    toJSON(): NullPartial<P>
    toArray(): { [k in keyof P]: [k, P[k]] }[keyof P]
    toObject(): NullPartial<P>
    get<K extends keyof P>(key: K, notSetValue: P[K]): P[K]
    get<K extends keyof P>(key: K): P[K] | null | undefined
  }

  export interface WidgetInput {
    name: string
    controlComponent: React.ComponentType
    previewComponent?: React.ComponentType
    globalStyles?: unknown
  }

  export interface Widget {
    control: React.ComponentType
    preview?: React.ComponentType
    globalStyles?: unknown
  }

  export type AddPhantomType<T> = (T & { __type: unknown }) | T

  /** stores a phantom type to allow more specific types */
  export type Pattern = AddPhantomType<
    [string, string] | readonly [string, string]
  >
  export type SelectOptions<
    T extends string | { label: string; value: unknown },
  > = T extends any ? AddPhantomType<T[] | readonly T[]> : T

  export interface FieldBase {
    name: string
    label?: string
    widget: string
    default?: any
    hint?: string
    required?: boolean
    pattern?: Pattern
  }

  export interface NumberWidgetField extends FieldBase {
    widget: 'number'
    default?: string | number
    valueType?: 'int' | 'float'
    min?: number
    max?: number
    step?: number
  }

  export interface StringWidgetField extends FieldBase {
    widget: 'string'
    default?: string
  }

  export interface HiddenWidgetField extends FieldBase {
    widget: 'hidden'
  }

  export interface MarkdownWidgetField extends FieldBase {
    widget: 'markdown'
    default?: string
    buttons?: Array<
      | 'bold'
      | 'italic'
      | 'code'
      | 'link'
      | 'heading-one'
      | 'heading-two'
      | 'quote'
      | 'code-block'
      | 'bulleted-list'
      | 'numbered-list'
    >
  }

  export interface ImageWidgetField extends FieldBase {
    widget: 'image'
    default?: string | null
    media_library?: object
    allow_multiple?: boolean
    config?: object
  }

  export interface ObjectWidgetField extends FieldBase {
    widget: 'object'
    default?: never
    fields: Field[] | readonly Field[]
    collapsed?: boolean
  }

  export interface StaticListWidgetField extends FieldBase {
    widget: 'list'
    default?: string[]
    allow_add?: boolean
    field?: Field
    fields?: Field[] | readonly Field[]
    collapsed?: boolean
  }

  export interface VariableListWidgetField extends FieldBase {
    widget: 'list'
    summary?: string
    typeKey?: string
    types: ObjectWidgetField[] | readonly ObjectWidgetField[]
    allow_add?: boolean
    collapsed?: boolean
  }

  export type ListWidgetField = VariableListWidgetField | StaticListWidgetField
  export interface TextWidgetField extends FieldBase {
    widget: 'text'
    default?: string
  }

  export interface BooleanWidgetField extends FieldBase {
    widget: 'boolean'
    default?: boolean
  }

  export interface FileWidgetField extends FieldBase {
    widget: 'file'
    default?: string | null
    media_library?: object
    allow_multiple?: boolean
    config?: object
  }

  export interface RelationWidgetField extends FieldBase {
    widget: 'relation'
    collection: string
    valueField: string
    searchFields: [string, ...string[]]
    file?: string
    displayFields?: [string, ...string[]]
    default?: unknown
    multiple?: boolean
    optionsLength?: number
  }

  export interface SelectWidgetFieldBase<
    T extends string | { label: string; value: unknown } =
      | string
      | { label: string; value: unknown },
  > extends FieldBase {
    widget: 'select'
    default?: T
    options: SelectOptions<T>
    multiple?: false
  }

  export type SelectWidgetMultiple<T extends SelectWidgetFieldBase> = Omit<
    T,
    'multiple'
  > & {
    multiple: true
    default?: Array<NonNullable<T['default']>>
    min?: number
    max?: number
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface SelectWidgetString extends SelectWidgetFieldBase<string> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface SelectWidgetObject
    extends SelectWidgetFieldBase<{ label: string; value: unknown }> {}

  export type SelectWidgetField =
    | SelectWidgetString
    | SelectWidgetObject
    | SelectWidgetMultiple<SelectWidgetString>
    | SelectWidgetMultiple<SelectWidgetObject>

  export interface ColorWidgetField extends FieldBase {
    widget: 'color'
    allowInput?: boolean
    enableAlpha?: boolean
    default?: string
  }
  export interface WidgetFieldMap {
    object: ObjectWidgetField
    image: ImageWidgetField
    markdown: MarkdownWidgetField
    hidden: HiddenWidgetField
    string: StringWidgetField
    number: NumberWidgetField
    list: ListWidgetField
    text: TextWidgetField
    boolean: BooleanWidgetField
    file: FileWidgetField
    relation: RelationWidgetField
    select: SelectWidgetField
    color: ColorWidgetField
  }

  export type Field = WidgetFieldMap[keyof WidgetFieldMap]

  export type WidgetSerializer<In = unknown, Out = unknown> = {
    serialize: (value: In) => Out
    deserialize: (value: Out) => In
  }
  export interface EditorComponent<Fields extends readonly Field[]> {
    id: string
    label: string
    fields: Fields
    pattern: RegExp
    // fromBlock(match: RegExpMatchArray): any
    // toBlock(): string
    // toPreview(): JSX.Element | string
  }
  export type BackendClass<Ts extends any[]> = new (...args: Ts) => object
  export interface MediaLibrary {
    name: string
  }

  export interface CollectionBase {
    name: string
    identifier_field?: string
    label?: string
    label_singular?: string
    description?: string
    delete?: boolean
    extension?: string // 'yml' | 'yaml' | 'toml' | 'json' | 'md' | 'markdown' | 'html'
    format?:
      | 'yml'
      | 'yaml'
      | 'toml'
      | 'json'
      | 'frontmatter'
      | 'yaml-frontmatter'
      | 'toml-frontmatter'
      | 'json-frontmatter'
    frontmatter_delimeter?: string | [string, string]
    slug?: string
    preview_path?: string
    preview_path_date_field?: string
    fields: Field[] | readonly Field[]
    editor?: {
      preview?: boolean
    }
    summary?: string
  }

  export interface FileCollectionEntry extends CollectionBase {
    file: string
  }

  export interface FileCollection extends CollectionBase {
    files: FileCollectionEntry[] | readonly FileCollectionEntry[]
    fields?: never
  }

  export interface FolderCollection extends CollectionBase {
    folder: string
    create?: boolean
    filter?: { field: string; value: any }
  }

  type Collection = FileCollection | FolderCollection

  export type Backend = {
    branch?: string
    site_domain?: string
    base_url?: string
    auth_endpoint?: string
  } & (
    | { name: 'git-gateway' | 'github'; accept_roles?: string[] }
    | {
        name: 'github'
        repo: string
        preview_context?: string
        api_root?: string
      }
    | {
        name: 'gitlab'
        repo: string
        auth_type?: 'implicit'
        app_id?: string
        api_root?: string
      }
    | {
        name: 'bitbucket'
        repo: string
        auth_type?: 'implicit'
        app_id?: string
      }
    | { name: 'test-repo' }
  )

  export interface InitConfig {
    backend: Backend
    local_backend?:
      | boolean
      | {
          url: string
          allowed_hosts: string[]
        }
    publish_mode?: 'editorial_workflow'
    media_folder: string
    public_folder?: string
    media_library?: {
      name: string
      config?: object
    }
    site_url?: string
    display_url?: string
    logo_url?: string
    show_preview_links?: boolean
    slug?: {
      encoding?: 'unicode' | 'ascii'
      clean_accents?: boolean
      sanitize_replacement?: string
    }
    collections: Collection[] | readonly Collection[]
    load_config_file?: boolean
  }

  type WidgetsForRecord = RecMap<{
    data: unknown
    widgets: Map<string, React.ReactElement | undefined>
  }>

  export type FILES = 'file_based_collection'
  export type FOLDER = 'folder_based_collection'
  export type AssetProxy = {
    field?: object
    fileObj: File
    path: string
    url: string
  }

  export interface PreviewComponentProps {
    widgetFor(
      field: string /** more optional params here, but I don't know their types */,
    ): React.ReactElement<PreviewComponentProps> | null
    widgetsFor(field: string): List<WidgetsForRecord> | WidgetsForRecord
    getAsset(item: any): AssetProxy | null | undefined
    fieldsMetaData: Map
    entry: RecMap<{
      partial: boolean
      path: string
      isModification?: null
      raw: string
      data?: Map
      slug?: string
      metaData?: null
      newRecord: boolean
      isFetching: boolean
      isPersisting?: boolean
      label?: null
      collection: string
    }>
    collection: RecMap<Collection>
    fields?: List<RecMap<Field>> | null
  }

  export type PreviewComponent = React.ComponentType<PreviewComponentProps>
  export type WidgetControlProps<F extends Field = Field> = {
    onChange: (value: string) => void
    forID: string
    value?: string
    classNameWrapper?: string
    field: RecMap<F>
    setActiveStyle?: () => void
    setInactiveStyle?: () => void
  }
  export type WidgetPreviewProps = {
    // TODO: fix this, not necessarily a string
    value: string
    field: RecMap<Field>
    metadata: unknown
    getAsset?: () => unknown
    entry: RecMap<unknown>
    fieldsMetaData: RecMap<unknown>
  }

  const NetlifyCmsCore: {
    init: (opts?: { config?: InitConfig }) => void
    registerPreviewStyle: (style: string, opts?: { raw: boolean }) => void
    getPreviewStyles: () => Array<{
      raw: boolean
      value: string
    }>
    registerPreviewTemplate: (name: string, component: PreviewComponent) => void
    getPreviewTemplate: (name: string) => PreviewComponent | undefined
    registerWidget: ((
      name: string,
      control: string | React.ComponentType<WidgetControlProps>,
      preview?: React.ComponentType<WidgetPreviewProps>,
    ) => void) &
      ((widget: WidgetInput) => void) &
      ((widgets: WidgetInput[]) => void)
    getWidget: (name: string) => Widget | undefined
    resolveWidget: (name?: string) => Widget
    registerEditorComponent: <Fields extends readonly Field[]>(
      component: EditorComponent<Fields>,
    ) => void
    getEditorComponents: () => Map<string, EditorComponent<any>>
    registerWidgetValueSerializer: <In, Out>(
      name: string,
      serializer: WidgetSerializer<In, Out>,
    ) => void
    getWidgetValueSerializer: (name: string) => WidgetSerializer | undefined
    registerBackend: (name: string, backend: BackendClass<any[]>) => void
    getBackend: (name: string) => { init: (...args: any[]) => object }
    registerMediaLibrary: (mediaLibrary: MediaLibrary, options?: object) => void
    getMediaLibrary: (name: string) => MediaLibrary | undefined
  }

  export default NetlifyCmsCore
}
