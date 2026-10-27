// Renders Markdown from Contentful to HTML at build time, with Shiki for code blocks.
// Raw HTML in the Markdown is dropped (remark-rehype's default), so the output is safe to inject.
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'
import { rehypeExternalLinks } from './external-links'
import readingTime from 'reading-time'

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  // TODO(design): caption bar with filename + language (DESIGN.md §2 "Code block"), and a
  // theme tuned to the mockup colours. The background is overridden to --code-bg in CSS.
  .use(rehypeShiki, { theme: 'github-dark-default', defaultLanguage: 'text' })
  .use(rehypeExternalLinks)
  .use(rehypeStringify)

export async function renderMarkdown(markdown: string): Promise<string> {
  return String(await processor.process(markdown))
}

/** "3 min read" */
export function readingTimeLabel(markdown: string): string {
  return `${Math.max(1, Math.round(readingTime(markdown).minutes))} min read`
}
