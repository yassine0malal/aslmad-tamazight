import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-clay-hairline placeholder:text-clay-muted-soft focus-visible:border-clay-ink focus-visible:ring-clay-ink/50 aria-invalid:ring-clay-error/20 aria-invalid:border-clay-error flex field-sizing-content min-h-16 w-full rounded-clay-md border bg-clay-canvas px-4 py-3 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
