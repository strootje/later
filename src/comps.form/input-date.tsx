import { useFieldContext } from "./context.ts";

export const DateInput = () => {
  const field = useFieldContext<Date>();

  return (
    <input
      type="date"
      name={field().name}
      value={field().state.value.toISOString().split("T")[0]}
      onblur={field().handleBlur}
      oninput={(e) => field().handleChange(new Date(e.target.value))}
    />
  );
};
