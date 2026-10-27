import type { Metadata } from 'next'
import { Kicker } from '@/components/Kicker'
import { TilArchive } from '@/components/TilArchive'
import { getTags, getTils } from '@/lib/content'
import { toTilSummary } from '@/lib/types'
import styles from './til.module.css'

export const metadata: Metadata = {
  title: 'TIL',
  description: 'Short notes on things I learned while building software.',
  alternates: { canonical: '/til/' },
}

export default async function TilArchivePage() {
  const [tils, tags] = await Promise.all([getTils(), getTags()])

  return (
    <div className={`container ${styles.page}`}>
      <Kicker command="ls ./til" />
      <h1 className={`page-title ${styles.title}`}>Today I learned</h1>
      <p className={styles.lead}>
        Short notes on things I figured out while building — usually 2 minutes to read.{' '}
        {tils.length} {tils.length === 1 ? 'entry' : 'entries'} so far.
      </p>
      {tils.length > 0 ? (
        <TilArchive tils={tils.map(toTilSummary)} tags={tags.map((t) => t.tag)} />
      ) : (
        <p className={styles.empty}>No TILs published yet.</p>
      )}
    </div>
  )
}
