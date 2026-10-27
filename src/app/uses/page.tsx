import type { Metadata } from 'next'
import { Kicker } from '@/components/Kicker'
import { getUsesPage } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Uses',
  description: 'The tools, apps and hardware I use every day.',
}

// TODO(design): build from handoff/design/uses.html.
export default async function UsesPage() {
  const uses = await getUsesPage()

  return (
    <div className="container section">
      <Kicker command="cat ./uses.md" />
      <h1 className="page-title">Uses</h1>
      {uses.groups.map((group) => (
        <section key={group.title}>
          <h2>{group.title}</h2>
          <ul>
            {group.items.map((item) => (
              <li key={item.name}>
                <strong>{item.name}</strong> {item.why}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
