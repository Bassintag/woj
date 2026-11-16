import type { ComponentProps } from "react";
import { useFieldContext } from "@/hooks/useAppForm";
import { Textarea } from "../Textarea";
import { withField } from "./FormField";

export function FormTextarea(props: ComponentProps<typeof Textarea>) {
  const field = useFieldContext<string>();

  return (
    <Textarea
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      {...props}
    />
  );
}

export const FormTextareaField = withField(FormTextarea);
