import { Input as BaseInput } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, createContext, use } from "react";
import { cn } from "@/lib/cn";

export const inputVariants = cva(
  "bg-surface text-fg placeholder:text-placeholder",
  {
    variants: {
      size: {
        sm: "h-8 rounded-xl px-2 text-sm [&_svg]:size-4",
        md: "h-10 rounded-xl px-3 text-md [&_svg]:size-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type InputVariantProps = VariantProps<typeof inputVariants>;

export const InputSizeContext = createContext<InputVariantProps["size"]>("md");

export function useInputSize() {
  return use(InputSizeContext);
}

export function Input({
  className,
  size,
  ...props
}: Omit<ComponentProps<typeof BaseInput>, "size"> & InputVariantProps) {
  return (
    <BaseInput className={cn(inputVariants({ size }), className)} {...props} />
  );
}
