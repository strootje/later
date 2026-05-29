import * as clientDb from "@scope/db/client";
import { type Accessor, Index, Show } from "solid-js";

type MissedItemsProps = {
  today: Accessor<Temporal.PlainDate>;
};
export const MissedItems = (props: MissedItemsProps) => {
  const items = clientDb.useLiveQuery(({ db }) => {
    return db.selectFrom("item")
      .where("dueAt", "<", props.today().toString())
      .selectAll();
  });

  return (
    <Show when={items()?.length}>
      <div class="b-1 b-stone-500 mx-2 flex flex-col gap-2 rounded-xl p-2">
        <header>
          <h2>Missed Items:</h2>
        </header>

        <Index each={items()}>
          {(item) => (
            <div class="b-1 b-stone-500 mx-1 flex flex-col gap-1 rounded-xl p-2">
              <span>{item().title}</span>
            </div>
          )}
        </Index>
      </div>
    </Show>
  );
};
