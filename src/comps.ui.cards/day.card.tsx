import { mergeRefs } from "@solid-primitives/refs";
import { cva, cx, VariantProps } from "class-variance-authority";
import { format } from "date-fns/fp";
import { animate, press } from "motion";
import { type ComponentProps, createEffect, on, onMount, splitProps } from "solid-js";

const dayCardVariants = cva(
  "inline-flex flex-col touch-manipulation items-center rounded bg-white ring-1",
  {
    variants: {
      isToday: {
        false: "shadow-stone-700 ring-stone-700",
        true: "shadow-green-700 ring-green-700",
      },
      selected: {
        false: null,
        true: "shadow-[1.5px_1.5px_0_1.5px] fw-500",
      },
    },
  },
);

type DayCardProps = ComponentProps<"button"> & VariantProps<typeof dayCardVariants> & { day: Date };
export const DayCard = (props: DayCardProps) => {
  const [loProps, vaProps, elProps] = splitProps(props, ["day", "class", "ref"], [
    "isToday",
    "selected",
  ]);

  const handleRef = (el: HTMLButtonElement) => {
    onMount(() => {
      press(el, () => {
        animate(el, {
          scale: .9,
          rotate: Math.random() * 10 - 5,
        });

        return () => {
          animate(el, { scale: [1.3, 1], rotate: 0 });
        };
      });
    });

    createEffect(on(() => vaProps.selected, (val) => {
      if (val === true) {
        animate(el, {
          scale: [1.3, 1],
          rotate: [Math.random() * 6 - 3, 0],
        });
      }
    }, { defer: true }));
  };

  return (
    <button
      {...elProps}
      ref={mergeRefs(loProps.ref, handleRef)}
      class={cx(loProps.class, dayCardVariants(vaProps))}
    >
      <div>{format("EEE", loProps.day)}</div>
      <div>{format("dd", loProps.day)}</div>
      <div>•</div>
    </button>
  );
};
