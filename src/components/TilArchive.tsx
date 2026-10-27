'use client'

// Search and tag filter for /til. The full list is prerendered, so every entry is listed
// without JavaScript; the controls stay hidden until this component hydrates.
import { useEffect, useId, useState } from 'react'
import type { TilSummary } from '@/lib/types'
import { TilMonths } from './TilMonths'
import styles from './TilArchive.module.css'

type Props = {
  tils: TilSummary[]
  tags: string[]
}

const matches = (til: TilSummary, query: string) =>
  [til.title, til.summary, ...til.tags, til.project?.title ?? '']
    .join(' ')
    .toLowerCase()
    .includes(query)

export function TilArchive({ tils, tags }: Props) {
  const [enhanced, setEnhanced] = useState(false)
  const [tag, setTag] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const searchId = useId()

  // Show the controls, and restore a tag from the URL (?tag=postgres).
  useEffect(() => {
    setEnhanced(true)
    const fromUrl = new URLSearchParams(window.location.search).get('tag')
    if (fromUrl && tags.includes(fromUrl)) setTag(fromUrl)
  }, [tags])

  function selectTag(next: string | null) {
    setTag(next)
    const url = new URL(window.location.href)
    if (next) url.searchParams.set('tag', next)
    else url.searchParams.delete('tag')
    window.history.replaceState(null, '', url)
  }

  const q = query.trim().toLowerCase()
  const visible = tils.filter((til) => (!tag || til.tags.includes(tag)) && (!q || matches(til, q)))
  const filtered = Boolean(tag || q)

  return (
    <>
      <div className={styles.controls} hidden={!enhanced}>
        <div className={styles.search}>
          <label htmlFor={searchId}>Search entries</label>
          <input
            id={searchId}
            type="search"
            placeholder="e.g. indexes, retries, docker…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
        </div>
        {tags.length > 0 && (
          <div role="group" aria-label="Filter by tag" className={styles.tags}>
            <button type="button" aria-pressed={tag === null} onClick={() => selectTag(null)}>
              all
            </button>
            {tags.map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={tag === name}
                onClick={() => selectTag(tag === name ? null : name)}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      <p role="status" className={filtered ? styles.status : 'visually-hidden'}>
        {filtered
          ? `${visible.length} of ${tils.length} ${tils.length === 1 ? 'entry' : 'entries'}`
          : ''}
      </p>

      {visible.length > 0 ? (
        <TilMonths tils={visible} />
      ) : (
        <p className={styles.empty}>
          No entries match.{' '}
          <button
            type="button"
            className={styles.reset}
            onClick={() => {
              setQuery('')
              selectTag(null)
            }}
          >
            Clear filters
          </button>
        </p>
      )}
    </>
  )
}
