import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export const inputClassName =
  "h-10 rounded-xl bg-surface px-3 text-md text-fg placeholder:text-placeholder";

export function Input({
  className,
  ...props
}: ComponentProps<typeof BaseInput>) {
  return <BaseInput className={cn(inputClassName, className)} {...props} />;
}
