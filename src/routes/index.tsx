import { Form } from "@strootje/more/form";
import { eq, useLiveQuery } from "@tanstack/solid-db";
import { createFileRoute } from "@tanstack/solid-router";
import {
  addDays,
  eachDayOfInterval,
  formatISOWithOptions,
  intlFormatDistanceWithOptions,
  isSameDay,
  startOfISOWeek,
  subDays,
} from "date-fns/fp";
import { createSignal, Index } from "solid-js";
import { useAppForm } from "../comps.form/hooks.ts";
import { DayCard } from "../comps.ui.cards/day.card.tsx";
import { TodoItemCard } from "../comps.ui.cards/todo-item.card.tsx";
import { Page, Section } from "../comps.ui.shell/layout.tsx";
import { todoItemCollection } from "../data.collections/todo-item.collection.ts";

export const Route = createFileRoute("/")({
  ssr: false,
  component: () => {
    const [dueAt, setDueAt] = createSignal(new Date());
    const filteredTodos = useLiveQuery((p) =>
      p.from({ todo: todoItemCollection })
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
        title: "",
        completedAt: undefined,
      },

      onSubmit({ value }) {
        const result = todoItemCollection.insert({
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
              class="touch-manipulation rounded bg-white p-2 ring-1 ring-stone-500"
              onclick={() => {
                setDueAt(subDays(1, dueAt()));
              }}
            >
              <i class="i-solar:alt-arrow-left-bold inline-block p-2 ring-stone-500" />
            </button>

            <switchDate.Field name="date">
              {(field) => (
                <>
                  <span class="inline-flex items-center rounded bg-white px-2 py-1 ring-1 ring-stone-500">
                    {intlFormatDistanceWithOptions(
                      { unit: "day" },
                      formatISOWithOptions({ representation: "date" }, new Date()),
                      formatISOWithOptions({ representation: "date" }, field().state.value),
                    )}
                  </span>
                </>
              )}
            </switchDate.Field>

            <button
              type="button"
              class="touch-manipulation rounded bg-white p-2 ring-1"
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
                <DayCard
                  day={day()}
                  selected={isSameDay(day(), dueAt())}
                  isToday={isSameDay(day(), new Date())}
                  onclick={() => setDueAt(day())}
                />
              )}
            </Index>
          </div>
        </Section>

        <Section>
          <Index each={filteredTodos.data}>
            {(item) => <TodoItemCard todoItem={item()} />}
          </Index>

          <Form for={addTodo}>
            <addTodo.AppField name="title">{(field) => <field.TextInput />}</addTodo.AppField>
          </Form>
        </Section>
      </Page>
    );
  },
});
