import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from '@/components/ExternalLink'
import { ProjectStatus } from '@/components/ProjectStatus'
import { getProject, getProjects } from '@/lib/content'
import { formatMonth } from '@/lib/format'
import { renderWriteUp } from '@/lib/markdown'
import { staticParams } from '@/lib/static-params'
import styles from './writeup.module.css'

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
      type: 'article',
      title: project.title,
      description: project.summary,
      images: project.cover
        ? [{ url: `${project.cover.url}?w=1200&h=630&fit=fill&fm=jpg` }]
        : undefined,
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const found = await getProject((await params).slug)
  if (!found) notFound()
  const { project, tils, newer, older } = found
  const html = await renderWriteUp(project.body)

  return (
    <>
      <div className={`container ${styles.top}`}>
        <Link href="/projects/" className={styles.back}>
          ← All projects
        </Link>
        <p className={styles.meta}>
          <ProjectStatus status={project.status} />
          <span>
            started <time dateTime={project.started}>{formatMonth(project.started)}</time> · updated{' '}
            <time dateTime={project.updated}>{formatMonth(project.updated)}</time>
          </span>
        </p>
        <h1 className={`page-title ${styles.title}`}>{project.title}</h1>
        <p className={styles.lead}>{project.summary}</p>

        <dl className={styles.facts}>
          {project.stack.length > 0 && (
            <div>
              <dt>stack</dt>
              <dd>{project.stack.join(' · ')}</dd>
            </div>
          )}
          {project.timeSpent && (
            <div>
              <dt>time spent</dt>
              <dd>{project.timeSpent}</dd>
            </div>
          )}
          {(project.codeUrl || project.demoUrl) && (
            <div>
              <dt>links</dt>
              <dd>
                {project.codeUrl && <ExternalLink href={project.codeUrl}>Code ↗</ExternalLink>}
                {project.codeUrl && project.demoUrl && ' · '}
                {project.demoUrl && <ExternalLink href={project.demoUrl}>Demo ↗</ExternalLink>}
              </dd>
            </div>
          )}
        </dl>

        {project.cover && (
          <img
            className={styles.hero}
            src={`${project.cover.url}?w=2240&h=980&fit=fill&fm=webp`}
            alt={project.cover.alt}
            width={1120}
            height={490}
            decoding="async"
          />
        )}
      </div>

      <div className={`article ${styles.bottom}`}>
        <article className={`prose ${styles.writeup}`} dangerouslySetInnerHTML={{ __html: html }} />

        {tils.length > 0 && (
          <section aria-labelledby="project-tils" className={styles.tils}>
            <h2 id="project-tils">TILs from this project</h2>
            <ol>
              {tils.map((til) => (
                <li key={til.slug}>
                  <Link href={`/til/${til.slug}/`}>
                    <time dateTime={til.date}>{til.date}</time>
                    <span>{til.title}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        {(older || newer) && (
          <nav aria-label="More projects" className={styles.pager}>
            {older ? (
              <Link href={`/projects/${older.slug}/`} rel="prev" className={styles.prev}>
                <span className={styles.pagerLabel}>← previous project</span>
                <span className={styles.pagerTitle}>{older.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {newer && (
              <Link href={`/projects/${newer.slug}/`} rel="next" className={styles.next}>
                <span className={styles.pagerLabel}>next project →</span>
                <span className={styles.pagerTitle}>{newer.title}</span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </>
  )
}
