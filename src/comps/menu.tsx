import type { ParentProps } from "solid-js";

export const Menu = (props: ParentProps) => {
  return (
    <nav class="flex flex-col gap-1 rounded-xl bg-white p-2 *:flex *:items-center *:gap-1 *:px-1 *:py-.5">
      {props.children}
    </nav>
  );
};
