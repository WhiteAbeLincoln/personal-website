import {
  FolderCollection,
  FileCollectionEntry,
  RelationWidgetField,
  Field,
  ObjectWidgetField,
} from 'netlify-cms-app'
import { AllPaths, MustInclude, UnionToIntersection } from '../util/types'
import { GetObjectFieldType } from './utility-types'
import { Properties as CSSProperties } from 'csstype'

export const mdxCollection = { extension: 'mdx', format: 'yaml-frontmatter' } as const

export const widgetSym = Symbol('aw-widgets')

export const pattern = <T = never>(regex: string, message: string) =>
  ([regex, message] as unknown) as readonly [string, string] & { __type: T }
export const options = <
  Ts extends string[] | Array<{ label: string; value: unknown }>
>(
  ...opts: Ts
) => opts as Ts & { __type: Ts[number] }
export const optionsSafe = <
  T extends string | { label: string; value: unknown }
>() => <U extends [T, ...T[]]>(...opts: MustInclude<T, U>) =>
  (opts as unknown) as T[] & { __type: T }

export const relationField = <
  T extends FolderCollection | FileCollectionEntry = never
>() => <
  N extends string,
  VPath extends AllPaths<V>,
  SPaths extends [AllPaths<V>, ...AllPaths<V>[]],
  V = GetObjectFieldType<T>
>(
  name: N,
  collection: T['name'],
  valueField: VPath,
  searchFields: SPaths,
  rest?: Omit<
    RelationWidgetField,
    'name' | 'collection' | 'valueField' | 'searchFields' | 'widget'
  >,
) => {
  const widget = {
    widget: 'relation',
    name,
    collection,
    valueField: valueField.join('.'),
    searchFields: searchFields.map(s => s.join('.')) as [string, ...string[]],
    ...rest,
  } as const

  return widget as typeof widget & { __collectionType: V; __valuePath: VPath }
}

const splitUpper = (s: string) => s.split(/(?=[A-Z])/)
const upperFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)

/**
 * Css property widget
 * @param name widget name
 * @param label widget label
 * @param linkN end of url in for mdn CSS documentation
 * @param widget widget type, usually string
 */
export const cssProp = <
  N extends keyof CSSProperties<string | number>,
  W extends Field['widget'] = 'string'
>(
  name: N,
  label?: string,
  linkN?: string,
  widget = 'string' as W,
) =>
  ({
    name,
    widget,
    label: label ?? splitUpper(name).map(upperFirst).join(' '),
    hint: `see https://developer.mozilla.org/en-US/docs/Web/CSS/${
      linkN || splitUpper(name).map(lowerFirst).join('-')
    }`,
    required: false,
  } as const)

export const cssProps = <Ns extends (keyof CSSProperties<string | number>)[]>(
  ...ns: Ns
) =>
  ns.map(n => cssProp(n)) as {
    [k in keyof Ns]: { readonly name: Ns[k]; readonly widget: 'string' } & Omit<
      ReturnType<typeof cssProp>,
      'name' | 'widget'
    >
  }

export const typographyFields = [
  ...cssProps('fontFamily', 'fontSize', 'fontWeight', 'fontStyle'),
  cssProp('color', 'Font Color', undefined, 'color'),
  ...cssProps('letterSpacing', 'lineHeight', 'textTransform'),
] as const
export const paddingFields = cssProps(
  'paddingTop',
  'paddingBottom',
  'paddingRight',
  'paddingLeft',
)
export const marginFields = cssProps(
  'marginTop',
  'marginBottom',
  'marginRight',
  'marginLeft',
)
export const borderBottomFields = [
  cssProp('borderBottomColor', undefined, undefined, 'color'),
  ...cssProps('borderBottomWidth', 'borderBottomStyle'),
] as const
export const borderTopFields = [
  cssProp('borderTopColor', undefined, undefined, 'color'),
  ...cssProps('borderTopWidth', 'borderTopStyle'),
]
export const borderLeftFields = [
  cssProp('borderLeftColor', undefined, undefined, 'color'),
  ...cssProps('borderLeftWidth', 'borderLeftStyle'),
]
export const borderRightFields = [
  cssProp('borderRightColor', undefined, undefined, 'color'),
  ...cssProps('borderRightWidth', 'borderRightStyle'),
]
export const borderFields = [
  ...borderLeftFields,
  ...borderRightFields,
  ...borderTopFields,
  ...borderBottomFields,
] as const
export const sizeFields = cssProps(
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
)
export const contentBoxFields = [
  ...sizeFields,
  ...paddingFields,
  ...marginFields,
  ...borderFields,
] as const
export const positionFields = cssProps(
  'float',
  'bottom',
  'top',
  'left',
  'right',
  'zIndex',
)

