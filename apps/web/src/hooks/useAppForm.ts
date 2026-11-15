import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormField } from "@/components/ui/form/FormField";
import { FormInput } from "@/components/ui/form/FormInput";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    Root: FormField,
    Input: FormInput,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
