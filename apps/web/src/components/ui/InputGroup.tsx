import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { inputClassName } from "./Input";

export function InputGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-fg *:[svg]:size-5 *:[svg]:text-placeholder",
        inputClassName,
        className,
      )}
      {...props}
    />
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
