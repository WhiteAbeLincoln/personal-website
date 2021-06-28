import { Node } from 'gatsby'
import {
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldResolver,
  GraphQLOutputType,
} from 'gatsby/graphql'
import { ComposeOutputType, ObjectTypeComposerFieldConfigDefinition } from 'graphql-compose'

export interface GraphQLFieldExtensionDefinition<TSource, TContext> {
  name: string
  type?: ComposeOutputType<TContext>
  args?: GraphQLFieldConfigArgumentMap
  extend(
    args: GraphQLFieldConfigArgumentMap,
    prevFieldConfig: GraphQLFieldConfig<TSource, TContext>,
  ): ObjectTypeComposerFieldConfigDefinition<TSource, TContext>
}

export interface GatsbyNodeModel {
  findRootNodeAncestor(
    obj: object | Array<unknown>,
    predicate?: (n: Node) => boolean,
  ): Node | null
  getAllNodes(
    args: { type?: string | GraphQLOutputType },
    pageDependencies?: { path: string; connectionType?: string },
  ): Node[]
  getNodeById(
    args: { id: string; type?: string | GraphQLOutputType },
    pageDependencies?: { path: string; connectionType?: string },
  ): Node | null
  getNodesByIds(
    args: { ids: string[]; type?: string | GraphQLOutputType },
    pageDependencies?: { path: string; connectionType?: string },
  ): Node[]
  getTypes(): string[]
  getNodesByIds(
    args: {
      query: { filter: object; sort?: object }
      type?: string | GraphQLOutputType
      firstOnly?: boolean
    },
    pageDependencies?: { path: string; connectionType?: string },
  ): Promise<null | Node | Node[]>
  trackInlineObjectsInRootNode(node: Node): void
  trackPageDependencies(
    result: Node | Node[],
    pageDependencies?: { path: string; connectionType?: string },
  ): Node | Node[]
}

export interface GatsbyGraphQLContext<
  TSource = { [x: string]: string },
  TArgs = { [x: string]: any }
> {
  nodeModel: GatsbyNodeModel
  defaultFieldResolver: GraphQLFieldResolver<
    TSource,
    GatsbyGraphQLContext<TSource, TArgs>
  >
}
