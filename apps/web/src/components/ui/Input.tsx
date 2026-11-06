import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-10 rounded-xl bg-muted-bg px-3 text-md text-fg placeholder:text-muted-fg",
        className,
      )}
      {...props}
    />
  );
}
