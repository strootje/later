import * as clientDb from "@scope/db/client";
import { type Accessor, Index, Show } from "solid-js";
import { useI18n } from "./hooks/i18n.hook.ts";
import { Swiper } from "./swiper.tsx";

type MissedItemsProps = {
  today: Accessor<Temporal.PlainDate>;
};
export const MissedItems = (props: MissedItemsProps) => {
  const t = useI18n();

  const items = clientDb.useLiveQuery(({ db }) => {
    return db.selectFrom("item")
      .where("dueAt", "<", props.today().toString())
      .selectAll();
  });

  return (
    <Show when={items()?.length}>
      <div class="perspective-near flex flex-col">
        <header class="mx-2 text-stone-500">
          <h2>{t("missed-items")}</h2>
        </header>

        <div class="transform-3d flex flex-col origin-bc rotate-x-60 gap-1">
          <Index each={items()}>
            {(item) => (
              <div class="transform-3d rotate-x-[-60deg]">
                <Swiper class="b-1 b-stone-500 mx-1 flex flex-col gap-1 rounded-xl bg-white p-2">
                  <span>{item().title}</span>
                </Swiper>
              </div>
            )}
          </Index>
        </div>
      </div>
    </Show>
  );
};
