import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

export function Stepper({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-w-36 flex-row items-center gap-2 rounded-xl bg-input-bg p-1 text-sm text-fg",
        className,
      )}
      {...props}
    />
  );
}

export function StepperButton(props: ComponentProps<typeof Button>) {
  return <Button size="sm" {...props} />;
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
