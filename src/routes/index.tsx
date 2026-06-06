import * as clientDb from "@scope/db/client";
import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, For, Show, Suspense } from "solid-js";
import { AddItem } from "../components/app.add-item.tsx";
import { AppHeader } from "../components/app.header.tsx";
import { Item } from "../components/app.item.tsx";
import { MissedItems } from "../components/app.missed-items.tsx";

export const Route = createFileRoute("/")({
  component: () => {
    const [selectedDate, setSelectedDate] = createSignal<Temporal.PlainDate>(Temporal.Now.plainDateISO());
    const daysUntilToday = () => Temporal.Now.plainDateISO().until(selectedDate()).days;

    const today = () => Temporal.Now.plainDateISO();
    const items = clientDb.useLiveQuery(({ db }) => {
      return db.selectFrom("item")
        .where("dueAt", "=", selectedDate().toString())
        .selectAll();
    });

    return (
      <div class="flex min-h-dvh flex-col gap-4 overflow-x-hidden bg-pink-50">
        <AppHeader onSelectedDateChanged={setSelectedDate} />

        <Show when={daysUntilToday() === 0}>
          <Suspense>
            <MissedItems today={today} />
          </Suspense>
        </Show>

        <div class="flex flex-col gap-1">
          <Suspense>
            <For each={items()}>
              {(item) => <Item item={item} selectedDate={selectedDate()} />}
            </For>
          </Suspense>
        </div>

        <Show when={daysUntilToday() >= -1}>
          <AddItem selectedDate={selectedDate} />
        </Show>
      </div>
    );
  },
});
