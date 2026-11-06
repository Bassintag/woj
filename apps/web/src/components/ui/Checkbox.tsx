import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export function Checkbox({ className, ...props }: BaseCheckbox.Root.Props) {
  return (
    <BaseCheckbox.Root
      className={cn(
        "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-fg hover:bg-muted-bg data-checked:border-brand data-checked:bg-brand",
        className,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator className="flex size-4 items-center justify-center text-fg">
        <CheckIcon className="size-4" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
