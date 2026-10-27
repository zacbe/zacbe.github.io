import type { Metadata } from 'next'
import { ExternalLink } from '@/components/ExternalLink'
import { Kicker } from '@/components/Kicker'
import { getUsesPage } from '@/lib/content'
import { formatMonth } from '@/lib/format'
import styles from './uses.module.css'

export const metadata: Metadata = {
  title: 'Uses',
  description: 'The tools, setup and hardware I use day to day — and why I picked them.',
  alternates: { canonical: '/uses/' },
}

export default async function UsesPage() {
  const uses = await getUsesPage()
  const groups = uses.groups.filter((group) => group.items.length > 0)

  const terminal = uses.favoriteCommand && (
    <pre className={styles.terminal}>
      <span className={styles.prompt}>~ $</span> {uses.favoriteCommand}
      {uses.favoriteCommandNote && (
        <>
          {'\n'}
          <span className={styles.comment}># {uses.favoriteCommandNote}</span>
        </>
      )}
    </pre>
  )

  return (
    <div className={`container ${styles.page}`}>
      <Kicker command="cat ./uses.md" />
      <h1 className={`page-title ${styles.title}`}>Uses</h1>
      <p className={styles.lead}>
        The tools, setup and hardware I use day to day — and why I picked them.
      </p>
      <p className={styles.meta}>
        <span>
          last updated <time dateTime={uses.lastUpdated}>{formatMonth(uses.lastUpdated)}</time>
        </span>
        {uses.dotfilesUrl && (
          <ExternalLink href={uses.dotfilesUrl} className={styles.dotfiles}>
            my dotfiles ↗
          </ExternalLink>
        )}
      </p>

      {groups.length === 0 ? (
        <>
          {terminal}
          <p className={styles.empty}>Nothing listed yet.</p>
        </>
      ) : (
        <div className={styles.groups}>
          {groups.map((group, i) => (
            <section key={group.title} aria-labelledby={`uses-${i}`} className={styles.group}>
              <h2 id={`uses-${i}`} className={styles.groupTitle}>
                {group.title}
              </h2>
              <div className={styles.groupBody}>
                <ul className={styles.items}>
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <strong className={styles.name}>
                        {item.url ? (
                          <ExternalLink href={item.url}>{item.name}</ExternalLink>
                        ) : (
                          item.name
                        )}
                      </strong>
                      <span className={styles.why}>{item.why}</span>
                    </li>
                  ))}
                </ul>
                {/* The favourite command sits under the first group, as in the mockup. */}
                {i === 0 && terminal}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