export const typographyStyle = <
  N extends string,
  L extends string,
  H extends string
>(
  name: N,
  label?: L,
  hint?: H,
) =>
  ({
    widget: 'object',
    required: false,
    name,
    label,
    hint,
    fields: typographyFields,
    collapsed: true,
  } as const)

export const color = <N extends string, R extends boolean = true>(
  name: N,
  required = true as R,
) =>
  ({
    name,
    widget: 'color',
    hint: 'A color in hex, rgb, or rgba format',
    required,
  } as const)

export const colors = <Ns extends string[]>(...names: Ns) =>
  names.map(n => color(n)) as {
    [k in keyof Ns]: {
      readonly name: Ns[k]
      readonly required: true
    } & ReturnType<typeof color>
  }

export const paletteColor = <
  N extends string,
  L extends string,
  H extends string
>(
  name: N,
  label: L,
  hint: H,
) =>
  ({
    widget: 'object',
    required: false,
    name,
    label,
    hint,
    fields: colors('light', 'dark', 'main', 'contrastText'),
    collapsed: true,
  } as const)

export const extendedTypographyFields = [
  ...typographyFields,
  ...paddingFields,
  ...marginFields,
] as const

export const typog = <N extends string, R extends boolean = false>(
  name: N,
  required = false as R,
) =>
  ({
    name,
    widget: 'object',
    fields: extendedTypographyFields,
    required,
    collapsed: true,
  } as const)
export type TypogStylesData = GetObjectFieldType<ReturnType<typeof typog>>

export const markdownFields = [
  {
    name: 'container',
    widget: 'object',
    fields: contentBoxFields,
    label: 'Content container',
    hint: 'Provide padding, margin, border around the content',
    required: false,
    collapsed: true,
  },
  {
    name: 'p',
    widget: 'object',
    fields: extendedTypographyFields,
    label: 'Paragraph',
    required: false,
    collapsed: true,
  },
  {
    name: 'h1',
    widget: 'object',
    fields: extendedTypographyFields,
    label: 'Level 1 Header',
    required: false,
    collapsed: true,
  },
  {
    name: 'h2',
    widget: 'object',
    fields: extendedTypographyFields,
    label: 'Level 2 Header',
    required: false,
    collapsed: true,
  },
  {
    name: 'h3',
    widget: 'object',
    fields: extendedTypographyFields,
    label: 'Level 3 Header',
    required: false,
    collapsed: true,
  },
  {
    name: 'h4',
    widget: 'object',
    fields: extendedTypographyFields,
    label: 'Level 4 Header',
    required: false,
    collapsed: true,
  },
  {
    name: 'h5',
    widget: 'object',
    fields: extendedTypographyFields,
    label: 'Level 5 Header',
    required: false,
    collapsed: true,
  },
  {
    name: 'h6',
    widget: 'object',
    fields: extendedTypographyFields,
    label: 'Level 6 Header',
    required: false,
    collapsed: true,
  },
  {
    name: 'em',
    widget: 'object',
    fields: extendedTypographyFields,
    label: 'Italic Text (Emphasis)',
    required: false,
    collapsed: true,
  },
  {
    name: 'strong',
    widget: 'object',
    fields: extendedTypographyFields,
    label: 'Bold Text (Strong)',
    required: false,
    collapsed: true,
  },
  {
    name: 'code',
    widget: 'object',
    fields: extendedTypographyFields,
    label: 'Preformatted Text (Code)',
    required: false,
    collapsed: true,
  },
  {
    name: 'blockquote',
    widget: 'object',
    fields: [...extendedTypographyFields, ...borderFields, ...sizeFields],
    label: 'Blockquote',
    required: false,
    collapsed: true,
  },
  {
    name: 'a',
    widget: 'object',
    fields: extendedTypographyFields,
    label: 'Links',
    required: false,
    collapsed: true,
  },
  {
    name: 'img',
    widget: 'object',
    fields: [...contentBoxFields, ...positionFields],
    label: 'Images',
    required: false,
    collapsed: true,
  },
  {
    name: 'hr',
    widget: 'object',
    fields: contentBoxFields,
    label: 'Horizontal Divider',
    required: false,
    collapsed: true,
  },
  {
    name: 'ol',
    widget: 'object',
    fields: [...extendedTypographyFields, cssProp('listStyle')],
    label: 'Ordered Lists',
    required: false,
    collapsed: true,
  },
  {
    name: 'ul',
    widget: 'object',
    fields: [...extendedTypographyFields, cssProp('listStyle')],
    label: 'Unordered Lists',
    required: false,
    collapsed: true,
  },
  {
    name: 'li',
    widget: 'object',
    fields: [...extendedTypographyFields, cssProp('listStyle')],
    label: 'List Items',
    required: false,
    collapsed: true,
  },
] as const

