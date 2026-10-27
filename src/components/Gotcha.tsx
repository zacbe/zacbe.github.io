import styles from './Gotcha.module.css'

/** The "gotcha" callout at the end of a TIL. `html` is rendered Markdown. */
export function Gotcha({ html }: { html: string }) {
  return (
    <aside className={styles.gotcha} aria-label="Gotcha">
      <p className={styles.label} aria-hidden="true">
        gotcha
      </p>
      <div className={styles.body} dangerouslySetInnerHTML={{ __html: html }} />
    </aside>
  )
}
