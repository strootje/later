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
import * as v from "valibot";
import { useAppForm } from "../comps.form/hooks.ts";
import { DayCard } from "../comps.ui.cards/day.card.tsx";
import { TodoItemCard } from "../comps.ui.cards/todo-item.card.tsx";
import { Page, Section } from "../comps.ui.shell/layout.tsx";
import { Button } from "../comps.ui/button.tsx";
import { Icon } from "../comps.ui/icon.tsx";
import { todoItemCollection } from "../data.collections/todo-item.collection.ts";

export const Route = createFileRoute("/")({
  component: () => {
    const [dueAt, setDueAt] = createSignal(new Date());
    const firstDayOfWeek = () => startOfISOWeek(dueAt());

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

    const addTodo = useAppForm(() => ({
      defaultValues: {
        title: "",
        completedAt: undefined as (string | undefined),
      },

      validators: {
        onChange: v.object({
          title: v.pipe(v.string(), v.minLength(3)),
          completedAt: v.union([v.string(), v.undefined()]),
        }),
      },

      onSubmit({ formApi, value }) {
        todoItemCollection.insert({
          id: crypto.randomUUID(),
          dueAt: formatISOWithOptions({ representation: "date" }, dueAt()),
          ...value,
        });

        formApi.reset();
      },
    }));

    return (
      <Page>
        <Section>
          <form class="mt-1 flex justify-center gap-2">
            <Button class="b-1 b-stone-500 rounded bg-white p-2" onclick={() => setDueAt(subDays(1, dueAt()))}>
              <Icon.Solar class="i-solar:alt-arrow-left-bold" />
            </Button>

            <switchDate.Field name="date">
              {(field) => (
                <button
                  type="button"
                  class="b-1 b-stone-500 inline-flex min-w-1/3 items-center justify-center rounded bg-white px-2 py-1"
                  onclick={() => setDueAt(new Date())}
                >
                  <Icon.Solar class="i-solar:calendar-date-bold-duotone" />
                  <span>
                    {intlFormatDistanceWithOptions(
                      { unit: "day" },
                      formatISOWithOptions({ representation: "date" }, new Date()),
                      formatISOWithOptions({ representation: "date" }, field().state.value),
                    )}
                  </span>
                </button>
              )}
            </switchDate.Field>

            <Button class="b-1 b-stone-500 rounded bg-white p-2" onclick={() => setDueAt(addDays(1, dueAt()))}>
              <Icon.Solar class="i-solar:alt-arrow-right-bold" />
            </Button>
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
