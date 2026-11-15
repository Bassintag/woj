import { NumberField } from "@base-ui/react/number-field";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

export function Stepper({
  children,
  min = 1,
  ...props
}: NumberField.Root.Props) {
  return (
    <NumberField.Root min={min} {...props}>
      <NumberField.Group className="flex min-w-24 flex-row items-center gap-2 text-sm text-fg">
        {children}
        <NumberField.Input className="sr-only" />
      </NumberField.Group>
    </NumberField.Root>
  );
}

export function StepperDecrement(props: ComponentProps<typeof Button>) {
  return <NumberField.Decrement render={<Button size="sm" {...props} />} />;
}

export function StepperIncrement(props: ComponentProps<typeof Button>) {
  return <NumberField.Increment render={<Button size="sm" {...props} />} />;
}

export function StepperValue({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn("flex-1 text-center", className)}
      aria-live="polite"
      {...props}
    />
  );
}
