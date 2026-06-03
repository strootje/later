import * as clientDb from "@scope/db/client";
import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, Index, Show, Suspense } from "solid-js";
import { AppHeader } from "../components/app.header.tsx";
import { MissedItems } from "../components/app.missed-items.tsx";
import { Swiper } from "../components/common.swiper.tsx";
import * as itemFns from "../functions/item.queries.ts";

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

    const addItem = async () => {
      console.log("pressed the button..");
      return await itemFns.insert(selectedDate().toString());
    };

    return (
      <div class="flex min-h-dvh flex-col gap-4 bg-pink-50">
        <AppHeader onSelectedDateChanged={setSelectedDate} />

        <Suspense>
          <Show when={daysUntilToday() >= 0}>
            <MissedItems today={today} />
          </Show>
        </Suspense>

        <div class="flex flex-col gap-1">
          <Suspense>
            <Index each={items()}>
              {(item) => (
                <Swiper class="b-1 b-stone-500 mx-1 flex flex-col gap-1 rounded-xl bg-white p-2">
                  <span>{item().title}</span>
                </Swiper>
              )}
            </Index>
          </Suspense>
        </div>

        <button class="p-4 bg-red" type="button" onClick={addItem}>Add randon item</button>
      </div>
    );
  },
});
