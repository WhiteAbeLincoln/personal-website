import { GatsbyNode, Node, PluginOptions } from 'gatsby'
import { GraphQLResolveInfo } from 'gatsby/graphql'
import { ObjectTypeComposerFieldConfigMap } from 'graphql-compose'
import { GatsbyGraphQLContext, GraphQLFieldExtensionDefinition } from './types'

export type Options = {
  preset?: 'MarkdownRemark' | 'Mdx'
  markdownNodeType?: string
  fields?: { kind: 'include' | 'exclude'; values: string[] }
  resolver?: (
    gql: {
      source: Record<string, string>
      args: unknown
      context: GatsbyGraphQLContext
      info: GraphQLResolveInfo
    },
    computed: {
      value: string
      parent: Node
    },
  ) => object
}

export const Presets: Record<
  NonNullable<Options['preset']>,
  Omit<Options, 'preset'>
> = {
  MarkdownRemark: {
    markdownNodeType: 'MarkdownRemark',
    resolver: (_gql, computed) => ({ rawMarkdownBody: computed.value }),
  },
  Mdx: {
    markdownNodeType: 'Mdx',
    resolver: (_gql, computed) => ({
      rawBody: computed.value,
      fileAbsolutePath:
        computed.parent.internal.type === 'File'
          ? computed.parent.absolutePath
          : '',
    }),
  },
}

export const pluginOptionsSchema: NonNullable<
  GatsbyNode['pluginOptionsSchema']
> = ({ Joi }) => {
  return Joi.object({
    preset: Joi.string()
      .valid('MarkdownRemark', 'Mdx')
      .description('A preset of the other settings')
      .default('MarkdownRemark'),
    markdownNodeType: Joi.string()
      .description('A GraphQL type to pull resolvers from')
      .optional(),
    fields: Joi.object({
      kind: Joi.string().valid('include', 'exclude').required(),
      values: Joi.array().items(Joi.string()).required(),
    })
      .description('The fields of the GraphQL type to reuse')
      .optional(),
    resolver: Joi.function()
      .arity(2)
      .description(
        'A function to provide initial data for the GraphQL resolvers',
      )
      .optional(),
  })
}

function filterFields(opt: NonNullable<Options['fields']>) {
  const i = opt.kind == 'include'
  const pred = (v: string) => i == (opt.values.includes(v) ?? false)
  return <TS, TC>(
    fields: ObjectTypeComposerFieldConfigMap<TS, TC>,
  ): ObjectTypeComposerFieldConfigMap<TS, TC> =>
    Object.keys(fields).reduce((acc, c) => {
      if (pred(c)) {
        acc[c] = fields[c]
      }
      return acc
    }, {} as typeof fields)
}

function createOptions(opts: PluginOptions) {
  let options = opts as unknown as Options
  const preset = Presets[options.preset ?? 'MarkdownRemark']
  options = { ...preset, ...options }

  const markdownNodeType: Options['markdownNodeType'] = options.markdownNodeType

  if (!markdownNodeType) {
    throw new Error('Need to specify markdownNodeType')
  }

  const fieldFilter = options.fields
    ? filterFields(options.fields)
    : <T>(x: T) => x

  const resolver: Options['resolver'] = options.resolver

  return { markdownNodeType, fieldFilter, resolver }
}

export const createSchemaCustomization: NonNullable<
  GatsbyNode['createSchemaCustomization']
> = (
  {
    actions: { createTypes, createFieldExtension },
    schema,
    createNodeId,
    createContentDigest,
  },
  opts,
) => {
  type TSource = { [x: string]: string }
  type TContext = GatsbyGraphQLContext
  const { markdownNodeType, fieldFilter, resolver } = createOptions(opts)

  const FrontmatterMarkdownField = schema.buildObjectType({
    name: 'FrontmatterMarkdownField',
    fields: {
      // unfortunately, just using the Thunk form for every field results
      // in the arguments and resolver disapearing.
      // However, we can use a dummy field in order to get access to the SchemaComposer
      // instance, which we can use to dynamically add fields using the addFields method
      // internal is a field that should always be present on a gatsby Node
      // type. The addFields call will overwrite it, leaving us
      // without this dummy field in the final schema
      internal: sc => {
        try {
          const Frontmatter = sc.getOTC('FrontmatterMarkdownField')
          const Markdown = sc.getOTC(markdownNodeType)
          const fields = fieldFilter(Markdown.getFields())
          Frontmatter.addFields(fields)
        } catch (e) {
          const err = new Error(
            `Failed to add FrontmatterMarkdownField: the markdownNodeType (${markdownNodeType}) may be invalid`,
          )
          if (e instanceof Error) {
            err.stack = e.stack
          }
          throw err
        }

        return { type: 'String' }
      },
    },
  })

  createTypes(FrontmatterMarkdownField)

  const extension: GraphQLFieldExtensionDefinition<TSource, TContext> = {
    name: 'md',
    extend() {
      return {
        type: 'FrontmatterMarkdownField',
        resolve: (source, args, context, info) => {
          // Grab field
          const value = context.defaultFieldResolver(
            source,
            args,
            context,
            info,
          )
          if (value == null) return null
          if (typeof value !== 'string') {
            throw new Error('@md can only be used with string values')
          }

          const parent = context.nodeModel.findRootNodeAncestor(source)
          if (!parent || parent === source) {
            throw new Error('Unable to find ancestor File node')
          }

          return {
            id: createNodeId(`${info.fieldName} >>> FrontmatterMarkdownField`),
            children: [],
            parent: parent.id,
            internal: {
              content: value,
              contentDigest: createContentDigest(value), // Used for caching
              mediaType: 'text/markdown',
              type: 'MarkdownRemark',
            },
            ...resolver?.({ source, args, context, info }, { value, parent }),
          }
        },
      }
    },
  }

  createFieldExtension(extension)
}
