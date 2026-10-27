// Makes links to other sites in rendered Markdown open in a new tab, like <ExternalLink>.
import type { Element, ElementContent, Root } from 'hast'

const isExternal = (href: unknown) => typeof href === 'string' && /^https?:\/\//i.test(href)

function walk(node: Root | Element) {
  for (const child of node.children) {
    if (child.type !== 'element') continue
    if (child.tagName === 'a' && isExternal(child.properties.href)) {
      child.properties.target = '_blank'
      child.properties.rel = ['noopener', 'noreferrer']
      const hint: ElementContent = {
        type: 'element',
        tagName: 'span',
        properties: { className: ['visually-hidden'] },
        children: [{ type: 'text', value: ' (opens in a new tab)' }],
      }
      child.children.push(hint)
    }
    walk(child)
  }
}

/** Use as a rehype plugin, or call directly on a hast tree. */
export function externalLinks(tree: Root) {
  walk(tree)
}

export const rehypeExternalLinks = () => externalLinks
