import { Field as BaseField } from "@base-ui/react/field";
import { cn } from "@/lib/cn";

export function Field({ className, ...props }: BaseField.Root.Props) {
  return (
    <BaseField.Root
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

export function FieldLabel({ className, ...props }: BaseField.Label.Props) {
  return (
    <BaseField.Label className={cn("text-md text-fg", className)} {...props} />
  );
}

export function FieldDescription({
  className,
  ...props
}: BaseField.Description.Props) {
  return (
    <BaseField.Description
      className={cn("text-xs text-muted", className)}
      {...props}
    />
  );
}

export function FieldError({ className, ...props }: BaseField.Error.Props) {
  return (
    <BaseField.Error
      className={cn("text-xs text-error", className)}
      {...props}
    />
  );
}
