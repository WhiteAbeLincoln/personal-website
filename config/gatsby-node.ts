import path from 'path'
import { GatsbyNode, SourceNodesArgs } from 'gatsby'
import { MdxFrontmatter, Maybe, Mdx } from '@src/graphql.gen'

const PAGE_DATA_TYPES = ['MarkdownRemark', 'Mdx']
const pagesdir = `${__dirname}/../src/data/pages`
const inPageDataDirectory = (filen: string): boolean =>
  // since filen should be absolute, I just have to check if pagesdir is
  // a prefix of filen
  filen.startsWith(path.normalize(pagesdir))

// eslint-disable-next-line @typescript-eslint/ban-types
type NonNullReq<T, V = NonNullable<T>> = V extends object
  ? { [k in keyof V]-?: NonNullReq<V[k]> }
  : V

const config: GatsbyNode = {
  onCreateNode: ({ node, actions: { createNodeField } }) => {
    if (PAGE_DATA_TYPES.includes(node.internal.type)) {
      const n = node as { fileAbsolutePath?: string }
      if (n.fileAbsolutePath) {
        const projectDir = path.normalize(`${__dirname}/../`)
        const relative = n.fileAbsolutePath.replace(projectDir, '')
        createNodeField({
          name: 'fileRelativePath',
          node,
          value: relative,
        })
      }
    } else {
      console.log(node.internal)
    }
  },
  createPages: ({ actions: { createPage }, graphql }) => {
    type OrigData = {
      allMdx: {
        nodes: Array<
          Pick<Mdx, 'id' | 'fileAbsolutePath' | 'slug'> & {
            frontmatter?: Maybe<Pick<MdxFrontmatter, 'templateKey'>>
          }
        >
      }
    }
    return graphql<OrigData>(`
      {
        allMdx {
          nodes {
            id
            fileAbsolutePath
            slug
            frontmatter {
              templateKey
            }
          }
        }
      }
    `).then(result => {
      type Node = OrigData['allMdx']['nodes'][number]
      type Data = NonNullReq<Node>

      if (result.errors) throw result.errors
      if (!result.data) return
      const posts = result.data.allMdx.nodes.filter(
        (n): n is Data =>
          !!(
            n.frontmatter &&
            n.slug &&
            n.frontmatter.templateKey &&
            n.fileAbsolutePath &&
            inPageDataDirectory(n.fileAbsolutePath)
          ),
      )
      posts.forEach(n =>
        createPage({
          path: `/${n.slug}`,
          component: path.resolve(
            `src/templates/${n.frontmatter.templateKey}.tsx`,
          ),
          context: { id: n.id },
        }),
      )
    })
  },
  sourceNodes: ({ actions: { createTypes } }: SourceNodesArgs) => {
    const typeDefs = `
    type SEOMeta {
      name: String!
      content: String!
    }
    type SEO {
      description: String
      title: String
      keywords: [String!]
      author: String
      image: String
      lang: String
      meta: [SEOMeta!]
    }
    type MdxFrontmatter @infer {
      templateKey: String
      seo: SEO
    }
    type Mdx implements Node @infer {
      frontmatter: MdxFrontmatter
    }
    `

    createTypes(typeDefs)
    return Promise.resolve()
  },
}

export default config
