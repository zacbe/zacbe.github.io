import type { SiteSettings } from '@/lib/types'
import { formatLongMonth } from '@/lib/format'
import styles from './NowBox.module.css'

/** The "Now" card: what I'm building, learning and reading. Hidden when all are empty. */
export function NowBox({ now }: { now: SiteSettings['now'] }) {
  const rows = [
    ['building', now.building],
    ['learning', now.learning],
    ['reading', now.reading],
  ].filter((row): row is [string, string] => Boolean(row[1]))
  if (rows.length === 0) return null

  return (
    <aside aria-labelledby="now-heading" className={styles.box}>
      <div className={styles.head}>
        <h2 id="now-heading" className={styles.title}>
          Now
        </h2>
        {now.updated && (
          <span className={styles.updated}>
            updated <time dateTime={now.updated}>{formatLongMonth(now.updated)}</time>
          </span>
        )}
      </div>
      <dl className={styles.list}>
        {rows.map(([term, value]) => (
          <div key={term} className={styles.row}>
            <dt className={styles.term}>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}
