// Code theme matching the mockups and staying inside the design palette: ink background,
// light text, muted comments, mint for keywords and a soft mint for strings (DESIGN.md §1).
import type { ThemeRegistration } from 'shiki'

const TEXT = '#E6E9E6'
const COMMENT = '#8A918C'
const MINT = '#5FD3B8'
const SOFT_MINT = '#B7E6D9'

export const zacbeTheme: ThemeRegistration = {
  name: 'zacbe',
  type: 'dark',
  colors: { 'editor.background': '#121417', 'editor.foreground': TEXT },
  tokenColors: [
    { settings: { foreground: TEXT } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: COMMENT } },
    {
      scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control'],
      settings: { foreground: MINT },
    },
    {
      scope: ['string', 'string.template', 'markup.inline.raw', 'markup.inserted'],
      settings: { foreground: SOFT_MINT },
    },
    { scope: ['markup.deleted'], settings: { foreground: COMMENT } },
  ],
}
