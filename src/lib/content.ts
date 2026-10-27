// The only module that talks to Contentful. Everything runs at build time (static export).
//
// Env (Next loads .env.development / .env.production / .env.local automatically):
//   CONTENTFUL_SPACE_ID       required
//   CONTENTFUL_ACCESS_TOKEN   required, Delivery API (published content only)
//   CONTENTFUL_PREVIEW_TOKEN  optional, used by `npm run dev` to show drafts
//   CONTENTFUL_ENVIRONMENT    optional, defaults to "master"
import { cache } from 'react'
import { PDFDocument } from 'pdf-lib'
import {
  createClient,
  type Asset,
  type Entry,
  type EntryFieldTypes,
  type EntrySkeletonType,
} from 'contentful'
import type {
  Idea,
  Image,
  Link,
  Project,
  ProjectStatus,
  SiteSettings,
  Til,
  UsesPage,
} from './types'

// --- Contentful skeletons (must match contentful/migrations) ----------------

type LinkSkeleton = EntrySkeletonType<
  { title: EntryFieldTypes.Symbol; url: EntryFieldTypes.Symbol },
  'link'
>

type ProjectSkeleton = EntrySkeletonType<
  {
    title: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    summary: EntryFieldTypes.Symbol
    status: EntryFieldTypes.Symbol<ProjectStatus>
    featured: EntryFieldTypes.Boolean
    stack?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    started: EntryFieldTypes.Date
    updated: EntryFieldTypes.Date
    timeSpent?: EntryFieldTypes.Symbol
    codeUrl?: EntryFieldTypes.Symbol
    demoUrl?: EntryFieldTypes.Symbol
    cover?: EntryFieldTypes.AssetLink
    body: EntryFieldTypes.Text
  },
  'project'
>

type TilSkeleton = EntrySkeletonType<
  {
    title: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    date: EntryFieldTypes.Date
    tags?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    summary: EntryFieldTypes.Symbol
    project?: EntryFieldTypes.EntryLink<ProjectSkeleton>
    body: EntryFieldTypes.Text
    gotcha?: EntryFieldTypes.Text
    sources?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<LinkSkeleton>>
  },
  'til'
>

type IdeaSkeleton = EntrySkeletonType<
  { title: EntryFieldTypes.Symbol; why: EntryFieldTypes.Symbol },
  'idea'
>

type SiteSettingsSkeleton = EntrySkeletonType<
  {
    name: EntryFieldTypes.Symbol
    role: EntryFieldTypes.Symbol
    location?: EntryFieldTypes.Symbol
    focus?: EntryFieldTypes.Symbol
    openToWork: EntryFieldTypes.Boolean
    email: EntryFieldTypes.Symbol
    githubUrl?: EntryFieldTypes.Symbol
    linkedinUrl?: EntryFieldTypes.Symbol
    nowBuilding?: EntryFieldTypes.Symbol
    nowLearning?: EntryFieldTypes.Symbol
    nowReading?: EntryFieldTypes.Symbol
    nowUpdated?: EntryFieldTypes.Date
    nextUp?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<IdeaSkeleton>>
  },
  'siteSettings'
>

type UsesItemSkeleton = EntrySkeletonType<
  { name: EntryFieldTypes.Symbol; why: EntryFieldTypes.Symbol; url?: EntryFieldTypes.Symbol },
  'usesItem'
>

type UsesGroupSkeleton = EntrySkeletonType<
  {
    title: EntryFieldTypes.Symbol
    items?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<UsesItemSkeleton>>
  },
  'usesGroup'
>

type UsesPageSkeleton = EntrySkeletonType<
  {
    internalName: EntryFieldTypes.Symbol
    groups?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<UsesGroupSkeleton>>
    lastUpdated: EntryFieldTypes.Date
    dotfilesUrl?: EntryFieldTypes.Symbol
    favoriteCommand?: EntryFieldTypes.Symbol
    favoriteCommandNote?: EntryFieldTypes.Symbol
  },
  'usesPage'
>

type ResumePageSkeleton = EntrySkeletonType<
  { title: EntryFieldTypes.Symbol; body: EntryFieldTypes.Text; pdf: EntryFieldTypes.AssetLink },
  'resumePage'
