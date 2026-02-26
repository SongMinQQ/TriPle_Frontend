import type { ReactNode } from "react"
import Link from "next/link"

interface GroupDetailEmptyStateProps {
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
  icon?: ReactNode
}

export function GroupDetailEmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  icon,
}: GroupDetailEmptyStateProps) {
  return (
    <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
      {icon ? <div className="mb-3 inline-flex text-muted-foreground">{icon}</div> : null}
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}
