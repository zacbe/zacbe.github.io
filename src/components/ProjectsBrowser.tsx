'use client'

// Status filter for /projects. Everything is prerendered, so all projects are listed without
// JavaScript; the filter buttons stay hidden until this component hydrates.
import { useEffect, useState } from 'react'
import type { Idea, ProjectStatus, ProjectSummary } from '@/lib/types'
import { FeaturedProject } from './FeaturedProject'
import { ProjectCard } from './ProjectCard'
import { STATUS_LABELS } from './ProjectStatus'
import styles from './ProjectsBrowser.module.css'

type Props = {
  featured?: ProjectSummary
  others: ProjectSummary[]
  /** TIL count per project slug. */
  tilCounts: Record<string, number>
  nextUp: Idea[]
}

const STATUSES: ProjectStatus[] = ['in-progress', 'shipped', 'archived']

export function ProjectsBrowser({ featured, others, tilCounts, nextUp }: Props) {
  const [enhanced, setEnhanced] = useState(false)
  const [status, setStatus] = useState<ProjectStatus | null>(null)

  useEffect(() => {
    setEnhanced(true)
    const fromUrl = new URLSearchParams(window.location.search).get('status')
    if (STATUSES.includes(fromUrl as ProjectStatus)) setStatus(fromUrl as ProjectStatus)
  }, [])

  function select(next: ProjectStatus | null) {
    setStatus(next)
    const url = new URL(window.location.href)
    if (next) url.searchParams.set('status', next)
    else url.searchParams.delete('status')
    window.history.replaceState(null, '', url)
  }

  const show = (p: ProjectSummary) => !status || p.status === status
  const visibleOthers = others.filter(show)
  const showFeatured = featured && show(featured)
  const total = others.length + (featured ? 1 : 0)
  const visibleCount = visibleOthers.length + (showFeatured ? 1 : 0)

  return (
    <>
      <div role="group" aria-label="Filter by status" className={styles.filters} hidden={!enhanced}>
        <button type="button" aria-pressed={status === null} onClick={() => select(null)}>
          all
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={status === s}
            onClick={() => select(status === s ? null : s)}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <p role="status" className={status ? styles.status : 'visually-hidden'}>
        {status ? `${visibleCount} of ${total} projects` : ''}
      </p>

      {showFeatured && (
        <FeaturedProject project={featured} tilCount={tilCounts[featured.slug] ?? 0} />
      )}

      {visibleCount === 0 && (
        <p className={styles.empty}>
          No {status && STATUS_LABELS[status]} projects.{' '}
          <button type="button" className={styles.reset} onClick={() => select(null)}>
            Show all
          </button>
        </p>
      )}

      {(visibleOthers.length > 0 || (!status && nextUp.length > 0)) && (
        <div className={styles.grid}>
          {visibleOthers.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              tilCount={tilCounts[project.slug] ?? 0}
              variant="grid"
              headingLevel="h2"
            />
          ))}
          {!status &&
            nextUp.map((idea) => (
              <article key={idea.title} className={styles.idea}>
                <p className={styles.ideaLabel}>next up</p>
                <h2 className={styles.ideaTitle}>{idea.title}</h2>
                <p className={styles.ideaWhy}>{idea.why}</p>
              </article>
            ))}
        </div>
      )}
    </>
  )
}
