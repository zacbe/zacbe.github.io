'use client'

// A client component only so it can read the current path for aria-current. It is
// prerendered to HTML at build time, so the nav works and is correct without JS.
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './Logo'
import { NAV_LINKS } from './nav'
import styles from './Header.module.css'

export function Header() {
  const pathname = usePathname()

  return (
    <header className={styles.bar}>
      <div className={`container ${styles.header}`}>
        <Logo />
        <nav aria-label="Main">
          <ul className={styles.links}>
            {NAV_LINKS.map(({ href, label }) => {
              const current = pathname === href || pathname.startsWith(href)
              const isResume = href === '/resume/'
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={current ? 'page' : undefined}
                    className={isResume ? styles.pill : styles.link}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
