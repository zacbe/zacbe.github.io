// Wraps fenced code blocks in <figure> with a caption bar showing the filename and language
// (DESIGN.md §2 "Code block"). Runs before Shiki, which then highlights the <pre> inside.
//
//   ```ts title="retry.ts"     → caption: retry.ts · ts
//   ```ts retry.ts             → same
//   ```ts                      → caption: ts
//   ```                        → no caption
import type { Element, ElementContent, Root } from 'hast'

const LANGUAGE_NAMES: Record<string, string> = {
  ts: 'TypeScript',
  tsx: 'TSX',
  js: 'JavaScript',
  jsx: 'JSX',
  sh: 'Shell',
  bash: 'Shell',
  zsh: 'Shell',
  sql: 'SQL',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  go: 'Go',
  py: 'Python',
  rb: 'Ruby',
  rs: 'Rust',
  dockerfile: 'Dockerfile',
}

function filenameFrom(meta: string | undefined): string | undefined {
  if (!meta) return undefined
  const quoted = meta.match(/\btitle=(?:"([^"]+)"|'([^']+)')/)
  if (quoted) return quoted[1] ?? quoted[2]
  const bare = meta.trim().split(/\s+/)[0]
  return bare && !bare.includes('=') ? bare : undefined
}

const span = (value: string): ElementContent => ({
  type: 'element',
  tagName: 'span',
  properties: {},
  children: [{ type: 'text', value }],
})

function wrap(pre: Element): Element {
  const code = pre.children.find(
    (child): child is Element => child.type === 'element' && child.tagName === 'code'
  )
  const classes = (code?.properties.className as string[] | undefined) ?? []
  const lang = classes.find((c) => c.startsWith('language-'))?.slice('language-'.length)
  const filename = filenameFrom((code?.data as { meta?: string } | undefined)?.meta)

  const children: ElementContent[] = []
  if (lang || filename) {
    children.push({
      type: 'element',
      tagName: 'figcaption',
      properties: {},
      children: [span(filename ?? ''), span(lang ? (LANGUAGE_NAMES[lang] ?? lang) : '')],
    })
  }
  children.push(pre)
  return { type: 'element', tagName: 'figure', properties: { className: ['code'] }, children }
}

function walk(node: Root | Element) {
  node.children.forEach((child, i) => {
    if (child.type !== 'element') return
    if (child.tagName === 'pre') node.children[i] = wrap(child)
    else walk(child)
  })
}

export const rehypeCodeFigure = () => (tree: Root) => walk(tree)
