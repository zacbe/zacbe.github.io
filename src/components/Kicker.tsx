import styles from './Kicker.module.css'

/** Terminal-style kicker above a page title, e.g. `> ls ./til`. */
export function Kicker({ command }: { command: string }) {
  return (
    <p className={styles.kicker}>
      <span className={styles.prompt} aria-hidden="true">
        &gt;
      </span>{' '}
      {command}
    </p>
  )
}
