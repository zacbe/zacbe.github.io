import Link from 'next/link'
import type { TilSummary } from '@/lib/types'
import styles from './TilList.module.css'

type Props = {
  tils: TilSummary[]
  /**
   * `compact` (home): full date and title. `archive` (/til, grouped by month): day of the
   * month, title, summary, and a "from [project]" chip.
   */
  variant?: 'compact' | 'archive'
}

/** TIL rows: date · title · (summary) · tags. Each whole row is one link. */
export function TilList({ tils, variant = 'compact' }: Props) {
  const archive = variant === 'archive'
  return (
    <ol className={`${styles.list} ${archive ? styles.archive : ''}`}>
      {tils.map((til) => (
        <li key={til.slug} className={styles.item} data-til={til.slug}>
          <Link href={`/til/${til.slug}/`} className={styles.row}>
            <time dateTime={til.date} className={styles.date}>
              {archive ? til.date.slice(8, 10) : til.date}
            </time>
            <span className={styles.main}>
              <span className={styles.title}>{til.title}</span>
              {archive && <span className={styles.summary}>{til.summary}</span>}
            </span>
            {(til.tags.length > 0 || (archive && til.project)) && (
              <span className={styles.tags}>
                {til.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
                {archive && til.project && (
                  <span className="chip chip-project">from {til.project.title}</span>
                )}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ol>
  )
}
