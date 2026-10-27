import type { ProjectStatus as Status } from '@/lib/types'
import styles from './ProjectStatus.module.css'

const LABELS: Record<Status, string> = {
  'in-progress': 'in progress',
  shipped: 'shipped',
  archived: 'archived',
}

/** Status chip: `● in progress` (soft accent), `shipped` (ink), `archived` (outline). */
export function ProjectStatus({ status }: { status: Status }) {
  return (
    <span className={`${styles.status} ${styles[status]}`}>
      {status === 'in-progress' && <span aria-hidden="true">● </span>}
      {LABELS[status]}
    </span>
  )
}

export const STATUS_LABELS = LABELS
