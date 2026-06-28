import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-clay-ink text-white hover:bg-clay-ink/90 rounded-clay-md",
        destructive:
          "bg-clay-error text-white hover:bg-clay-error/90 focus-visible:ring-clay-error/20 rounded-clay-md",
        outline:
          "border bg-clay-canvas shadow-xs hover:bg-clay-surface-soft hover:text-clay-ink border-clay-hairline rounded-clay-md",
        secondary:
          "bg-clay-surface-card text-clay-ink hover:bg-clay-surface-strong rounded-clay-md",
        ghost:
          "hover:bg-clay-surface-soft hover:text-clay-ink rounded-clay-md",
        link: "text-clay-ink underline-offset-4 hover:underline",
        "on-color": "bg-white text-clay-ink hover:bg-white/90 rounded-clay-md",
      },
      size: {
        default: "h-11 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-9 rounded-clay-sm gap-1.5 px-3.5 has-[>svg]:px-3",
        lg: "h-12 rounded-clay-md px-7 has-[>svg]:px-5",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
