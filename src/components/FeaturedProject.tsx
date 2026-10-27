import Link from 'next/link'
import type { ProjectSummary } from '@/lib/types'
import { formatMonth } from '@/lib/format'
import { ExternalLink } from './ExternalLink'
import { ProjectStatus } from './ProjectStatus'
import styles from './FeaturedProject.module.css'

/** The large featured-project card at the top of /projects. */
export function FeaturedProject({
  project,
  tilCount,
}: {
  project: ProjectSummary
  tilCount: number
}) {
  const href = `/projects/${project.slug}/`
  return (
    <article className={`${styles.card} ${project.cover ? '' : styles.noCover}`}>
      {project.cover && (
        <img
          className={styles.cover}
          src={`${project.cover.url}?w=1040&h=650&fit=fill&fm=webp`}
          alt={project.cover.alt}
          width={520}
          height={325}
          decoding="async"
        />
      )}
      <div className={styles.body}>
        <p className={styles.badges}>
          <ProjectStatus status={project.status} />
          <span className={styles.featured}>featured</span>
        </p>
        <h2 className={styles.title}>
          <Link href={href}>{project.title}</Link>
        </h2>
        <p className={styles.summary}>{project.summary}</p>
        {project.stack.length > 0 && <p className={styles.stack}>{project.stack.join(' · ')}</p>}
        <div className={styles.actions}>
          <Link href={href} className="btn btn-primary">
            Read write-up
          </Link>
          {project.codeUrl && (
            <ExternalLink href={project.codeUrl} className={styles.code}>
              Code ↗
            </ExternalLink>
          )}
          <span className={styles.meta}>
            {tilCount} {tilCount === 1 ? 'TIL' : 'TILs'} · upd.{' '}
            <time dateTime={project.updated}>{formatMonth(project.updated)}</time>
          </span>
        </div>
      </div>
    </article>
  )
}
