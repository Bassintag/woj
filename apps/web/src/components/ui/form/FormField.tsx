import { useSelector } from "@tanstack/react-form";
import type { ComponentProps, ReactNode } from "react";
import { useFieldContext } from "@/hooks/useAppForm";
import { Field, FieldDescription, FieldError, FieldLabel } from "../Field";

export function FormField({
  label,
  description,
  children,
  ...props
}: ComponentProps<typeof Field> & {
  label?: ReactNode;
  description?: ReactNode;
}) {
  const field = useFieldContext();
  const errors = useSelector(field.store, (state) => state.meta.errors);

  return (
    <Field {...props}>
      {label && <FieldLabel>{label}</FieldLabel>}
      {children}
      {description && <FieldDescription>{description}</FieldDescription>}
      {errors && <FieldError>TODO ERROR</FieldError>}
    </Field>
  );
}
