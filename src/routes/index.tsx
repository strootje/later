import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, Index } from "solid-js";
import { AppHeader } from "../components/app-header.tsx";
import { Swiper } from "../components/swiper.tsx";
import * as itemFns from "../functions/item.queries.ts";

export const Route = createFileRoute("/")({
  component: () => {
    const [selectedDate, setSelectedDate] = createSignal<Temporal.PlainDate>(Temporal.Now.plainDateISO());
    // const daysUntilToday = () => Temporal.Now.plainDateISO().until(selectedDate()).days;

    // const today = () => Temporal.Now.plainDateISO();
    // const items = clientDb.useLiveQuery(({ db }) => {
    //   return db.selectFrom("item")
    //     .where("dueAt", "=", selectedDate().toString())
    //     .selectAll();
    // });

    const addItem = async () => {
      console.log("pressed the button..");
      return await itemFns.insert(selectedDate().toString());
    };

    return (
      <div class="flex min-h-dvh flex-col gap-4">
        <AppHeader onSelectedDateChanged={setSelectedDate} />

        {
          /* <Show when={daysUntilToday() >= 0}>
          <MissedItems today={today} />
        </Show> */
        }

        <div class="flex flex-col gap-1">
          <Index each={[{ title: "testing" }]}>
            {(item) => (
              <Swiper class="b-1 b-stone-500 mx-1 flex flex-col gap-1 rounded-xl bg-white p-2">
                <span>{item().title}</span>
              </Swiper>
            )}
          </Index>
        </div>

        <button class="p-4 bg-red" type="button" onClick={addItem}>Add randon item</button>
      </div>
    );
  },
});
