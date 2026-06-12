import { createMarkdownProcessor } from '@astrojs/markdown-remark'

const processor = await createMarkdownProcessor()

/** Render a markdown string (e.g. a frontmatter summary) to HTML. */
export async function renderMarkdown(md: string): Promise<string> {
  return (await processor.render(md)).code
}
