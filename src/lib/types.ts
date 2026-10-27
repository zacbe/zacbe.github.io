// Plain content types used by pages and components. src/lib/content.ts maps Contentful
// entries into these, so nothing outside that file depends on the Contentful SDK.

export type Image = {
  url: string
  width: number
  height: number
  alt: string
}

export type Link = {
  title: string
  url: string
}

export type ProjectStatus = 'in-progress' | 'shipped' | 'archived'

export type ProjectRef = {
  slug: string
  title: string
}

export type Til = {
  slug: string
  title: string
  /** ISO date, `YYYY-MM-DD`. */
  date: string
  tags: string[]
  summary: string
  /** Markdown. */
  body: string
  /** Markdown. */
  gotcha?: string
  project?: ProjectRef
  sources: Link[]
}

export type Project = {
  slug: string
  title: string
  summary: string
  status: ProjectStatus
  featured: boolean
  stack: string[]
  /** ISO date; only the month is shown. */
  started: string
  /** ISO date; only the month is shown. */
  updated: string
  timeSpent?: string
  codeUrl?: string
  demoUrl?: string
  cover?: Image
  /** Markdown. */
  body: string
}

export type Idea = {
  title: string
  why: string
}

export type SiteSettings = {
  name: string
  role: string
  location?: string
  openToWork: boolean
  email: string
  githubUrl?: string
  linkedinUrl?: string
  now: {
    building?: string
    learning?: string
    reading?: string
    updated?: string
  }
  nextUp: Idea[]
}

export type UsesItem = {
  name: string
  why: string
  url?: string
}

export type UsesGroup = {
  title: string
  items: UsesItem[]
}

export type UsesPage = {
  groups: UsesGroup[]
  lastUpdated: string
  dotfilesUrl?: string
  favoriteCommand?: string
  favoriteCommandNote?: string
}

export type ResumeRole = {
  role: string
  company: string
  startYear: number
  /** Undefined means the role is current. */
  endYear?: number
  team?: string
  bullets: string[]
  stack: string[]
}

export type SkillGroup = {
  name: string
  skills: string[]
}

export type Resume = {
  summary: string
  roles: ResumeRole[]
  skillGroups: SkillGroup[]
  education?: { degree?: string; school?: string; year?: number }
  languages: { name: string; level: string }[]
  /** Absolute URL of the PDF on Contentful's CDN. The build copies it to /zacbe-resume.pdf. */
  pdfUrl: string
  pdfPageCount: number
  updated: string
}
