import Link from 'next/link'
import styles from './Logo.module.css'

/** The `> ZBē` prompt logo with a blinking block cursor. */
export function Logo() {
  return (
    <Link href="/" className={styles.logo} aria-label="ZBē, home">
      <span className={styles.prompt} aria-hidden="true">
        &gt;
      </span>{' '}
      <span aria-hidden="true">ZBē</span>
      <span className={styles.cursor} aria-hidden="true" />
    </Link>
  )
}
