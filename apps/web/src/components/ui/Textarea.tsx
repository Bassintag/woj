import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { inputVariants } from "./Input";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        inputVariants({ size: "md" }),
        "min-h-24 w-full resize-none py-3",
        className,
      )}
      {...props}
    />
  );
}
