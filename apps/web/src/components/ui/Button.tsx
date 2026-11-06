import { mergeProps, useRender } from "@base-ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva("flex flex-row items-center justify-center", {
  variants: {
    variant: {
      solid: "bg-muted-bg text-fg",
      brand: "bg-brand text-fg",
    },
    size: {
      sm: "h-8 gap-2.5 rounded-lg px-3.5 text-sm *:[svg]:-mx-1.5 *:[svg]:size-4",
      md: "h-10 gap-3 rounded-xl px-4 text-md *:[svg]:-mx-1.5 *:[svg]:size-5",
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});

export function Button({
  render,
  className,
  variant,
  size,
  ...props
}: useRender.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return useRender({
    defaultTagName: "button",
    render,
    props: mergeProps(props, {
      type: "button",
      className: cn(buttonVariants({ variant, size }), className),
    }),
  });
}
