import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTil, getTils } from '@/lib/content'
import { staticParams } from '@/lib/static-params'
import { formatDay } from '@/lib/format'
import { readingTimeLabel, renderMarkdown } from '@/lib/markdown'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export async function generateStaticParams() {
  return staticParams(
    'slug',
    (await getTils()).map((t) => t.slug)
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await getTil((await params).slug)
  if (!found) return {}
  const { til } = found
  return {
    title: til.title,
    description: til.summary,
    alternates: { canonical: `/til/${til.slug}/` },
    openGraph: {
      type: 'article',
      title: til.title,
      description: til.summary,
      publishedTime: til.date,
    },
  }
}

// TODO(design): build from handoff/design/til-entry.html (gotcha callout, sources, project
// card, newer/older links).
export default async function TilPage({ params }: Props) {
  const found = await getTil((await params).slug)
  if (!found) notFound()
  const { til, newer, older } = found
  const html = await renderMarkdown(til.body)

  return (
    <article className="article section">
      <p className="mono-meta">
        <time dateTime={til.date}>{formatDay(til.date)}</time> · {readingTimeLabel(til.body)}
      </p>
      <h1>{til.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      <nav aria-label="More TILs">
        {older && <Link href={`/til/${older.slug}/`}>← {older.title}</Link>}{' '}
        {newer && <Link href={`/til/${newer.slug}/`}>{newer.title} →</Link>}
      </nav>
    </article>
  )
}
