import type { ComponentProps } from "react";
import { useFieldContext } from "@/hooks/useAppForm";
import { Upload } from "../Upload";
import { withField } from "./FormField";

export function FormUpload(props: ComponentProps<typeof Upload>) {
  const field = useFieldContext<File | string | null>();

  return (
    <Upload
      value={field.state.value}
      onValueChange={field.handleChange}
      onBlur={field.handleBlur}
      {...props}
    />
  );
}

export const FormUploadField = withField(FormUpload);
