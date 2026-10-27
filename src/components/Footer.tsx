import Link from 'next/link'
import { NAV_LINKS } from './nav'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span>© {new Date().getFullYear()} Zacbé</span>
        <nav aria-label="Footer">
          <ul className={styles.links}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
