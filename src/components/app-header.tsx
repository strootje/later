import { makePersisted } from "@solid-primitives/storage";
import { createEffect, createSignal, Index, on } from "solid-js";
import { useI18n, useLocale } from "./hooks/i18n.hook.ts";
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
        <button class="p-2" type="button" onClick={() => setOffset((val) => val - 1)}>
          <div class="b-2 b-stone-500 flex items-center gap-1 rounded-xl bg-orange-100 p-2">
            <i class="i-solar:alt-arrow-left-outline v-middle inline-block text-2xl" />
            <span class="sr-only">{t("header.previous")}</span>
          </div>
        </button>

        <button class="p-2" type="button" onClick={() => setOffset(0)}>
          <div class="b-2 b-stone-500 flex items-center gap-1 rounded-xl bg-orange-100 p-2">
            <i class="i-solar:calendar-outline v-middle inline-block text-xl" />
            <span>{rtf().format(offset(), "days")}</span>
          </div>
        </button>

        <button class="p-2" type="button" onClick={() => setOffset((val) => val + 1)}>
          <div class="b-2 b-stone-500 flex items-center gap-1 rounded-xl bg-orange-100 p-2">
            <i class="i-solar:alt-arrow-right-outline v-middle inline-block text-2xl" />
            <span class="sr-only">{t("header.next")}</span>
          </div>
        </button>
      </nav>

      <nav class="flex justify-around">
        <Index each={weekDays()}>
          {(offset) => (
            <WeekDay
              date={selectedDate().add(offset())}
              isSelected={offset().days === 0}
              onClick={() => setOffset((val) => val + offset().days)}
            />
          )}
        </Index>
      </nav>
    </header>
  );
};
