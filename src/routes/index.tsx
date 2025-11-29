import { createCollection, eq, useLiveQuery } from "@tanstack/solid-db";
import { createFileRoute } from "@tanstack/solid-router";
import { cx } from "class-variance-authority";
import { addDays, formatISOWithOptions, intlFormatDistanceWithOptions, subDays } from "date-fns/fp";
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
          <form class="flex gap-2">
            <button
              type="button"
              class="m-2 rounded p-2 shadow-[2px_2px_0_2px] ring-2"
              onclick={() => {
                setDueAt(subDays(1, dueAt()));
              }}
            >
              <i class="i-solar:alt-arrow-left-bold inline-block p-2" />
            </button>

            <switchDate.Field name="date">
              {(field) => (
                <>
                  <span class="bg-red">
                    {intlFormatDistanceWithOptions(
                      { unit: "day" },
                      formatISOWithOptions({ representation: "date" }, new Date()),
                      formatISOWithOptions({ representation: "date" }, field().state.value),
                    )}
                  </span>
                  <input
                    type="date"
                    name={field().name}
                    value={formatISOWithOptions({ representation: "date" }, field().state.value)}
                    onblur={field().handleBlur}
                    onchange={(e) => field().handleChange(new Date(e.target.value))}
                  />
                </>
              )}
            </switchDate.Field>

            <button
              type="button"
              class="m-2 rounded p-2 shadow-[2px_2px_0_2px] ring-2"
              onclick={() => {
                setDueAt(addDays(1, dueAt()));
              }}
            >
              <i class="i-solar:alt-arrow-right-bold inline-block p-2" />
            </button>
          </form>
        </Section>

        <Section>
          <Index each={filteredTodos.data}>
            {(item) => (
              <div class="flex gap-2">
                <button
                  type="button"
                  class={cx("m-2 rounded p-2 shadow-[2px_2px_0_2px] ring-2", item().completedAt ? "ring-lime-200" : "")}
                  onclick={() => {
                    todoCollection.update(
                      item().id,
                      (item) => item.completedAt = formatISOWithOptions({ representation: "complete" }, new Date()),
                    );
                  }}
                >
                  <i class="i-solar:check-square-bold-duotone inline-block p-2" />
                </button>

                <TodoItem item={item()} />

                <button
                  type="button"
                  class={cx("m-2 rounded p-2 shadow-[2px_2px_0_2px] ring-2", item().completedAt ? "ring-lime-200" : "")}
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
