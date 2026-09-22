import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex size-9 items-center justify-center rounded-lg outline-taupe-400 outline-offset-2 hover:bg-taupe-800 focus-visible:outline-2 active:bg-taupe-950 *:[svg]:size-6",
  {
    variants: {
      variant: {
        ghost: "bg-transparent text-taupe-900",
        solid: "bg-taupe-900 text-taupe-50",
      },
    },
    defaultVariants: { variant: "solid" },
  },
);

export function Button({
  className,
  variant,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}
