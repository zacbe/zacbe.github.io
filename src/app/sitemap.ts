import type { MetadataRoute } from 'next'
import { getProjects, getTags, getTils } from '@/lib/content'

export const dynamic = 'force-static'

const SITE = 'https://zacbe.dev'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tils, projects, tags] = await Promise.all([getTils(), getProjects(), getTags()])
  const pages = ['/', '/til/', '/projects/', '/uses/', '/resume/'].map((path) => ({
    url: `${SITE}${path}`,
  }))
  return [
    ...pages,
    ...tils.map((t) => ({ url: `${SITE}/til/${t.slug}/`, lastModified: t.date })),
    ...tags.map(({ tag }) => ({ url: `${SITE}/til/tags/${tag}/` })),
    ...projects.map((p) => ({ url: `${SITE}/projects/${p.slug}/`, lastModified: p.updated })),
  ]
}
