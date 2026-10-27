import type { TilSummary } from '@/lib/types'
import { formatLongMonth, monthKey } from '@/lib/format'
import { TilList } from './TilList'
import styles from './TilMonths.module.css'

/** TIL archive rows grouped under month headings, newest first (input is newest first). */
export function TilMonths({ tils }: { tils: TilSummary[] }) {
  const months: { key: string; tils: TilSummary[] }[] = []
  for (const til of tils) {
    const key = monthKey(til.date)
    const last = months.at(-1)
    if (last?.key === key) last.tils.push(til)
    else months.push({ key, tils: [til] })
  }

  return (
    <>
      {months.map(({ key, tils }) => (
        <section key={key} aria-labelledby={`month-${key}`} className={styles.month}>
          <h2 id={`month-${key}`} className={styles.heading}>
            <time dateTime={key}>{formatLongMonth(`${key}-01`)}</time>
          </h2>
          <TilList tils={tils} variant="archive" />
        </section>
      ))}
    </>
  )
}
