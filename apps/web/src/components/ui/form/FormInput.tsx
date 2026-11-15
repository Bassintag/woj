import type { ComponentProps } from "react";
import { useFieldContext } from "@/hooks/useAppForm";
import { Input } from "../Input";
import { withField } from "./FormField";

export function FormInput(props: ComponentProps<typeof Input>) {
  const field = useFieldContext<string>();

  return (
    <Input
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      {...props}
    />
  );
}

export const FormInputField = withField(FormInput);
