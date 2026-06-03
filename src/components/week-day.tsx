import { mergeRefs } from "@solid-primitives/refs";
import { cva, VariantProps } from "class-variance-authority";
import { animate } from "motion";
import { ComponentProps, createEffect, on, splitProps } from "solid-js";
import { tw } from "../utils/unocss.ts";
import { Button } from "./common.button.tsx";
import { useLocale } from "./hook.i18n.ts";

const weekDay = cva(tw("b-2 flex flex-col items-center rounded-xl bg-white p-2 font-mono"), {
  variants: {
    isSelected: {
      true: tw("shadow-[2px_2px_0]"),
    },
    isToday: {
      true: tw("b-pink-200 shadow-pink-200"),
    },
  },
  compoundVariants: [
    { isSelected: false, isToday: false, class: tw("b-stone-200") },
    { isSelected: true, isToday: true, class: tw("b-pink-500 shadow-pink-500") },
  ],
  defaultVariants: {
    isSelected: false,
    isToday: false,
  },
});

type WeekDayProps = ComponentProps<"button"> & VariantProps<typeof weekDay> & {
  date: Temporal.PlainDate;
};
export const WeekDay = (props: WeekDayProps) => {
  const [, weekDayProps, attribs] = splitProps(props, ["ref"], ["isSelected", "isToday"]);

  const locale = useLocale();
  const dtf = () => new Intl.DateTimeFormat(locale(), { weekday: "short" });

  let ref: HTMLElement;
  createEffect(on(() => weekDayProps.isSelected, (isSelected) => {
    if (ref && isSelected === true) {
      animate(ref, {
        scale: [1.2, 1],
        rotate: [Math.random() * 6 - 3, 0],
      });
    }
  }));

  return (
    <Button {...attribs} ref={mergeRefs(props.ref, (el) => (ref = el))}>
      <div class={weekDay(weekDayProps)}>
        <span>{dtf().format(props.date)}</span>
        <span>{props.date.day}</span>
      </div>
    </Button>
  );
};
