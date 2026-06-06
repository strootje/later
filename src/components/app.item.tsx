import type { Item as DbItem } from "@scope/db/client";
import { cva } from "class-variance-authority";
import * as itemFns from "../functions/item.queries.ts";
import { tw } from "../utils/unocss.ts";
import { Swiper } from "./common.swiper.tsx";

const item = cva(tw("b-1 mx-1 flex flex-col gap-1 rounded-xl bg-white p-2"), {
  variants: {
    completed: {
      false: "b-stone-500",
      true: "b-emerald-200",
    },
  },
});

const add3Days = (date: string) => {
  return Temporal.PlainDate.from(date).add(Temporal.Duration.from({ days: 3 })).toString();
};

type ItemProps = {
  item: DbItem;
  selectedDate: Temporal.PlainDate;
};
export const Item = (props: ItemProps) => {
  return (
    <Swiper
      class={item({ completed: !!props.item.completedAt })}
      actions={{
        alt: [
          {
            class:
              "b-1 b-stone-500 flex aspect-square h-full flex-col items-center justify-center gap-1 rounded-xl bg-white",
            children: <i class="i-solar:double-alt-arrow-right-outline v-middle inline-block" />,
            onClick: () => itemFns.postpone(props.item.id, add3Days(props.item.dueAt)),
          },
          {
            class:
              "b-1 b-stone-500 flex aspect-square h-full flex-col items-center justify-center gap-1 rounded-xl bg-white",
            children: <i class="i-solar:trash-bin-trash-outline v-middle inline-block" />,
            onClick: () => itemFns.remove(props.item.id),
          },
        ],
        main: [
          {
            class:
              "b-1 b-stone-500 flex aspect-square h-full flex-col items-center justify-center gap-1 rounded-xl bg-white",
            children: <i class="i-solar:check-square-outline v-middle inline-block" />,
            onClick: () =>
              itemFns.complete(props.item.id, !props.item.completedAt ? props.selectedDate.toString() : undefined),
          },
        ],
      }}
    >
      <span>{props.item.title}</span>
    </Swiper>
  );
};
