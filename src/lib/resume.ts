// Turns the pasted resume Markdown into the pieces the /resume layout needs.
//
// It reads the conventions the resume already uses (see docs/Resume.md):
//   - paragraphs before the first `#` heading      → summary
//   - `# Company, Location`                          → starts a company
//   - `**Role (Team) | Sept. 2024 - Present**`       → a role, with dates
//   - a bullet list after a role                     → that role's highlights
//   - `**Stack:** a • b • c`                         → the company's stack
//   - a table (e.g. Education | Languages)           → one sidebar box per column
//   - `Keywords: a, b, c`                            → the Skills box
//   - `---`                                          → ignored
// Anything else is kept and rendered as plain prose after the experience list, so a paste
// that doesn't follow the conventions still shows everything.
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import { toHast } from 'mdast-util-to-hast'
import { toHtml } from 'hast-util-to-html'
import { toString } from 'mdast-util-to-string'
import type { Element, Root as HastRoot } from 'hast'
import { externalLinks } from './external-links'
import type { List, Nodes, PhrasingContent, Root, RootContent, Table } from 'mdast'

export type ResumeRole = {
  title: string
  company: string
  /** Team and/or location, e.g. "Platform Team · Munich Germany". */
  subline?: string
  /** "2024 — now" */
  dates: string
  /** Inline HTML, one per bullet. */
  highlights: string[]
  /** Set on the last role of each company. */
  stack: string[]
}

export type SidebarBox =
  | { kind: 'pairs'; title: string; pairs: { name: string; level: string }[] }
  | { kind: 'lines'; title: string; lines: string[] }

export type ParsedResume = {
  /** Inline HTML, one per paragraph. */
  summary: string[]
  roles: ResumeRole[]
  skills: string[]
  sidebar: SidebarBox[]
  /** Block HTML for anything that didn't match a convention. Empty when everything matched. */
  extra: string
}

const parser = unified().use(remarkParse).use(remarkGfm)

// Raw HTML in the Markdown is dropped (toHast's default), so the output is safe to inject.

/** Block HTML for a list of top-level nodes. */
const html = (nodes: RootContent[]) => {
  const tree = toHast({ type: 'root', children: nodes } as Root) as HastRoot
  externalLinks(tree)
  return toHtml(tree)
}

/** Inline HTML for phrasing content (a paragraph's or list item's children), no wrapper. */
const inlineHtml = (children: PhrasingContent[]) => {
  const paragraph = toHast({ type: 'paragraph', children }) as Element
  const tree: HastRoot = { type: 'root', children: paragraph.children }
  externalLinks(tree)
  return toHtml(tree)
}
const text = (node: Nodes) => toString(node).replace(/\s+/g, ' ').trim()

const YEAR = /\b(?:19|20)\d{2}\b/g
const ONGOING = /\b(present|now|current)\b/i

/** "Sept. 2024 - Present" → "2024 — now"; "Nov. 2023 - Aug. 2024" → "2023 — 2024". */
function formatDates(raw: string): string {
  const years = raw.match(YEAR) ?? []
  if (years.length === 0) return raw
  const start = years[0]!
  const end = ONGOING.test(raw) ? 'now' : (years[1] ?? start)
  return end === start ? start : `${start} — ${end}`
}

function splitList(value: string, separator: RegExp): string[] {
  return value
    .split(separator)
    .map((part) => part.trim().replace(/\.$/, ''))
    .filter(Boolean)
}

/** "Language: level" pairs from text like "Spanish: Native English: C1 German: A1". */
function languagePairs(value: string) {
  return [...value.matchAll(/(\p{Lu}[\p{L}-]*):\s*([^\s:]+)/gu)].map(([, name, level]) => ({
    name: name!,
    level: level!,
  }))
}

function tableToSidebar(table: Table): SidebarBox[] {
  const [header, ...rows] = table.children
  if (!header) return []
  return header.children.map((cell, column) => {
    const title = text(cell)
    // Raw text: the double spaces / line breaks inside a cell separate its parts.
    const value = rows
      .map((row) => (row.children[column] ? toString(row.children[column]) : ''))
      .filter(Boolean)
      .join('  ')
    const pairs = /language/i.test(title) ? languagePairs(value) : []
    if (pairs.length > 0) return { kind: 'pairs', title, pairs }
    // "School, Country.  Major: X.  Specialty: Y." → one line per part.
    const lines = value
      .split(/\s{2,}|\n/)
      .map((line) => line.trim())
      .filter(Boolean)
    return { kind: 'lines', title, lines }
  })
}

export function parseResume(markdown: string): ParsedResume {
  const tree = parser.parse(markdown)
  const result: ParsedResume = { summary: [], roles: [], skills: [], sidebar: [], extra: '' }
  const extra: RootContent[] = []

  let company: { name: string; location?: string; firstRole: number } | undefined
  let role: ResumeRole | undefined

  for (const node of tree.children) {
    switch (node.type) {
      case 'thematicBreak':
      case 'html':
        continue

      case 'heading':
        if (node.depth === 1) {
          const [name = '', ...rest] = text(node).split(/,\s*/)
          company = { name, location: rest.join(', ') || undefined, firstRole: result.roles.length }
          role = undefined
          continue
        }
        // A line directly above `---` parses as a heading ("setext"); treat it as a paragraph.
        if (!/^(stack|keywords):/i.test(text(node))) break
      // falls through
      case 'paragraph': {
        const value = text(node)
        const keywords = value.match(/^keywords:\s*(.+)$/i)
        if (keywords) {
          result.skills.push(...splitList(keywords[1]!, /,/))
          continue
        }
        const stack = value.match(/^stack:\s*(.+)$/i)
        if (stack && company && result.roles.length > company.firstRole) {
          result.roles.at(-1)!.stack = splitList(stack[1]!, /[•·,]/)
          continue
        }
        if (!company && node.type === 'paragraph') {
          result.summary.push(inlineHtml(node.children))
          continue
        }
        const separator = value.lastIndexOf('|')
        if (company && separator !== -1) {
          const titlePart = value.slice(0, separator).trim()
          const team = titlePart.match(/\(([^)]+)\)\s*$/)?.[1]
          role = {
            title: team ? titlePart.slice(0, titlePart.lastIndexOf('(')).trim() : titlePart,
            company: company.name,
            subline: [team, company.location].filter(Boolean).join(' · ') || undefined,
            dates: formatDates(value.slice(separator + 1)),
            highlights: [],
            stack: [],
          }
          result.roles.push(role)
          continue
        }
        break
      }

      case 'list':
        if (role && role.highlights.length === 0) {
          role.highlights = (node as List).children.map((item) =>
            inlineHtml(
              item.children.flatMap((child) => (child.type === 'paragraph' ? child.children : []))
            )
          )
          continue
        }
        break

      case 'table':
        result.sidebar.push(...tableToSidebar(node))
        continue
    }
    extra.push(node)
  }

  if (extra.length > 0) result.extra = html(extra)
  return result
}
