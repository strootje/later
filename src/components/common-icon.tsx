import { tw } from "@strootje/more/tw";
import { cx } from "class-variance-authority";
import { ComponentProps, splitProps } from "solid-js";

export const Icon = {
  Solar: (props: ComponentProps<"i">) => {
    const [opts, attribs] = splitProps(props, ["children", "class"]);
    return <i {...attribs} class={cx(tw("v-middle inline-block"), opts.class)} />;
  },
};
