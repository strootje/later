import type { clientModels } from "@scope/database/client";
import { cva, cx, type VariantProps } from "class-variance-authority";
import { type ComponentProps, splitProps } from "solid-js";
import { Swiper } from "../comps.ui/swiper.tsx";

const todoItemCardVariants = cva("flex gap-2 bg-white rounded b-1 px-2 py-1 shadow-stone-700 b-stone-700", {
  variants: {},
});

type TodoItemCardProps = ComponentProps<"article"> & VariantProps<typeof todoItemCardVariants> & {
  todoItem: clientModels.SelectedTodoItem;
};
export const TodoItemCard = (props: TodoItemCardProps) => {
  const [loProps, vaProps, elProps] = splitProps(props, ["class", "todoItem"], []);

  return (
    <Swiper
      actions={{
        left: [],
        right: [
          { comp: <button type="button">&gt;&gt;</button> },
        ],
      }}
    >
      <article class={cx(loProps.class, todoItemCardVariants(vaProps))} {...elProps}>
        {loProps.todoItem.title}
      </article>
    </Swiper>
  );
};
