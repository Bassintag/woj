import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export const inputClassName =
  "h-10 rounded-xl bg-surface px-3 text-md text-fg placeholder:text-placeholder";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(inputClassName, className)} {...props} />;
}
