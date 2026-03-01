import { DayCard } from "#/components/card-day.tsx";
import { TodoItemCard } from "#/components/card-todo-item.tsx";
import { Button } from "#/components/common-button.tsx";
import { Icon } from "#/components/common-icon.tsx";
import { useAppForm } from "#/components/hooks-form.ts";
import { Page, Section } from "#/components/shell-app-layout.tsx";
import { TodoItemCollection } from "#/functions/todo-item.collection.ts";
import { eq, useLiveQuery } from "@tanstack/solid-db";
import { createFileRoute } from "@tanstack/solid-router";
import { createClientOnlyFn } from "@tanstack/solid-start";
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

export const Route = createFileRoute("/")({
  component: () => {
    const [dueAt, setDueAt] = createSignal(new Date());
    const firstDayOfWeek = () => startOfISOWeek(dueAt());

    const filteredTodos = useLiveQuery((query) => {
      return query
        .from({ todo: TodoItemCollection })
        .where(({ todo }) => {
          return eq(todo.dueAt, formatISOWithOptions({ representation: "date" }, dueAt()));
        });
    });

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

      onSubmit: createClientOnlyFn(({ formApi, value }) => {
        TodoItemCollection.insert({
          id: crypto.randomUUID(),
          dueAt: formatISOWithOptions({ representation: "date" }, dueAt()),
          ...value,
        });

        formApi.reset();
      }),
    }));

    return (
      <Page>
        <Section>
          <form class="mt-1 flex justify-center gap-2">
            <Button class="b-1 b-stone-500 rounded bg-white p-2" onclick={() => setDueAt(subDays(1, dueAt()))}>
              <Icon.Solar class="i-solar:alt-arrow-left-bold text-xl" />
            </Button>

            <switchDate.Field name="date">
              {(field) => (
                <Button
                  class="b-1 b-stone-500 flex inline-flex min-w-1/3 items-center justify-center gap-2 rounded bg-white px-2 py-1"
                  onclick={() => setDueAt(new Date())}
                >
                  <Icon.Solar class="i-solar:calendar-date-bold-duotone p-2 text-xl" />
                  <span>
                    {intlFormatDistanceWithOptions(
                      { unit: "day" },
                      formatISOWithOptions({ representation: "date" }, new Date()),
                      formatISOWithOptions({ representation: "date" }, field().state.value),
                    )}
                  </span>
                </Button>
              )}
            </switchDate.Field>

            <Button class="b-1 b-stone-500 rounded bg-white p-2" onclick={() => setDueAt(addDays(1, dueAt()))}>
              <Icon.Solar class="i-solar:alt-arrow-right-bold text-xl" />
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
          <Index each={filteredTodos()}>
            {(item) => <TodoItemCard todoItem={item()} />}
          </Index>

          <form
            onsubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await addTodo.handleSubmit();
            }}
          >
            <addTodo.AppForm>
              <addTodo.AppField name="title">{(field) => <field.TextInput />}</addTodo.AppField>
            </addTodo.AppForm>
          </form>
        </Section>
      </Page>
    );
  },
});
