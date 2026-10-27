import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject, getProjects } from '@/lib/content'
import { staticParams } from '@/lib/static-params'
import { renderMarkdown } from '@/lib/markdown'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export async function generateStaticParams() {
  return staticParams(
    'slug',
    (await getProjects()).map((p) => p.slug)
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await getProject((await params).slug)
  if (!found) return {}
  const { project } = found
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}/` },
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.cover ? [{ url: `${project.cover.url}?w=1200&fm=jpg` }] : undefined,
    },
  }
}

// TODO(design): build from handoff/design/project-entry.html.
export default async function ProjectPage({ params }: Props) {
  const found = await getProject((await params).slug)
  if (!found) notFound()
  const { project, tils } = found
  const html = await renderMarkdown(project.body)

  return (
    <article className="article section">
      <h1>{project.title}</h1>
      <p className="lead">{project.summary}</p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      {tils.length > 0 && (
        <ul>
          {tils.map((til) => (
            <li key={til.slug}>
              <Link href={`/til/${til.slug}/`}>{til.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
