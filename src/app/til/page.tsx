import type { Metadata } from 'next'
import Link from 'next/link'
import { Kicker } from '@/components/Kicker'
import { getTils } from '@/lib/content'
import { formatDay } from '@/lib/format'

export const metadata: Metadata = {
  title: 'TIL',
  description: 'Short notes on things I learned while building software.',
}

// TODO(design): build from handoff/design/til.html (month groups, tag filter, search).
export default async function TilArchivePage() {
  const tils = await getTils()

  return (
    <div className="container section">
      <Kicker command="ls ./til" />
      <h1 className="page-title">Today I learned</h1>
      <ul>
        {tils.map((til) => (
          <li key={til.slug}>
            <span className="mono-meta">{formatDay(til.date)}</span>{' '}
            <Link href={`/til/${til.slug}/`}>{til.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
