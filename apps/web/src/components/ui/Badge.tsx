import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex h-8 items-center rounded-lg px-3 text-center text-xs text-fg",
  {
    variants: {
      variant: {
        surface: "bg-surface",
        brand: "bg-brand",
      },
    },
    defaultVariants: {
      variant: "surface",
    },
  },
);

export function Badge({
  variant,
  className,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