export const typogStyles = <Ns extends string[]>(...names: Ns) =>
  names.map(n => typog(n)) as {
    [k in keyof Ns]: { readonly name: Ns[k]; readonly required: false } & Omit<
      ReturnType<typeof typog>,
      'name' | 'required'
    >
  }

export const str = <N extends string>(name: N) =>
  ({
    name,
    widget: 'string',
  } as const)
export const strs = <Ns extends string[]>(...names: Ns) =>
  names.map(name => str(name)) as {
    [k in keyof Ns]: { readonly name: Ns[k]; readonly widget: 'string' }
  }

export type TemplateKey =
  | 'about-us'
  | 'contact'
  | 'forgot-password'
  | 'index-page'
  | 'login'
  | 'overview-page'
  | 'prices'
  | 'signup'
  | 'simple'
  | 'demo-video'
  | 'widget-page'

export const templateKey = <K extends TemplateKey>(key: K) =>
  ({
    label: 'Template Key',
    name: 'templateKey',
    widget: 'hidden',
    default: key,
  } as const)

export const bodyField = {
  label: 'Body',
  name: 'body',
  widget: 'markdown',
} as const

export const titleField = {
  label: 'Title',
  name: 'title',
  widget: 'string',
} as const

export const seoField = {
  [widgetSym]: 'SEO',
  name: 'seo',
  label: 'Search Engine Optimization',
  required: false,
  widget: 'object',
  fields: [
    {
      name: 'description',
      required: false,
      widget: 'string',
    },
    {
      name: 'title',
      required: false,
      widget: 'string',
    },
    { name: 'keywords', required: false, widget: 'list' },
    {
      name: 'author',
      label: 'Twitter Handle',
      required: false,
      widget: 'string',
    },
    {
      name: 'image',
      label: 'Preview Image',
      required: false,
      widget: 'image',
    },
    {
      name: 'lang',
      label: 'Language Code (ISO 639-1)',
      required: false,
      widget: 'string',
    },
    {
      name: 'meta',
      label: 'Extra Metadata',
      required: false,
      widget: 'list',
      fields: [
        { name: 'name', widget: 'string' },
        { name: 'content', widget: 'string' },
      ],
    },
  ],
  collapsed: true,
} as const

/**
 * @param {string} name
 * @returns {Field}
 */
export const flexibleList = <N extends string>(name: N) =>
  ({
    [widgetSym]: 'FlexibleList',
    name,
    widget: 'object',
    required: false,
    fields: [
      { name: 'title', widget: 'string', required: false },
      {
        [widgetSym]: 'FlexibleListEntry',
        name: 'items',
        widget: 'list',
        fields: [
          { name: 'name', widget: 'string' },
          { name: 'image', widget: 'image', required: false },
          { name: 'text', widget: 'text', required: false },
          {
            name: 'href',
            label: 'Link',
            required: false,
            widget: 'string',
            hint:
              'Internal link (starting with /) or external link (starting with https://)',
          },
        ],
        collapsed: true,
      },
    ],
  } as const)

