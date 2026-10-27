import Link from 'next/link'
import type { Til } from '@/lib/types'
import styles from './TilList.module.css'

type Props = {
  tils: Til[]
  /** Show each entry's one-sentence summary under the title (the archive does; home doesn't). */
  showSummary?: boolean
}

/** TIL rows: date · title · (summary) · tags. Each whole row is one link. */
export function TilList({ tils, showSummary = false }: Props) {
  return (
    <ol className={styles.list}>
      {tils.map((til) => (
        <li key={til.slug} className={styles.item}>
          <Link href={`/til/${til.slug}/`} className={styles.row}>
            <time dateTime={til.date} className={styles.date}>
              {til.date}
            </time>
            <span className={styles.main}>
              <span className={styles.title}>{til.title}</span>
              {showSummary && <span className={styles.summary}>{til.summary}</span>}
            </span>
            {til.tags.length > 0 && (
              <span className={styles.tags}>
                {til.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ol>
  )
}
