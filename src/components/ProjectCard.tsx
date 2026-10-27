import Link from 'next/link'
import type { Project } from '@/lib/types'
import { formatMonth } from '@/lib/format'
import styles from './ProjectCard.module.css'

type Props = {
  project: Project
  tilCount: number
  /** Heading level: h3 under a section h2 (default), h2 when the card stands alone. */
  headingLevel?: 'h2' | 'h3'
}

export function ProjectCard({ project, tilCount, headingLevel: Heading = 'h3' }: Props) {
  const href = `/projects/${project.slug}/`
  return (
    <article className={styles.card}>
      {project.cover && (
        // Cover is decorative here; the write-up shows it with its alt text.
        <img
          className={styles.cover}
          src={`${project.cover.url}?w=720&h=280&fit=fill&fm=webp`}
          alt=""
          width={360}
          height={140}
          loading="lazy"
          decoding="async"
        />
      )}
      <Heading className={styles.title}>
        <Link href={href}>{project.title}</Link>
      </Heading>
      <p className={styles.summary}>{project.summary}</p>
      {project.stack.length > 0 && <p className={styles.stack}>{project.stack.join(' · ')}</p>}
      <div className={styles.footer}>
        <Link href={href} className={styles.more} aria-hidden="true" tabIndex={-1}>
          Read write-up →
        </Link>
        <span className={styles.meta}>
          {tilCount} {tilCount === 1 ? 'TIL' : 'TILs'} · upd.{' '}
          <time dateTime={project.updated}>{formatMonth(project.updated)}</time>
        </span>
      </div>
    </article>
  )
}
