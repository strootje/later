import type { AnyFormApi } from "@tanstack/solid-form";
import type { ParentProps } from "solid-js";

export const handle = (form: AnyFormApi) => {
  return (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };
};

type FormProps = ParentProps & {
  handler: AnyFormApi;
};
export const Form = (props: FormProps) => {
  return <form onsubmit={handle(props.handler)}>{props.children}</form>;
};
