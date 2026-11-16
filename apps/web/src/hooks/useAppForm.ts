import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormField } from "@/components/ui/form/FormField";
import { FormInput, FormInputField } from "@/components/ui/form/FormInput";
import {
  FormNumberInput,
  FormNumberInputField,
} from "@/components/ui/form/FormNumberInput";
import { FormSelect, FormSelectField } from "@/components/ui/form/FormSelect";
import { FormSubmitButton } from "@/components/ui/form/FormSubmitButton";
import {
  FormTextarea,
  FormTextareaField,
} from "@/components/ui/form/FormTextarea";
import { FormUpload, FormUploadField } from "@/components/ui/form/FormUpload";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    Root: FormField,

    Input: FormInput,
    InputField: FormInputField,

    NumberInput: FormNumberInput,
    NumberInputField: FormNumberInputField,

    Select: FormSelect,
    SelectField: FormSelectField,

    Textarea: FormTextarea,
    TextareaField: FormTextareaField,

    Upload: FormUpload,
    UploadField: FormUploadField,
  },
  formComponents: {
    SubmitButton: FormSubmitButton,
  },
  fieldContext,
  formContext,
});
