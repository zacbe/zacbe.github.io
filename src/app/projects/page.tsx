import type { Metadata } from 'next'
import { Kicker } from '@/components/Kicker'
import { ProjectsBrowser } from '@/components/ProjectsBrowser'
import { getProjects, getSiteSettings, getTilCounts } from '@/lib/content'
import { toProjectSummary } from '@/lib/types'
import styles from './projects.module.css'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Weekend projects and what I learned building them.',
  alternates: { canonical: '/projects/' },
}

export default async function ProjectsPage() {
  const [projects, site, tilCounts] = await Promise.all([
    getProjects(),
    getSiteSettings(),
    getTilCounts(),
  ])
  // Projects are sorted by `updated`, newest first: the top card is the most recently
  // updated featured project; the rest follow in order.
  const featured = projects.find((p) => p.featured)
  const others = projects.filter((p) => p !== featured)

  return (
    <div className={`container ${styles.page}`}>
      <Kicker command="ls ./projects" />
      <h1 className={`page-title ${styles.title}`}>Weekend projects</h1>
      <p className={styles.lead}>
        Things I built to learn something. Each one has a write-up: why I built it, how it works,
        what was hard, and what I’d do differently.
      </p>
      {projects.length > 0 || site.nextUp.length > 0 ? (
        <ProjectsBrowser
          featured={featured && toProjectSummary(featured)}
          others={others.map(toProjectSummary)}
          tilCounts={Object.fromEntries(tilCounts)}
          nextUp={site.nextUp}
        />
      ) : (
        <p className={styles.empty}>No projects published yet.</p>
      )}
    </div>
  )
}