export const flexListStyleFields = [
  {
    name: 'listContainer',
    widget: 'object',
    fields: contentBoxFields,
    collapsed: true,
    required: false,
  },
  {
    name: 'listImage',
    widget: 'object',
    fields: contentBoxFields,
    collapsed: true,
    required: false,
  },
  {
    name: 'listHeader',
    widget: 'object',
    fields: [...typographyFields, ...contentBoxFields],
    collapsed: true,
    required: false,
  },
  {
    name: 'listText',
    widget: 'object',
    fields: [...typographyFields, ...contentBoxFields],
    collapsed: true,
    required: false,
  },
] as const

export const stylesField = {
  widget: 'object',
  name: 'styles',
  label: 'Styles',
  required: false,
  collapsed: true,
} as const

export const bodyStylesField = {
  ...stylesField,
  name: 'body',
  label: 'Body Styles',
  hint: 'Styles for rich text content',
  fields: markdownFields,
} as const

export const pageStylesField = {
  ...stylesField,
  label: 'Misc Styles',
}

export const filteredLinkFields = [
  { name: 'to', widget: 'string' },
  { name: 'name', widget: 'string' },
  {
    name: 'filter',
    label: 'Show only when:',
    hint: 'Shows links only when all specified conditions are true',
    widget: 'object',
    required: false,
    fields: [
      {
        name: 'loggedIn',
        widget: 'boolean',
        label: 'Logged In',
        hint: 'Show only when the user is logged in',
        required: false,
      },
      {
        name: 'notLoggedIn',
        widget: 'boolean',
        label: 'Not Logged In',
        hint: 'Show only when the user is not logged in',
        required: false,
      },
      {
        name: 'groups',
        widget: 'list',
        hint:
          'Comma separated list of groups that the user must be in. Implies Logged In',
        required: false,
      },
    ],
    collapsed: true,
  },
] as const

export const basicPageNoT = <
  F extends string,
  L extends string,
  N extends string
>(
  file: F,
  label: L,
  name: N,
) =>
  ({
    file,
    label,
    name,
    fields: [
      titleField,
      bodyField,
      { ...stylesField, fields: [bodyStylesField] },
      seoField,
    ],
  } as const)
export const basicPage = <T extends TemplateKey>(template: T) => <
  F extends string,
  L extends string,
  N extends string
>(
  file: F,
  label: L,
  name: N,
) => {
  const r = basicPageNoT(file, label, name)
  return { ...r, fields: [templateKey(template), ...r.fields] } as const
}

export const simplePage = basicPage('simple')

export const pageWidgets = <Types extends WidgetMap[keyof WidgetMap][]>(
  ...types: Types
) =>
  ({
    name: 'widgets',
    label: 'Widgets',
    hint: 'Page Widgets',
    widget: 'list',
    typeKey: 'kind',
    types,
  } as const)

export const widgetStyles = {
  [widgetSym]: 'WidgetStyles',
  name: 'styles',
  widget: 'object',
  required: false,
  collapsed: true,
  fields: [...typographyFields, ...contentBoxFields, ...positionFields],
} as const
export type WidgetStylesData = GetObjectFieldType<typeof widgetStyles>

export const headerWidget = {
  [widgetSym]: 'HeaderWidget',
  name: 'header',
  label: 'Header',
  widget: 'object',
  summary: 'Header ({{fields.level}}) - {{fields.content}}',
  fields: [
    str('content'),
    {
      name: 'level',
      label: 'Heading Level',
      widget: 'select',
      options: optionsSafe<'title' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>()(
        'title',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
      ),
    },
    widgetStyles,
  ],
} as const
export type HeaderWidgetData = GetObjectFieldType<typeof headerWidget>

export const textWidget = {
  [widgetSym]: 'TextWidget',
  name: 'text',
  label: 'Text',
  widget: 'object',
  fields: [
    {
      name: 'content',
      widget: 'markdown',
    },
    {
      name: 'styles',
      widget: 'object',
      required: false,
      collapsed: true,
      fields: markdownFields,
    },
  ],
} as const
export type TextWidgetData = GetObjectFieldType<typeof textWidget>

export const imageWidget = {
  [widgetSym]: 'ImageWidget',
  name: 'image',
  label: 'Image',
  widget: 'object',
  fields: [
    {
      name: 'image',
      label: 'Pick or Upload Image',
      widget: 'image',
      required: false,
    },
    {
      name: 'image_link',
      label: 'Link to Image',
      widget: 'string',
      required: false,
    },
    {
      name: 'alt',
      label: 'Alt Text',
      widget: 'string',
      hint: 'Required for accessiblity',
      required: false,
      default: '',
    },
    widgetStyles,
  ],
} as const
export type ImageWidgetData = GetObjectFieldType<typeof imageWidget>

