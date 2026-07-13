import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-label font-label transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gov-primary text-gov-surface hover:bg-gov-primary/80",
        secondary:
          "border-transparent bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80",
        destructive:
          "border-transparent bg-error text-on-error hover:bg-error/80",
        success:
          "border-transparent bg-success text-white hover:bg-success/80",
        outline: "text-gov-text-main border-gov-border",
        ai: "border-transparent ai-gradient-bg text-ai-surface",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
