import { cx } from "class-variance-authority";
import { ComponentProps, splitProps } from "solid-js";

export const Icon = {
  Solar: (props: ComponentProps<"i">) => {
    const [loProps, elProps] = splitProps(props, ["children", "class"]);
    return <i {...elProps} class={cx("inline-block", loProps.class)} />;
  },
};
