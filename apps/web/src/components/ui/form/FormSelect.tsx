import type { ComponentProps } from "react";
import { useFieldContext } from "@/hooks/useAppForm";
import { Select } from "../Select";
import { withField } from "./FormField";

export function FormSelect<Value, Multiple extends boolean | undefined = false>(
  props: ComponentProps<typeof Select<Value, Multiple>>,
) {
  const field =
    useFieldContext<ComponentProps<typeof Select<Value, Multiple>>["value"]>();

  return (
    <Select
      value={field.state.value}
      onValueChange={field.handleChange}
      {...props}
    />
  );
}

export const FormSelectField = withField(FormSelect);
