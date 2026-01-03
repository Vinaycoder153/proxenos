import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white hover:bg-destructive/90",
        outline:
          "text-foreground border-white/10 bg-white/5 hover:bg-white/10",

        // Priority variants
        priority_high:
          "border-red-500/30 bg-red-500/10 text-red-400 font-mono uppercase text-[10px] tracking-wider hover:bg-red-500/20",
        priority_medium:
          "border-yellow-500/30 bg-yellow-500/10 text-yellow-400 font-mono uppercase text-[10px] tracking-wider hover:bg-yellow-500/20",
        priority_low:
          "border-green-500/30 bg-green-500/10 text-green-400 font-mono uppercase text-[10px] tracking-wider hover:bg-green-500/20",

        // Status variants
        status_pending:
          "border-blue-500/30 bg-blue-500/10 text-blue-400 font-mono uppercase text-[10px] tracking-wider",
        status_completed:
          "border-primary/30 bg-primary/10 text-primary font-mono uppercase text-[10px] tracking-wider",
        status_missed:
          "border-orange-500/30 bg-orange-500/10 text-orange-400 font-mono uppercase text-[10px] tracking-wider",

        // System/Tech variants
        tech:
          "border-primary/20 bg-primary/5 text-primary font-mono uppercase text-[8px] tracking-[0.15em] px-2 h-5",
        tech_outline:
          "border-white/10 bg-transparent text-muted-foreground font-mono uppercase text-[8px] tracking-[0.15em] px-2 h-5 hover:border-primary/30 hover:text-primary",

        // Clean minimal variants
        minimal:
          "border-white/5 bg-white/5 text-muted-foreground text-[10px] font-medium tracking-wide hover:bg-white/10",
        minimal_primary:
          "border-primary/10 bg-primary/5 text-primary text-[10px] font-medium tracking-wide hover:bg-primary/10",
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

