import * as clientDb from "@scope/db/client";
import { type Accessor, For, Show } from "solid-js";
import { Item } from "./app.item.tsx";
import { useI18n } from "./hook.i18n.ts";

type MissedItemsProps = {
  today: Accessor<Temporal.PlainDate>;
};
export const MissedItems = (props: MissedItemsProps) => {
  const t = useI18n();

  const items = clientDb.useLiveQuery(({ db }) => {
    return db.selectFrom("item")
      .where("dueAt", "<", props.today().toString())
      .where("completedAt", "is", null)
      .selectAll();
  });

  return (
    <Show when={items()?.length}>
      <div class="perspective-near flex flex-col">
        <header class="mx-2 font-mono text-sm text-stone-500 uppercase">
          <h2>{t("missed-items")}</h2>
        </header>

        <div class="transform-3d flex flex-col origin-bc gap-1">
          <For each={items()}>
            {(item) => <Item item={item} selectedDate={props.today()} />}
          </For>
        </div>
      </div>
    </Show>
  );
};
