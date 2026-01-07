import { Field } from "@ark-ui/solid/field";
import { useFieldContext } from "./context.ts";

export const TextInput = () => {
  const field = useFieldContext<string>();

  return (
    <Field.Root class="rounded bg-[#47ddeb] shadow-[2px_2px_0_2px] ring-2 [&:has(:focus-visible)]:ring-amber-700">
      <Field.Input
        name={field().name}
        value={field().state.value}
        onblur={field().handleBlur}
        oninput={(e) => field().handleChange(e.target.value)}
        class="w-full px-2 py-1 outline-none"
      />
    </Field.Root>
  );
};