>

type Resolved<S extends EntrySkeletonType> = Entry<S, 'WITHOUT_UNRESOLVABLE_LINKS'>

// --- client -------------------------------------------------------------------

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not set. See README.md → Environment.`)
  return value
}

const getClient = cache(() => {
  const preview =
    process.env.NODE_ENV === 'development' && Boolean(process.env.CONTENTFUL_PREVIEW_TOKEN)
  return createClient({
    space: requireEnv('CONTENTFUL_SPACE_ID'),
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    accessToken: preview
      ? requireEnv('CONTENTFUL_PREVIEW_TOKEN')
      : requireEnv('CONTENTFUL_ACCESS_TOKEN'),
    host: preview ? 'preview.contentful.com' : 'cdn.contentful.com',
  }).withoutUnresolvableLinks
})

const PAGE_SIZE = 200

type Query = { order: string; limit: number; skip?: number }

async function query<S extends EntrySkeletonType>(contentType: S['contentTypeId'], q: Query) {
  try {
    return await getClient().getEntries<S>({
      content_type: contentType,
      // The SDK types `order` per skeleton; callers pass valid field paths.
      order: [q.order] as never,
      include: 2,
      limit: q.limit,
      skip: q.skip ?? 0,
    })
  } catch (error) {
    throw new Error(
      `Contentful query for "${contentType}" failed. If the content type doesn't exist yet, ` +
        'run the migrations (README.md → Contentful).',
      { cause: error }
    )
  }
}

async function getAll<S extends EntrySkeletonType>(
  contentType: S['contentTypeId'],
  order: string
): Promise<Resolved<S>[]> {
  const items: Resolved<S>[] = []
  for (let skip = 0; ; skip += PAGE_SIZE) {
    const page = await query<S>(contentType, { order, limit: PAGE_SIZE, skip })
    items.push(...page.items)
    if (skip + page.items.length >= page.total) return items
  }
}

async function getSingleton<S extends EntrySkeletonType>(
  contentType: S['contentTypeId'],
  label: string
): Promise<Resolved<S>> {
  const page = await query<S>(contentType, { order: '-sys.updatedAt', limit: 2 })
  const [entry] = page.items
  if (!entry) throw new Error(`No published "${label}" entry in Contentful. Create one.`)
  if (page.total > 1) console.warn(`More than one "${label}" entry; using the newest one.`)
  return entry
}

// --- mapping helpers ------------------------------------------------------------

/** Contentful dates can carry a time ("2026-10-27T00:00+00:00"); keep only the day. */
const day = (value: string) => value.slice(0, 10)

const present = <T>(value: T | undefined | null): value is T => value != null

function toImage(asset: Asset<'WITHOUT_UNRESOLVABLE_LINKS'> | undefined): Image | undefined {
  if (!asset) return undefined
  const file = asset.fields.file
  const size = file?.details.image
  if (!file?.url || !size) return undefined
  return {
    url: `https:${file.url}`,
    width: size.width,
    height: size.height,
    alt: (asset.fields.description as string | undefined) ?? '',
  }
}

function toLink(entry: Resolved<LinkSkeleton>): Link {
  return { title: entry.fields.title, url: entry.fields.url }
}

function toProject(entry: Resolved<ProjectSkeleton>): Project {
  const f = entry.fields
  return {
    slug: f.slug,
    title: f.title,
    summary: f.summary,
    status: f.status,
    featured: f.featured,
    stack: f.stack ?? [],
    started: day(f.started),
    updated: day(f.updated),
    timeSpent: f.timeSpent,
    codeUrl: f.codeUrl,
    demoUrl: f.demoUrl,
    cover: toImage(f.cover),
    body: f.body,
  }
}

function toTil(entry: Resolved<TilSkeleton>): Til {
  const f = entry.fields
  return {
    slug: f.slug,
    title: f.title,
    date: day(f.date),
    tags: f.tags ?? [],
    summary: f.summary,
    body: f.body,
    gotcha: f.gotcha,
    project: f.project ? { slug: f.project.fields.slug, title: f.project.fields.title } : undefined,
    sources: (f.sources ?? []).filter(present).map(toLink),
  }
}

