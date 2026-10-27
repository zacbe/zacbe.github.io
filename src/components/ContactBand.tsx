import { ExternalLink } from '@/components/ExternalLink'
import type { SiteSettings } from '@/lib/types'
import styles from './ContactBand.module.css'

/** Dark contact band at the bottom of the home page. */
export function ContactBand({ site }: { site: SiteSettings }) {
  return (
    <section id="contact" aria-labelledby="contact-heading" className={styles.band}>
      <div className={`container ${styles.inner}`}>
        <div>
          <p className={styles.kicker}>
            <span className={styles.prompt} aria-hidden="true">
              &gt;
            </span>{' '}
            contact --open
          </p>
          <h2 id="contact-heading" className={styles.title}>
            Learned something from a post? Tell me.
          </h2>
        </div>
        <ul className={styles.actions}>
          <li>
            <a className={`btn ${styles.primary}`} href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </li>
          {site.githubUrl && (
            <li>
              <ExternalLink className={`btn ${styles.secondary}`} href={site.githubUrl} rel="me">
                GitHub
              </ExternalLink>
            </li>
          )}
          {site.linkedinUrl && (
            <li>
              <ExternalLink className={`btn ${styles.secondary}`} href={site.linkedinUrl} rel="me">
                LinkedIn
              </ExternalLink>
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}
