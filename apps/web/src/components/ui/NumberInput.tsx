import { NumberField } from "@base-ui/react/number-field";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { type InputVariantProps, inputVariants } from "./Input";

export function NumberInputRoot(
  props: ComponentProps<typeof NumberField.Root>,
) {
  return <NumberField.Root locale="fr-FR" {...props} />;
}

export function NumberInput({
  className,
  size,
  value,
  onValueChange,
  min,
  max,
  step,
  disabled,
  ...props
}: Omit<ComponentProps<typeof NumberField.Input>, "size" | "value"> &
  InputVariantProps &
  Pick<
    ComponentProps<typeof NumberField.Root>,
    "value" | "onValueChange" | "min" | "max" | "step" | "disabled"
  >) {
  return (
    <NumberInputRoot
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
    >
      <NumberField.Input
        inputMode="decimal"
        className={cn("w-full", inputVariants({ size }), className)}
        {...props}
      />
    </NumberInputRoot>
  );
}
