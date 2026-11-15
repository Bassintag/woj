import { useSelector } from "@tanstack/react-form";
import type { ComponentProps } from "react";
import { useFormContext } from "@/hooks/useAppForm";
import { Button } from "../Button";

export function FormSubmitButton(props: ComponentProps<typeof Button>) {
  const form = useFormContext();
  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);

  return <Button type="submit" disabled={isSubmitting} {...props} />;
}
