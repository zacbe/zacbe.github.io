import styles from './StatusPill.module.css'

/** Availability pill on the home intro, driven by siteSettings.openToWork. */
export function StatusPill({ openToWork }: { openToWork: boolean }) {
  return (
    <p className={`${styles.pill} ${openToWork ? '' : styles.idle}`}>
      <span className={styles.dot} aria-hidden="true" />
      {openToWork ? 'Open to work' : 'Not looking right now'}
    </p>
  )
}
