import Link from 'next/link'
import { Kicker } from '@/components/Kicker'

export default function NotFound() {
  return (
    <div className="container section">
      <Kicker command="cd ./404" />
      <h1 className="page-title">Not found</h1>
      <p className="lead" style={{ marginTop: 24 }}>
        That page doesn’t exist. <Link href="/">Go home</Link>.
      </p>
    </div>
  )
}
