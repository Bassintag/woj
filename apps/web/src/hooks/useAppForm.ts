import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormField } from "@/components/ui/form/FormField";
import { FormInput, FormInputField } from "@/components/ui/form/FormInput";
import { FormSubmitButton } from "@/components/ui/form/FormSubmitButton";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    Root: FormField,

    Input: FormInput,
    InputField: FormInputField,
  },
  formComponents: {
    SubmitButton: FormSubmitButton,
  },
  fieldContext,
  formContext,
});
