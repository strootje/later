import { createFormHook } from "@tanstack/solid-form";
import { fieldContext, formContext } from "./context.ts";
import { DateInput } from "./input-date.tsx";
import { TextInput } from "./input-text.tsx";

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
