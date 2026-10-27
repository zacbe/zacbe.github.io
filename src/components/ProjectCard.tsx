import Link from 'next/link'
import type { ProjectSummary } from '@/lib/types'
import { formatMonth } from '@/lib/format'
import { ProjectStatus } from './ProjectStatus'
import styles from './ProjectCard.module.css'

type Props = {
  project: ProjectSummary
  tilCount: number
  /**
   * `home`: cover image, no status. `grid` (/projects): status chip, no image.
   */
  variant?: 'home' | 'grid'
  /** Heading level: h3 under a section h2 (default), h2 when the card stands alone. */
  headingLevel?: 'h2' | 'h3'
}

export function ProjectCard({
  project,
  tilCount,
  variant = 'home',
  headingLevel: Heading = 'h3',
}: Props) {
  const href = `/projects/${project.slug}/`
  const grid = variant === 'grid'
  return (
    <article className={`${styles.card} ${grid ? styles.grid : ''}`}>
      {!grid && project.cover && (
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
      {grid && (
        <p>
          <ProjectStatus status={project.status} />
        </p>
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
          {tilCount} {tilCount === 1 ? 'TIL' : 'TILs'} · {grid ? '' : 'upd. '}
          <time dateTime={project.updated}>{formatMonth(project.updated)}</time>
        </span>
      </div>
    </article>
  )
}
