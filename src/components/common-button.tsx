import { mergeRefs } from "@solid-primitives/refs";
import { cx } from "class-variance-authority";
import { animate, press } from "motion";
import { ComponentProps, mergeProps, splitProps } from "solid-js";

const defaultButtonProps: ButtonProps = {
  type: "button",
};

type ButtonProps = ComponentProps<"button">;
export const Button = (props: ButtonProps) => {
  const [loProps, elProps] = splitProps(mergeProps(props, defaultButtonProps), ["class", "ref"]);

  const handleRef = (el: HTMLButtonElement) => {
    press(el, () => {
      animate(el, {
        scale: .9,
      });

      return () => {
        animate(el, {
          scale: [1.1, 1],
        });
      };
    });
  };

  return (
    <button
      {...elProps}
      ref={mergeRefs(loProps.ref, handleRef)}
      oncontextmenu={(e) => e.preventDefault()}
      class={cx(loProps.class, "touch-manipulation")}
    />
  );
};
