import type { Metadata } from 'next'
import Link from 'next/link'
import { Kicker } from '@/components/Kicker'
import { getProjects } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Weekend projects and what I learned building them.',
}

// TODO(design): build from handoff/design/projects.html (featured card, grid, status filter,
// next-up card).
export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container section">
      <Kicker command="ls ./projects" />
      <h1 className="page-title">Projects</h1>
      <ul>
        {projects.map((p) => (
          <li key={p.slug}>
            <Link href={`/projects/${p.slug}/`}>{p.title}</Link> — {p.summary}
          </li>
        ))}
      </ul>
    </div>
  )
}
