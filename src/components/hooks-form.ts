import { DateInput } from "#/components/form-fields-date.tsx";
import { TextInput } from "#/components/form-fields-text.tsx";
import { createFormHook, createFormHookContexts } from "@tanstack/solid-form";

const {
  fieldContext,
  formContext,
  useFieldContext,
  useFormContext,
} = createFormHookContexts();
export { useFieldContext, useFormContext };

export const {
  useAppForm,
} = createFormHook({
  fieldComponents: {
    DateInput,
    TextInput,
  },
  fieldContext,

  formComponents: {},
  formContext,
});
