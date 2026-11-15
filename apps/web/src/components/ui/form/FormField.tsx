import { useSelector } from "@tanstack/react-form";
import type { ComponentProps, ComponentType, ReactNode } from "react";
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
  const { error, ...fieldProps } = useSelector(field.store, (state) => ({
    touched: state.meta.isTouched,
    dirty: state.meta.isDirty,
    invalid: !state.meta.isValid,
    error: state.meta.errors.at(0)?.message,
  }));

  return (
    <Field {...fieldProps} {...props}>
      {label && <FieldLabel>{label}</FieldLabel>}
      {children}
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError match>{error}</FieldError>}
    </Field>
  );
}

export function withField<P extends object>(Component: ComponentType<P>) {
  return function FieldComponent({
    label,
    description,
    ...props
  }: P & Pick<ComponentProps<typeof FormField>, "label" | "description">) {
    return (
      <FormField label={label} description={description}>
        <Component {...(props as P)} />
      </FormField>
    );
  };
}
