import { makePersisted } from "@solid-primitives/storage";
import { createEffect, createSignal, Index, on } from "solid-js";
import { Button } from "./common.button.tsx";
import { useI18n, useLocale } from "./hook.i18n.ts";
import { WeekDay } from "./week-day.tsx";

type AppHeaderProps = {
  onSelectedDateChanged: (selectedDate: Temporal.PlainDate) => void;
};
export const AppHeader = (props: AppHeaderProps) => {
  const t = useI18n();
  const locale = useLocale();

  const [offset, setOffset] = makePersisted(createSignal(0));
  const rtf = () => new Intl.RelativeTimeFormat(locale(), { numeric: "auto" });

  const offsetAsDuration = () => Temporal.Duration.from({ days: offset() });
  const selectedDate = () => Temporal.Now.plainDateISO().add(offsetAsDuration());
  const offsetToMonday = () => Temporal.Duration.from({ days: -(selectedDate().dayOfWeek - 1) });

  const weekDays = () => {
    return Array(7).fill(0)
      .map((_, i) => Temporal.Duration.from({ days: i }))
      .map((dur) => offsetToMonday().add(dur));
  };

  createEffect(on(() => selectedDate(), (selectedDate) => {
    props.onSelectedDateChanged(selectedDate);
  }));

  return (
    <header class="flex flex-col gap-1">
      <nav class="flex justify-center">
        <Button class="p-1" onClick={() => setOffset((val) => val - 1)}>
          <div class="b-2 b-stone-200 flex items-center gap-1 rounded-xl bg-white p-2">
            <i class="i-solar:alt-arrow-left-outline v-middle inline-block text-2xl" />
            <span class="sr-only">{t("header.previous")}</span>
          </div>
        </Button>

        <Button class="min-w-2/5 p-1" onClick={() => setOffset(0)}>
          <div class="b-2 b-stone-200 flex items-center justify-center gap-1 rounded-xl bg-white p-2">
            <i class="i-solar:calendar-outline v-middle inline-block text-xl" />
            <span>{rtf().format(offset(), "days")}</span>
          </div>
        </Button>

        <Button class="p-1" onClick={() => setOffset((val) => val + 1)}>
          <div class="b-2 b-stone-200 flex items-center gap-1 rounded-xl bg-white p-2">
            <i class="i-solar:alt-arrow-right-outline v-middle inline-block text-2xl" />
            <span class="sr-only">{t("header.next")}</span>
          </div>
        </Button>
      </nav>

      <nav class="flex justify-around">
        <Index each={weekDays()}>
          {(duration) => (
            <WeekDay
              date={selectedDate().add(duration())}
              isSelected={duration().days === 0}
              isToday={duration().add({ days: offset() }).days === 0}
              onClick={() => setOffset((val) => val + duration().days)}
            />
          )}
        </Index>
      </nav>
    </header>
  );
};
