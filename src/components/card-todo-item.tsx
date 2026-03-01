import { Icon } from "#/components/common-icon.tsx";
import { Swiper } from "#/components/common-swiper.tsx";
import { TodoItemCollection } from "#/functions/todo-item.collection.ts";
import type { clientModels } from "@scope/db/client";
import { cva, cx, type VariantProps } from "class-variance-authority";
import { addDays, formatISOWithOptions } from "date-fns/fp";
import { type ComponentProps, splitProps } from "solid-js";

const todoItemCardVariants = cva("flex gap-2 bg-white rounded b-1 px-4 py-2 text-2xl", {
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
            comp: <Icon.Solar class="i-solar:check-square-bold-duotone" />,
            action: async () => {
              TodoItemCollection.update(loProps.todoItem.id, (p) => {
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
            comp: <Icon.Solar class="i-solar:alarm-bold-duotone" />,
            action: async () => {
              TodoItemCollection.update(loProps.todoItem.id, (p) => {
                p.dueAt = formatISOWithOptions({ representation: "date" }, addDays(3, p.dueAt));
              });
            },
          },
          {
            comp: <i class="i-solar:trash-bin-minimalistic-bold-duotone" />,
            action: async () => {
              TodoItemCollection.delete(loProps.todoItem.id);
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
