import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from '@/components/ExternalLink'
import { Gotcha } from '@/components/Gotcha'
import { getTil, getTils } from '@/lib/content'
import { readingTimeLabel, renderMarkdown } from '@/lib/markdown'
import { staticParams } from '@/lib/static-params'
import styles from './entry.module.css'

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
      tags: til.tags,
    },
  }
}

export default async function TilPage({ params }: Props) {
  const found = await getTil((await params).slug)
  if (!found) notFound()
  const { til, newer, older } = found
  const [body, gotcha] = await Promise.all([
    renderMarkdown(til.body),
    til.gotcha ? renderMarkdown(til.gotcha) : undefined,
  ])

  return (
    <div className={`article ${styles.page}`}>
      <Link href="/til/" className={styles.back}>
        ← All TILs
      </Link>

      <article>
        <div className={styles.meta}>
          <time dateTime={til.date}>{til.date}</time>
          <span aria-hidden="true">·</span>
          <span>{readingTimeLabel(`${til.body}\n${til.gotcha ?? ''}`)}</span>
          {til.tags.length > 0 && <span aria-hidden="true">·</span>}
          {til.tags.map((tag) => (
            <Link key={tag} href={`/til/tags/${tag}/`} className={`chip ${styles.tag}`}>
              {tag}
            </Link>
          ))}
        </div>

        <h1 className={styles.title}>{til.title}</h1>

        <div className="prose prose-lead" dangerouslySetInnerHTML={{ __html: body }} />

        {gotcha && (
          <div className={styles.gotcha}>
            <Gotcha html={gotcha} />
          </div>
        )}

        {til.sources.length > 0 && (
          <section aria-labelledby="sources-heading" className={styles.sources}>
            <h2 id="sources-heading">Sources</h2>
            <ul>
              {til.sources.map((source) => (
                <li key={source.url}>
                  <ExternalLink href={source.url}>{source.title}</ExternalLink>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {til.project && (
        <Link href={`/projects/${til.project.slug}/`} className={styles.project}>
          <span>
            <span className={styles.projectLabel}>learned while building</span>
            <span className={styles.projectName}>{til.project.title}</span>
          </span>
          <span className={styles.projectCta}>Read the write-up →</span>
        </Link>
      )}

      {(older || newer) && (
        <nav aria-label="More entries" className={styles.pager}>
          {older ? (
            <Link href={`/til/${older.slug}/`} rel="prev" className={styles.prev}>
              <span className={styles.pagerLabel}>← previous</span>
              <span className={styles.pagerTitle}>{older.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link href={`/til/${newer.slug}/`} rel="next" className={styles.next}>
              <span className={styles.pagerLabel}>next →</span>
              <span className={styles.pagerTitle}>{newer.title}</span>
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
