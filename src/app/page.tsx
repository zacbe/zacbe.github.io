import Link from 'next/link'
import { ContactBand } from '@/components/ContactBand'
import { NowBox } from '@/components/NowBox'
import { ProjectCard } from '@/components/ProjectCard'
import { SectionHeading } from '@/components/SectionHeading'
import { StatusPill } from '@/components/StatusPill'
import { TilList } from '@/components/TilList'
import { getProjects, getSiteSettings, getTilCounts, getTils } from '@/lib/content'
import styles from './page.module.css'

export default async function HomePage() {
  const [site, tils, projects, tilCounts] = await Promise.all([
    getSiteSettings(),
    getTils(),
    getProjects(),
    getTilCounts(),
  ])
  const latestTils = tils.slice(0, 5)
  const featured = projects.filter((p) => p.featured).slice(0, 3)

  return (
    <>
      <section aria-labelledby="intro-heading" className={`container ${styles.hero}`}>
        <div>
          <StatusPill openToWork={site.openToWork} />
          <h1 id="intro-heading" className="page-title">
            Hi, I’m Zacbé.
          </h1>
          <p className={`lead ${styles.intro}`}>
            {site.role}
            {site.location && ` in ${site.location}`}.{' '}
            {site.focus
              ? `I build ${site.focus} by day — and on weekends I build small things and write down what I learn.`
              : 'On weekends I build small things and write down what I learn.'}
          </p>
          <div className={styles.actions}>
            <Link href="/resume/" className="btn btn-primary">
              Read my resume
            </Link>
            <a href="#contact" className="btn btn-secondary">
              Get in touch
            </a>
          </div>
        </div>
        <NowBox now={site.now} />
      </section>

      <section aria-labelledby="til-heading" className={`container ${styles.section}`}>
        <SectionHeading
          id="til-heading"
          title="Today I learned"
          description="Short notes on things I figured out, mostly so future me can find them."
          link={{ href: '/til/', label: 'All TILs' }}
        />
        {latestTils.length > 0 ? (
          <TilList tils={latestTils} />
        ) : (
          <p className={styles.empty}>No TILs published yet.</p>
        )}
      </section>

      <section aria-labelledby="projects-heading" className={`container ${styles.projects}`}>
        <SectionHeading
          id="projects-heading"
          title="Weekend projects"
          description="Things I built to learn something — and the write-ups of how they went."
          link={{ href: '/projects/', label: 'All projects' }}
        />
        {featured.length > 0 ? (
          <div className={styles.grid}>
            {featured.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                tilCount={tilCounts.get(project.slug) ?? 0}
              />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No featured projects yet.</p>
        )}
      </section>

      <ContactBand site={site} />
    </>
  )
}
