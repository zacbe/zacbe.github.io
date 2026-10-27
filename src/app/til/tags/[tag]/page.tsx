import type { Metadata } from 'next'
import Link from 'next/link'
import { Kicker } from '@/components/Kicker'
import { notFound } from 'next/navigation'
import { getTags, getTils } from '@/lib/content'
import { staticParams } from '@/lib/static-params'
import { formatDay } from '@/lib/format'

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
  return { title: `TIL #${tag}`, description: `Things I learned about ${tag}.` }
}

// TODO(design): reuse the TIL archive list once it is built.
export default async function TilTagPage({ params }: Props) {
  const { tag } = await params
  const tils = (await getTils()).filter((t) => t.tags.includes(tag))
  if (tils.length === 0) notFound()

  return (
    <div className="container section">
      <Kicker command={`ls ./til | grep ${tag}`} />
      <h1 className="page-title">#{tag}</h1>
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
