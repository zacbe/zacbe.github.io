import Link from 'next/link'
import styles from './SectionHeading.module.css'

type Props = {
  id: string
  title: string
  description?: string
  link?: { href: string; label: string }
}

/** Section title with an optional one-line description and an "All … →" link. */
export function SectionHeading({ id, title, description, link }: Props) {
  return (
    <div className={styles.heading}>
      <div>
        <h2 id={id} className={styles.title}>
          {title}
        </h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {link && (
        <Link href={link.href} className={styles.link}>
          {link.label} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  )
}
