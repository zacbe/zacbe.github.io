import type { Metadata } from 'next'
import { Kicker } from '@/components/Kicker'
import { getResume, getSiteSettings } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'A short web resume, with a PDF to download.',
}

// TODO(design): build from handoff/design/resume.html.
export default async function ResumePage() {
  const [site, resume] = await Promise.all([getSiteSettings(), getResume()])

  return (
    <div className="container section">
      <Kicker command="cat ./resume.md" />
      <h1 className="page-title">{site.name}</h1>
      <p className="lead">{resume.summary}</p>
      <a className="btn btn-primary" href="/zacbe-resume.pdf" download>
        Download PDF
      </a>
    </div>
  )
}
