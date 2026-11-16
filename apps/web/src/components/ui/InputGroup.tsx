import { NumberField } from "@base-ui/react/number-field";
import { cva } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import {
  InputSizeContext,
  type InputVariantProps,
  inputVariants,
  useInputSize,
} from "./Input";

const inputGoupAddonClassname = cva("text-fg", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export function InputGroup({
  className,
  size,
  ...props
}: ComponentProps<"div"> & InputVariantProps) {
  return (
    <InputSizeContext value={size}>
      <div
        className={cn(
          "flex items-center gap-2 has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-fg *:[svg]:text-placeholder",
          inputVariants({ size }),
          className,
        )}
        {...props}
      />
    </InputSizeContext>
  );
}

export function InputGroupInput({
  className,
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-placeholder",
        className,
      )}
      {...props}
    />
  );
}

export function InputGroupNumberInput({
  className,
  ...props
}: ComponentProps<typeof NumberField.Input>) {
  return (
    <NumberField.Input
      inputMode="decimal"
      className={cn(
        "h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-placeholder",
        className,
      )}
      {...props}
    />
  );
}

export function InputGroupAddon({
  className,
  ...props
}: ComponentProps<"span">) {
  const size = useInputSize();

  return (
    <span
      className={cn(inputGoupAddonClassname({ size }), className)}
      {...props}
    />
  );
}
