import type { AnyFormApi } from "@tanstack/solid-form";
import { type ComponentProps, splitProps } from "solid-js";

type HandleProps = {
  stopPropagation?: boolean;
  preventDefault?: boolean;
  for: AnyFormApi;
};
export const handle = (props: HandleProps) => {
  return (e: SubmitEvent) => {
    if (props.preventDefault ?? true) {
      e.preventDefault();
    }

    if (props.stopPropagation ?? true) {
      e.stopPropagation();
    }

    props.for.handleSubmit();
  };
};

type FormProps = Omit<ComponentProps<"form">, "onsubmit" | "on:submit" | "onSubmit"> & HandleProps;
export const Form = (props: FormProps) => {
  const [handleProps, localProps, formProps] = splitProps(props, ["for", "stopPropagation", "preventDefault"], [
    "children",
  ]);
  return <form {...formProps} onsubmit={handle(handleProps)}>{localProps.children}</form>;
};
