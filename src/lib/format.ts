// Date helpers. Content dates are ISO days (`YYYY-MM-DD`) and are formatted in UTC so the
// build machine's timezone never shifts a date.

const monthYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})
const longMonthYear = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})
const shortDay = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

const toDate = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`)

/** "Oct 2026" */
export const formatMonth = (iso: string) => monthYear.format(toDate(iso))

/** "October 2026" */
export const formatLongMonth = (iso: string) => longMonthYear.format(toDate(iso))

/** "Oct 27, 2026" */
export const formatDay = (iso: string) => shortDay.format(toDate(iso))

/** "2026-10" — key for grouping entries by month. */
export const monthKey = (iso: string) => iso.slice(0, 7)
