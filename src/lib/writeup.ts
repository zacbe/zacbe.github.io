// Rehype plugins for Markdown bodies.
//
// rehypeFigures (TIL and project bodies): a paragraph holding only an image becomes a
// <figure>; the image title becomes the caption (`![Diagram](url "Caption")`). Contentful
// image URLs are made absolute and resized through its Images API.
//
// rehypeSections (project write-ups): wraps each `##` heading and the content after it in
// <section data-section="what-was-hard"> (a slug of the heading), so the write-up's special
// sections can be styled by heading without any markup in the Markdown. In "What was hard",
// a list item starting with **Problem** — text gets the leading dash removed, since the
// problem is shown on its own line.
import type { Element, ElementContent, Root, RootContent } from 'hast'

const isElement = (node: RootContent | ElementContent | undefined, tag?: string): node is Element =>
  node?.type === 'element' && (!tag || node.tagName === tag)

const isBlank = (node: RootContent | ElementContent) =>
  node.type === 'text' && node.value.trim() === ''

function imageUrl(src: string): string {
  const url = src.startsWith('//') ? `https:${src}` : src
  return /^https:\/\/images\.ctfassets\.net\//.test(url) ? `${url}?w=1520&fm=webp&q=80` : url
}

function walkFigures(node: Root | Element) {
  node.children.forEach((child, i) => {
    if (!isElement(child)) return
    if (child.tagName === 'p') {
      const content = child.children.filter((c) => !isBlank(c))
      const [img] = content
      if (content.length === 1 && isElement(img, 'img')) {
        const src = String(img.properties.src ?? '')
        const caption = img.properties.title ? String(img.properties.title) : undefined
        const image: Element = {
          ...img,
          properties: {
            ...img.properties,
            src: imageUrl(src),
            title: undefined,
            loading: 'lazy',
            decoding: 'async',
          },
        }
        const children: ElementContent[] = [image]
        if (caption) {
          children.push({
            type: 'element',
            tagName: 'figcaption',
            properties: {},
            children: [{ type: 'text', value: caption }],
          })
        }
        node.children[i] = {
          type: 'element',
          tagName: 'figure',
          properties: { className: ['image'] },
          children,
        }
        return
      }
    }
    walkFigures(child)
  })
}

export const rehypeFigures = () => (tree: Root) => walkFigures(tree)

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const textOf = (node: ElementContent): string =>
  node.type === 'text'
    ? node.value
    : node.type === 'element'
      ? node.children.map(textOf).join('')
      : ''

/** "**Problem** — how I solved it" → drop the dash after the bold lead. */
function tidyHardList(section: Element) {
  for (const list of section.children) {
    if (!isElement(list, 'ol') && !isElement(list, 'ul')) continue
    for (const item of list.children) {
      if (!isElement(item, 'li')) continue
      // Loose lists wrap content in <p>; look inside the first one.
      const host = item.children.find((c) => isElement(c, 'p')) as Element | undefined
      const parent = host ?? item
      const children = parent.children.filter((c) => !isBlank(c))
      const [first, second] = children
      if (isElement(first, 'strong') && second?.type === 'text') {
        second.value = second.value.replace(/^\s*[—–-]\s*/, '')
      }
      // One wrapper, so the item is [number | content] and the problem can sit on its own line.
      item.children = [{ type: 'element', tagName: 'div', properties: {}, children: item.children }]
    }
  }
}

export const rehypeSections = () => (tree: Root) => {
  const out: RootContent[] = []
  let current: Element | undefined
  for (const node of tree.children) {
    if (isElement(node, 'h2')) {
      const slug = slugify(node.children.map(textOf).join(''))
      current = {
        type: 'element',
        tagName: 'section',
        properties: { dataSection: slug },
        children: [node],
      }
      out.push(current)
    } else if (current) {
      current.children.push(node as ElementContent)
    } else {
      out.push(node)
    }
  }
  for (const node of out) {
    if (isElement(node, 'section') && node.properties.dataSection === 'what-was-hard') {
      tidyHardList(node)
    }
  }
  tree.children = out
}
