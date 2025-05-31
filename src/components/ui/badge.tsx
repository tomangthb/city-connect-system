
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-green-600 text-white hover:bg-green-700 shadow-sm",
        secondary:
          "border-transparent bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700 shadow-sm",
        outline: "text-foreground border-border hover:bg-accent",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600 shadow-sm",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm",
        info: "border-transparent bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50",
        pending: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm",
        overdue: "border-transparent bg-red-500 text-white hover:bg-red-600 shadow-sm",
        paid: "border-transparent bg-green-500 text-white hover:bg-green-600 shadow-sm",
        completed: "border-transparent bg-green-500 text-white hover:bg-green-600 shadow-sm",
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
