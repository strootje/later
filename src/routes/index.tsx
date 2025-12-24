import { createCollection, eq, useLiveQuery } from "@tanstack/solid-db";
import { createFileRoute } from "@tanstack/solid-router";
import { cx } from "class-variance-authority";
import {
  addDays,
  eachDayOfInterval,
  format,
  formatISOWithOptions,
  intlFormatDistanceWithOptions,
  isSameDay,
  startOfISOWeek,
  subDays,
} from "date-fns/fp";
import { createSignal, Index } from "solid-js";
import { createTodoCollectionOptions } from "../collections/items.ts";
import { useAppForm } from "../comps/form/hooks.ts";
import { Page, Section } from "../comps/layout.tsx";
import { TodoItem } from "../comps/todo.tsx";

export const Route = createFileRoute("/")({
  ssr: false,
  component: () => {
    const [dueAt, setDueAt] = createSignal(new Date());
    const todoCollection = createCollection(createTodoCollectionOptions());
    const filteredTodos = useLiveQuery((q) =>
      q.from({ todo: todoCollection })
        .where(({ todo }) => eq(todo.dueAt, formatISOWithOptions({ representation: "date" }, dueAt())))
    );

    const switchDate = useAppForm(() => ({
      defaultValues: {
        date: dueAt(),
      },

      onSubmit({ value }) {
        setDueAt(value.date);
      },
    }));

    const firstDayOfWeek = () => startOfISOWeek(dueAt());

    const addTodo = useAppForm(() => ({
      defaultValues: {
        title: crypto.randomUUID(),
        completedAt: undefined,
      },

      onSubmit({ value }) {
        const result = todoCollection.insert({
          id: crypto.randomUUID(),
          dueAt: formatISOWithOptions({ representation: "date" }, dueAt()),
          ...value,
        });
        console.log("result", result);
      },
    }));

    return (
      <Page>
        <Section>
          <form class="flex justify-center gap-2 pt-1">
            <button
              type="button"
              class="touch-manipulation rounded p-2 ring-2"
              onclick={() => {
                setDueAt(subDays(1, dueAt()));
              }}
            >
              <i class="i-solar:alt-arrow-left-bold inline-block p-2" />
            </button>

            <switchDate.Field name="date">
              {(field) => (
                <>
                  <span class="inline-block rounded bg-red px-2 py-1 ring-2">
                    {intlFormatDistanceWithOptions(
                      { unit: "day" },
                      formatISOWithOptions({ representation: "date" }, new Date()),
                      formatISOWithOptions({ representation: "date" }, field().state.value),
                    )}
                  </span>
                  {
                    /* <input
                    type="date"
                    name={field().name}
                    value={formatISOWithOptions({ representation: "date" }, field().state.value)}
                    onblur={field().handleBlur}
                    onchange={(e) => field().handleChange(new Date(e.target.value))}
                  /> */
                  }
                </>
              )}
            </switchDate.Field>

            <button
              type="button"
              class="touch-manipulation rounded p-2 ring-2"
              onclick={() => {
                setDueAt(addDays(1, dueAt()));
              }}
            >
              <i class="i-solar:alt-arrow-right-bold inline-block p-2" />
            </button>
          </form>

          <div class="grid grid-cols-7 gap-2">
            <Index each={eachDayOfInterval({ start: firstDayOfWeek(), end: addDays(6, firstDayOfWeek()) })}>
              {(day) => (
                <span
                  class="inline-flex flex-col touch-manipulation items-center rounded ring-2"
                  classList={{
                    "ring-gray": !isSameDay(day(), dueAt()),
                  }}
                  onclick={() => setDueAt(day())}
                >
                  <div>{format("EEE", day())}</div>
                  <div>{format("dd", day())}</div>
                  <div>•</div>
                </span>
              )}
            </Index>
          </div>
        </Section>

        <Section>
          <Index each={filteredTodos.data}>
            {(item) => (
              <div class="flex gap-2">
                <button
                  type="button"
                  class={cx("rounded p-2 ring-2 touch-manipulation", item().completedAt ? "ring-lime-200" : "")}
                  onclick={() => {
                    todoCollection.update(
                      item().id,
                      (item) => {
                        if (item.completedAt == undefined) {
                          item.completedAt = formatISOWithOptions({ representation: "complete" }, new Date());
                        } else {
                          item.completedAt = undefined;
                        }
                      },
                    );
                  }}
                >
                  <i class="i-solar:check-square-bold-duotone inline-block p-2" />
                </button>

                <span class="inline-block grow">
                  <TodoItem item={item()} />
                </span>

                <button
                  type="button"
                  class={cx("rounded p-2 ring-2 touch-manipulation")}
                  onclick={() => todoCollection.delete(item().id)}
                >
                  <i class="i-solar:trash-bin-trash-bold-duotone inline-block p-2" />
                </button>

                <button
                  type="button"
                  class={cx("rounded p-2 ring-2 touch-manipulation")}
                  onclick={() => {
                    todoCollection.update(
                      item().id,
                      (item) => item.dueAt = formatISOWithOptions({ representation: "date" }, addDays(3, item.dueAt)),
                    );
                  }}
                >
                  <i class="i-solar:square-forward-bold-duotone inline-block p-2" />
                </button>
              </div>
            )}
          </Index>

          <form
            onsubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addTodo.handleSubmit();
            }}
          >
            <addTodo.AppField name="title">{(field) => <field.TextInput />}</addTodo.AppField>
          </form>
        </Section>
      </Page>
    );
  },
});
