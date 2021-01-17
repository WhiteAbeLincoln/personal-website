// this is a module declaration, because no top level imports or exports (this file is not a module)
// must be a declaration, because 'gatsby/graphql' is an untyped module
declare module 'gatsby/graphql' {
  import { GraphQLScalarType } from 'graphql'
  export * from 'graphql'
  export const GraphQLJSON: GraphQLScalarType
}
