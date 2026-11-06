import { Checkbox } from "@base-ui/react/checkbox";
import { CheckboxGroup } from "@base-ui/react/checkbox-group";
import { cn } from "@/lib/cn";

export const TagGroup = CheckboxGroup;

export function Tag({ className, ...props }: Checkbox.Root.Props) {
  return (
    <Checkbox.Root
      className={cn(
        className,
        "inline-flex h-8 cursor-pointer flex-row items-center rounded-full bg-muted-bg px-4 text-sm whitespace-nowrap text-fg select-none data-checked:bg-brand",
      )}
      {...props}
    />
  );
}
