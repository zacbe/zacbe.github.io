// Renders Markdown from Contentful to HTML at build time, with Shiki for code blocks.
// Raw HTML in the Markdown is dropped (remark-rehype's default), so the output is safe to inject.
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'
import { rehypeCodeFigure } from './code-figure'
import { rehypeExternalLinks } from './external-links'
import { zacbeTheme } from './shiki-theme'
import readingTime from 'reading-time'

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeCodeFigure)
  .use(rehypeShiki, { theme: zacbeTheme, defaultLanguage: 'text', fallbackLanguage: 'text' })
  .use(rehypeExternalLinks)
  .use(rehypeStringify)

export async function renderMarkdown(markdown: string): Promise<string> {
  return String(await processor.process(markdown))
}

/** "3 min read" */
export function readingTimeLabel(markdown: string): string {
  return `${Math.max(1, Math.round(readingTime(markdown).minutes))} min read`
}
