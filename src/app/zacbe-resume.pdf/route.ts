// Copies the resume PDF from Contentful into the static export as /zacbe-resume.pdf, so the
// download link is same-origin (browsers ignore `download` on cross-origin links).
import { getResume } from '@/lib/content'

export const dynamic = 'force-static'

export async function GET() {
  const { pdfUrl } = await getResume()
  const response = await fetch(pdfUrl)
  if (!response.ok) throw new Error(`Couldn't download the resume PDF: HTTP ${response.status}`)
  return new Response(await response.arrayBuffer(), {
    headers: { 'Content-Type': 'application/pdf' },
  })
}
