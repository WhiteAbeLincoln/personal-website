import type { MarkdownHeading } from 'astro';

export function getTitle({ title }: { title?: string }, headings?: () => MarkdownHeading[] | undefined): string | undefined
export function getTitle({ title }: { title?: string }, headings?: () => Promise<MarkdownHeading[] | undefined>): string | Promise<string | undefined> | undefined
export function getTitle({ title }: { title?: string }, headings?: () => Promise<MarkdownHeading[] | undefined> | MarkdownHeading[] | undefined) {
  if (title) {
    return title
  }

  if (headings) {
    const result = headings()
    if (Array.isArray(result)) {
      return result.find(d => d.depth === 1)?.text

    }
    return result?.then(r => r?.find(d => d.depth === 1)?.text)
  }
}
