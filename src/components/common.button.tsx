import { mergeRefs } from "@solid-primitives/refs";
import { cx } from "class-variance-authority";
import { animate, press } from "motion";
import { ComponentProps, mergeProps, splitProps } from "solid-js";

const defaultButtonProps: ButtonProps = {
  type: "button",
};

type ButtonProps = ComponentProps<"button">;
export const Button = (props: ButtonProps) => {
  const merged = mergeProps(defaultButtonProps, props);
  const [local, attribs] = splitProps(merged, ["class", "ref"]);

  const handleRef = (ref: HTMLButtonElement) => {
    press(ref, () => {
      animate(ref, {
        scale: .9,
        rotate: Math.random() * 10 - 5,
      });

      return () => {
        animate(ref, {
          scale: [1.1, 1],
          rotate: 0,
        });
      };
    });
  };

  return (
    <button
      {...attribs}
      class={cx(local.class, "touch-manipulation")}
      oncontextmenu={(evt) => evt.preventDefault()}
      ref={mergeRefs(props.ref, handleRef)}
    />
  );
};
