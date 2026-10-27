import type { AnchorHTMLAttributes } from 'react'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target'> & { href: string }

/** A link to another site. Opens in a new tab and says so to screen readers. */
export function ExternalLink({ rel, children, ...props }: Props) {
  return (
    <a {...props} target="_blank" rel={['noopener', 'noreferrer', rel].filter(Boolean).join(' ')}>
      {children}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  )
}
