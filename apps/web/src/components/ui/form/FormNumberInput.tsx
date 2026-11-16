import type { ComponentProps } from "react";
import { useFieldContext } from "@/hooks/useAppForm";
import { NumberInput } from "../NumberInput";
import { withField } from "./FormField";

export function FormNumberInput(props: ComponentProps<typeof NumberInput>) {
  const field = useFieldContext<number | null>();

  return (
    <NumberInput
      value={field.state.value}
      onValueChange={field.handleChange}
      onBlur={field.handleBlur}
      {...props}
    />
  );
}

export const FormNumberInputField = withField(FormNumberInput);
