import * as React from "react"

import { cn } from "@/lib/utils"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gov-border bg-gov-surface px-3 py-2 font-body text-body text-gov-text-main ring-offset-gov-surface file:border-0 file:bg-transparent file:font-label file:text-label placeholder:text-gov-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
