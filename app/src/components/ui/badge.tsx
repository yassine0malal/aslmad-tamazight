import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-clay-pill border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-clay-error/20 aria-invalid:border-clay-error transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-clay-ink text-white [a&]:hover:bg-clay-ink/90",
        secondary:
          "border-transparent bg-clay-surface-card text-clay-ink [a&]:hover:bg-clay-surface-strong",
        destructive:
          "border-transparent bg-clay-error text-white [a&]:hover:bg-clay-error/90 focus-visible:ring-clay-error/20",
        outline:
          "text-clay-ink border-clay-hairline [a&]:hover:bg-clay-surface-soft [a&]:hover:text-clay-ink",
        "brand-pink": "border-transparent bg-clay-pink text-white",
        "brand-teal": "border-transparent bg-clay-teal text-white",
        "brand-lavender": "border-transparent bg-clay-lavender text-clay-ink",
        "brand-peach": "border-transparent bg-clay-peach text-clay-ink",
        "brand-ochre": "border-transparent bg-clay-ochre text-clay-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
