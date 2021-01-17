import {
  FolderCollection,
  FileCollectionEntry,
  RelationWidgetField,
  Field,
} from 'netlify-cms-app'
import { AllPaths, MustInclude } from '@util/types'
import { TypographyVariant } from '@src/styles/makeStyles'
import { GetObjectFieldType } from './utility-types'
import * as CSS from 'csstype'

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
  N extends keyof CSS.Properties<string | number>,
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

export const cssProps = <Ns extends (keyof CSS.Properties<string | number>)[]>(
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
  {
    widget: 'select',
    name: 'variant',
    required: false,
    hint:
      'Extend typography specified in the site theme. Print pages will use the print theme',
    options: optionsSafe<TypographyVariant>()(
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'subtitle1',
      'subtitle2',
      'body1',
      'body2',
      'caption',
      'button',
      'overline',
      'title',
    ),
  },
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

export const seoField = <
  K extends Partial<
    Record<
      | 'seo'
      | 'description'
      | 'title'
      | 'keywords'
      | 'author'
      | 'image'
      | 'lang'
      | 'meta',
      boolean
    >
  > = Record<
    | 'seo'
    | 'description'
    | 'title'
    | 'keywords'
    | 'author'
    | 'image'
    | 'lang'
    | 'meta',
    undefined
  >
>(
  required: K = {} as K,
) => {
  const r = <k extends keyof K>(key: k) =>
    !!required[key] as K[k] extends undefined | false ? false : true

  return {
    name: 'seo',
    label: 'Search Engine Optimization',
    required: r('seo'),
    widget: 'object',
    fields: [
      {
        name: 'description',
        required: r('description'),
        widget: 'string',
      },
      {
        name: 'title',
        required: r('title'),
        widget: 'string',
      },
      { name: 'keywords', required: r('keywords'), widget: 'list' },
      {
        name: 'author',
        label: 'Twitter Handle',
        required: r('author'),
        widget: 'string',
      },
      {
        name: 'image',
        label: 'Preview Image',
        required: r('image'),
        widget: 'image',
      },
      {
        name: 'lang',
        label: 'Language Code (ISO 639-1)',
        required: r('lang'),
        widget: 'string',
      },
      {
        name: 'meta',
        label: 'Extra Metadata',
        required: r('meta'),
        widget: 'list',
        fields: [
          { name: 'name', widget: 'string' },
          { name: 'content', widget: 'string' },
        ],
      },
    ],
    collapsed: true,
  } as const
}

/**
 * @param {string} name
 * @returns {Field}
 */
export const flexibleList = <N extends string>(name: N) =>
  ({
    name,
    widget: 'object',
    required: false,
    fields: [
      { name: 'title', widget: 'string', required: false },
      {
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
      seoField(),
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

// export const urlPattern = pattern(
//   // eslint-disable-next-line prettier/prettier
//   '^https?:\\/\\/[a-z\\.-]+([/:?=&#]{1}[\\da-zA-Z\\.-]+)*[/?]?$|^([/:?=&#]{1}[\\da-zA-Z\\.-]+)*[/?]?$',
//   'Url or local path',
// )
