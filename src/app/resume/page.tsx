import { ExternalLink } from '@/components/ExternalLink'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Kicker } from '@/components/Kicker'
import { getResumePage, getResumePdf, getSiteSettings } from '@/lib/content'
import { formatMonth } from '@/lib/format'
import { parseResume } from '@/lib/resume'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'A short web resume, with a PDF to download.',
}

const PDF_HREF = '/zacbe-resume.pdf'

/** "https://github.com/zacbe/" → "github.com/zacbe" */
const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19.5h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default async function ResumePage() {
  const [site, page, pdf] = await Promise.all([getSiteSettings(), getResumePage(), getResumePdf()])
  const resume = parseResume(page.markdown)

  return (
    <>
      <div className={`container ${styles.main}`}>
        <div className={styles.header}>
          <div>
            <Kicker command="cat ./resume.md" />
            <h1 className={`page-title ${styles.name}`}>{site.name}</h1>
            <p className={styles.role}>
              {site.role}
              {site.location && ` · ${site.location}`}
            </p>
          </div>
          <div className={styles.download}>
            <a className={`btn btn-primary ${styles.downloadButton}`} href={PDF_HREF} download>
              <DownloadIcon />
              Download PDF
            </a>
            <span className="mono-meta">
              {pdf.pages} {pdf.pages === 1 ? 'page' : 'pages'} · updated{' '}
              <time dateTime={page.updated}>{formatMonth(page.updated)}</time>
            </span>
          </div>
        </div>

        <section aria-label="Summary" className={styles.summary}>
          <div className={styles.summaryText}>
            {resume.summary.map((paragraph, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: paragraph }} />
            ))}
          </div>
          <ul className={styles.contacts}>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            {site.githubUrl && (
              <li>
                <ExternalLink href={site.githubUrl} rel="me">
                  {displayUrl(site.githubUrl)}
                </ExternalLink>
              </li>
            )}
            {site.linkedinUrl && (
              <li>
                <ExternalLink href={site.linkedinUrl} rel="me">
                  {displayUrl(site.linkedinUrl)}
                </ExternalLink>
              </li>
            )}
          </ul>
        </section>

        <div className={styles.columns}>
          <section aria-labelledby="experience-heading" className={styles.experience}>
            <h2 id="experience-heading" className={styles.sectionTitle}>
              Experience
            </h2>
            <ol className={styles.roles}>
              {resume.roles.map((role, i) => (
                <li key={i}>
                  <div className={styles.roleHead}>
                    <h3 className={styles.roleTitle}>
                      {role.title} · {role.company}
                    </h3>
                    <span className={styles.dates}>{role.dates}</span>
                  </div>
                  {role.subline && <p className={styles.subline}>{role.subline}</p>}
                  {role.highlights.length > 0 && (
                    <ul className={styles.highlights}>
                      {role.highlights.map((item, j) => (
                        <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
                      ))}
                    </ul>
                  )}
                  {role.stack.length > 0 && (
                    <p className={styles.stack}>{role.stack.join(' · ')}</p>
                  )}
                </li>
              ))}
            </ol>
            {resume.extra && (
              <div
                className={`prose ${styles.extra}`}
                dangerouslySetInnerHTML={{ __html: resume.extra }}
              />
            )}
          </section>

          <aside className={styles.aside}>
            {resume.skills.length > 0 && (
              <section aria-labelledby="skills-heading" className={styles.box}>
                <h2 id="skills-heading" className={styles.boxTitle}>
                  Skills
                </h2>
                <ul className={styles.skills}>
                  {resume.skills.map((skill) => (
                    <li key={skill} className="chip">
                      {skill}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {resume.sidebar.map((box, i) => (
              <section key={box.title} aria-labelledby={`sidebar-${i}`} className={styles.box}>
                <h2 id={`sidebar-${i}`} className={styles.boxTitle}>
                  {box.title}
                </h2>
                {box.kind === 'pairs' ? (
                  <ul className={styles.pairs}>
                    {box.pairs.map((pair) => (
                      <li key={pair.name}>
                        <span>{pair.name}</span>
                        <span className={styles.level}>{pair.level}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  box.lines.map((line, j) => (
                    <p key={j} className={j === 0 ? styles.firstLine : styles.line}>
                      {line}
                    </p>
                  ))
                )}
              </section>
            ))}
            <Link href="/projects/" className={styles.outside}>
              <span className={styles.outsideLabel}>outside work</span>
              <span className={styles.outsideText}>See my weekend projects and TILs →</span>
            </Link>
          </aside>
        </div>
      </div>

      <section aria-label="Download" className={styles.band}>
        <div className={`container ${styles.bandInner}`}>
          <p className={styles.bandTitle}>Need it for an application?</p>
          <div className={styles.bandActions}>
            <a className={`btn ${styles.bandPrimary}`} href={PDF_HREF} download>
              Download PDF
            </a>
            <a className={`btn ${styles.bandSecondary}`} href={`mailto:${site.email}`}>
              Email me
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
