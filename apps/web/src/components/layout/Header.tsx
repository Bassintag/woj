import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Header({ className, ...props }: ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "flex h-10 flex-row items-center gap-2 px-layout text-h1 text-fg",
        className,
      )}
      {...props}
    />
  );
}
