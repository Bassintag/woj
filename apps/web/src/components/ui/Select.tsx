import { Select as BaseSelect } from "@base-ui/react/select";
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";
import {
  InputSizeContext,
  type InputVariantProps,
  inputVariants,
  useInputSize,
} from "./Input";

const selectContentVariants = cva(
  "max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) overflow-y-auto rounded-xl bg-surface text-fg shadow-base transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-md",
      },
    },
  },
);

const selectItemVariants = cva(
  "relative flex cursor-pointer items-center data-highlighted:bg-bg",
  {
    variants: {
      size: {
        sm: "h-6 pr-3 pl-8",
        md: "h-8 pr-4 pl-10",
      },
    },
  },
);

const selectItemIndicatorVariants = cva(
  "absolute flex text-muted *:[svg]:size-full",
  {
    variants: {
      size: {
        sm: "left-3 size-3",
        md: "left-4 size-4",
      },
    },
  },
);

export function Select<Value, Multiple extends boolean | undefined = false>({
  size = "md",
  ...props
}: BaseSelect.Root.Props<Value, Multiple> & InputVariantProps) {
  return (
    <InputSizeContext value={size}>
      <BaseSelect.Root {...props} />
    </InputSizeContext>
  );
}

export function SelectTrigger({
  className,
  placeholder,
  ...props
}: BaseSelect.Trigger.Props & { placeholder?: string }) {
  const size = useInputSize();

  return (
    <BaseSelect.Trigger
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-2 text-left",
        inputVariants({ size }),
        className,
      )}
      {...props}
    >
      <BaseSelect.Value
        placeholder={placeholder}
        className="truncate data-placeholder:text-placeholder"
      />
      <BaseSelect.Icon className="flex text-fg transition-transform data-popup-open:rotate-180">
        <CaretDownIcon />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  ...props
}: BaseSelect.Popup.Props) {
  const size = useInputSize();

  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        className="z-50 outline-none"
        sideOffset={8}
        alignItemWithTrigger={false}
      >
        <BaseSelect.Popup
          className={cn(selectContentVariants({ size }), className)}
          {...props}
        >
          <BaseSelect.List>{children}</BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: BaseSelect.Item.Props) {
  const size = useInputSize();

  return (
    <BaseSelect.Item
      className={cn(selectItemVariants({ size }), className)}
      {...props}
    >
      <BaseSelect.ItemIndicator
        className={selectItemIndicatorVariants({ size })}
      >
        <CheckIcon />
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  );
}
