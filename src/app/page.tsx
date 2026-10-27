import Link from 'next/link'
import { getProjects, getSiteSettings, getTils } from '@/lib/content'
import { formatDay } from '@/lib/format'

// TODO(design): build from handoff/design/home.html (intro, Now box, latest TILs, featured
// projects, contact band).
export default async function HomePage() {
  const [site, tils, projects] = await Promise.all([getSiteSettings(), getTils(), getProjects()])
  const latest = tils.slice(0, 5)
  const featured = projects.filter((p) => p.featured).slice(0, 3)

  return (
    <div className="container section">
      <h1 className="page-title">{site.name}</h1>
      <p className="lead">{site.role}</p>

      <h2>Latest TILs</h2>
      <ul>
        {latest.map((til) => (
          <li key={til.slug}>
            <span className="mono-meta">{formatDay(til.date)}</span>{' '}
            <Link href={`/til/${til.slug}/`}>{til.title}</Link>
          </li>
        ))}
      </ul>

      <h2>Projects</h2>
      <ul>
        {featured.map((p) => (
          <li key={p.slug}>
            <Link href={`/projects/${p.slug}/`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