// Hidden widgets don't work except in folder collections
// https://github.com/netlify/netlify-cms/issues/3046
// That is really stupid. why can't we have a widget
// that doesn't display but just saves a value and
// works everywhere?
// export const standaloneWidget = <
//   W extends ObjectWidgetField,
//   TypeKey extends string = 'type',
//   NewW extends Partial<Omit<ObjectWidgetField, 'fields'>> = {}
// >(
//   widget: W,
//   typeKey = 'type' as TypeKey,
//   newWidget = {} as NewW,
// ) =>
//   ({
//     ...(widget as Omit<W, 'fields' | keyof NewW>),
//     ...(newWidget as NewW),
//     fields: [
//       {
//         name: typeKey,
//         widget: 'hidden',
//         default: widget.name as W['name'],
//       },
//       ...(widget.fields as W['fields']),
//     ] as const,
//   } as const)

export const testimonialWidget = {
  [widgetSym]: 'TestimonialWidget',
  name: 'testimonial',
  label: 'Testimonial',
  widget: 'object',
  summary: 'Testimonial by {{fields.author.content}}',
  fields: [
    { ...textWidget, label: 'Testimonial Body' },
    { ...imageWidget, required: false },
    { ...textWidget, name: 'author', label: 'Author' },
    widgetStyles,
  ],
} as const
export type TestimonialWidgetData = GetObjectFieldType<typeof testimonialWidget>

type WidgetMapper<T extends ObjectWidgetField> = UnionToIntersection<
  T extends ObjectWidgetField
    ? {
        [k in T['name']]: T
      }
    : never
>
// When adding new widgets, don't forget to add them to the
// following map
export type WidgetMap = WidgetMapper<
  | typeof headerWidget
  | typeof textWidget
  | typeof imageWidget
  | typeof testimonialWidget
>

export const styledStr = <
  N extends string,
  W extends 'text' | 'string' = 'string'
>(
  name: N,
  widget = 'string' as W,
) =>
  ({
    [widgetSym]: 'StyledStr',
    name,
    widget: 'object',
    fields: [
      { widget, name: 'value', label: 'Value' },
      { ...typog('styles'), label: 'Styles' },
    ],
  } as const)

export type StyledStr = GetObjectFieldType<ReturnType<typeof styledStr>>

export const styledLabelValue = <N extends string, L extends string>(
  name: N,
  label?: L,
) => {
  const base = {
    [widgetSym]: 'StyledLabelValue',
    name: `label_${name}`,
    widget: 'object',
    fields: [
      { widget: 'string', name: 'value', label: 'Label Text' },
      { ...typog('label_styles'), label: 'Label Styles' },
      { ...typog('value_styles'), label: 'Value Styles' },
    ],
  } as const
  if (label) (base as any).label = label
  return base as typeof base & { readonly label?: L }
}
export type StyledLabelValue = GetObjectFieldType<
  ReturnType<typeof styledLabelValue>
>

type MapGraphFields<Data extends string[]> = {
  [k in keyof Data]: Omit<ReturnType<typeof graphData>, 'name'> & {
    name: `data_${Data[k] & string}`
  }
}

export const graphData = <N extends string>(name: N) =>
  ({
    [widgetSym]: 'GraphData',
    name: `data_${name}`,
    widget: 'object',
    fields: [
      { name: 'value', label: 'Label', widget: 'string' },
      { name: 'color', label: 'Color', widget: 'color' },
    ],
  } as const)

export const graph = <N extends string, Data extends string[]>(
  name: N,
  ...data: Data
) =>
  ({
    name: `graph_${name}`,
    widget: 'object',
    fields: [
      styledStr('title'),
      ...(data.map(graphData) as MapGraphFields<Data>),
    ],
  } as const)

// export const urlPattern = pattern(
//   // eslint-disable-next-line prettier/prettier
//   '^https?:\\/\\/[a-z\\.-]+([/:?=&#]{1}[\\da-zA-Z\\.-]+)*[/?]?$|^([/:?=&#]{1}[\\da-zA-Z\\.-]+)*[/?]?$',
//   'Url or local path',
// )
