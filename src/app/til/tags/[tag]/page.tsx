import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Kicker } from '@/components/Kicker'
import { TilMonths } from '@/components/TilMonths'
import { getTags, getTils } from '@/lib/content'
import { staticParams } from '@/lib/static-params'
import { toTilSummary } from '@/lib/types'
import styles from '../../til.module.css'

type Props = { params: Promise<{ tag: string }> }

export const dynamicParams = false

export async function generateStaticParams() {
  return staticParams(
    'tag',
    (await getTags()).map((t) => t.tag)
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  return {
    title: `TIL #${tag}`,
    description: `Things I learned about ${tag}.`,
    alternates: { canonical: `/til/tags/${tag}/` },
  }
}

export default async function TilTagPage({ params }: Props) {
  const { tag } = await params
  const tils = (await getTils()).filter((t) => t.tags.includes(tag))
  if (tils.length === 0) notFound()

  return (
    <div className={`container ${styles.page}`}>
      <Link href="/til/" className={styles.back}>
        ← All TILs
      </Link>
      <Kicker command={`ls ./til | grep ${tag}`} />
      <h1 className={`page-title ${styles.title}`}>#{tag}</h1>
      <p className={styles.lead}>
        {tils.length} {tils.length === 1 ? 'entry' : 'entries'} tagged “{tag}”.
      </p>
      <div className={styles.rule} />
      <TilMonths tils={tils.map(toTilSummary)} />
    </div>
  )
}