function toIdea(entry: Resolved<IdeaSkeleton>): Idea {
  return { title: entry.fields.title, why: entry.fields.why }
}

// --- queries (deduplicated per render with React cache) ---------------------------

/** All published TILs, newest first. */
export const getTils = cache(async (): Promise<Til[]> => {
  const entries = await getAll<TilSkeleton>('til', '-fields.date')
  return entries.map(toTil)
})

export const getTil = cache(async (slug: string) => {
  const tils = await getTils()
  const index = tils.findIndex((t) => t.slug === slug)
  if (index === -1) return undefined
  // Newest first, so "previous" (older) is the next item in the list.
  return { til: tils[index]!, newer: tils[index - 1], older: tils[index + 1] }
})

/** Distinct tags with their TIL counts, most used first. */
export const getTags = cache(async () => {
  const counts = new Map<string, number>()
  for (const til of await getTils()) {
    for (const tag of til.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
})

/** All published projects, most recently updated first. */
export const getProjects = cache(async (): Promise<Project[]> => {
  const entries = await getAll<ProjectSkeleton>('project', '-fields.updated')
  return entries.map(toProject)
})

export const getProject = cache(async (slug: string) => {
  const projects = await getProjects()
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) return undefined
  const tils = (await getTils()).filter((t) => t.project?.slug === slug)
  return { project: projects[index]!, tils, newer: projects[index - 1], older: projects[index + 1] }
})

/** TIL count per project slug. */
export const getTilCounts = cache(async () => {
  const counts = new Map<string, number>()
  for (const til of await getTils()) {
    if (til.project) counts.set(til.project.slug, (counts.get(til.project.slug) ?? 0) + 1)
  }
  return counts
})

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const f = (await getSingleton<SiteSettingsSkeleton>('siteSettings', 'Site settings')).fields
  return {
    name: f.name,
    role: f.role,
    location: f.location,
    focus: f.focus,
    openToWork: f.openToWork,
    email: f.email,
    githubUrl: f.githubUrl,
    linkedinUrl: f.linkedinUrl,
    now: {
      building: f.nowBuilding,
      learning: f.nowLearning,
      reading: f.nowReading,
      updated: f.nowUpdated && day(f.nowUpdated),
    },
    nextUp: (f.nextUp ?? []).filter(present).map(toIdea),
  }
})

export const getUsesPage = cache(async (): Promise<UsesPage> => {
  const f = (await getSingleton<UsesPageSkeleton>('usesPage', 'Uses page')).fields
  return {
    groups: (f.groups ?? []).filter(present).map((group) => ({
      title: group.fields.title,
      items: (group.fields.items ?? []).filter(present).map((item) => ({
        name: item.fields.name,
        why: item.fields.why,
        url: item.fields.url,
      })),
    })),
    lastUpdated: day(f.lastUpdated),
    dotfilesUrl: f.dotfilesUrl,
    favoriteCommand: f.favoriteCommand,
    favoriteCommandNote: f.favoriteCommandNote,
  }
})

/** The resume: pasted Markdown plus the PDF. `updated` is when the entry was last published. */
export const getResumePage = cache(async () => {
  const entry = await getSingleton<ResumePageSkeleton>('resumePage', 'Resume')
  const pdfUrl = entry.fields.pdf?.fields.file?.url
  if (!pdfUrl) throw new Error('The Resume entry has no published PDF asset.')
  return {
    markdown: entry.fields.body,
    pdfUrl: `https:${pdfUrl}`,
    updated: day(entry.sys.updatedAt),
  }
})

/** Downloads the resume PDF (at build time) and counts its pages. */
export const getResumePdf = cache(async () => {
  const { pdfUrl } = await getResumePage()
  const response = await fetch(pdfUrl)
  if (!response.ok) throw new Error(`Couldn't download the resume PDF: HTTP ${response.status}`)
  const bytes = new Uint8Array(await response.arrayBuffer())
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false })
  return { bytes, pages: pdf.getPageCount() }
})
