// Copies the resume PDF from Contentful into the static export as /zacbe-resume.pdf, so the
// download link is same-origin (browsers ignore `download` on cross-origin links).
import { getResumePdf } from '@/lib/content'

export const dynamic = 'force-static'

export async function GET() {
  const { bytes } = await getResumePdf()
  return new Response(bytes, { headers: { 'Content-Type': 'application/pdf' } })
}
