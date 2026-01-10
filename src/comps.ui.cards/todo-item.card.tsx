import type { clientModels } from "@scope/database/client";
import { cva, cx, type VariantProps } from "class-variance-authority";
import { addDays, formatISOWithOptions } from "date-fns/fp";
import { type ComponentProps, splitProps } from "solid-js";
import { Swiper } from "../comps.ui/swiper.tsx";
import { todoItemCollection } from "../data.collections/todo-item.collection.ts";

const todoItemCardVariants = cva("flex gap-2 bg-white rounded b-1 px-2 py-1 text-xl", {
  variants: {
    completed: {
      false: "shadow-stone-700 b-stone-700",
      true: "shadow-green-700 b-green-700",
    },
  },
});

type TodoItemCardProps = ComponentProps<"article"> & VariantProps<typeof todoItemCardVariants> & {
  todoItem: clientModels.SelectedTodoItem;
};
export const TodoItemCard = (props: TodoItemCardProps) => {
  const [loProps, vaProps, elProps] = splitProps(props, ["class", "todoItem"], []);

  return (
    <Swiper
      actions={{
        left: [
          {
            comp: <i class="i-solar:check-square-bold-duotone" />,
            action: async () => {
              todoItemCollection.update(loProps.todoItem.id, (p) => {
                if (p.completedAt) {
                  p.completedAt = undefined;
                } else {
                  p.completedAt = formatISOWithOptions({}, new Date());
                }
              });
            },
          },
        ],
        right: [
          {
            comp: <i class="i-solar:alarm-bold-duotone" />,
            action: async () => {
              todoItemCollection.update(loProps.todoItem.id, (p) => {
                p.dueAt = formatISOWithOptions({ representation: "date" }, addDays(3, p.dueAt));
              });
            },
          },
          {
            comp: <i class="i-solar:trash-bin-minimalistic-bold-duotone" />,
            action: async () => {
              todoItemCollection.delete(loProps.todoItem.id);
            },
          },
        ],
      }}
    >
      <article
        {...elProps}
        class={cx(loProps.class, todoItemCardVariants({ ...vaProps, completed: !!loProps.todoItem.completedAt }))}
      >
        {loProps.todoItem.title} - {loProps.todoItem.completedAt}
      </article>
    </Swiper>
  );
};
