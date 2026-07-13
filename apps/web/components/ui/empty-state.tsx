import * as React from "react"
import { cn } from "@/lib/utils"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gov-border bg-gov-surface/50 p-8 text-center animate-in fade-in-50",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mx-auto mb-md flex h-20 w-20 items-center justify-center rounded-full bg-gov-surface shadow-elevation-resting text-gov-text-muted">
          {icon}
        </div>
      )}
      <h3 className="font-h3 text-h3 text-gov-text-main mb-xs">{title}</h3>
      {description && (
        <p className="font-body text-body text-gov-text-muted max-w-md mx-auto mb-lg">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
