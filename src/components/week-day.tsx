import { ComponentProps, splitProps } from "solid-js";
import { useLocale } from "./hooks/i18n.hook.ts";

type WeekDayProps = ComponentProps<"button"> & {
  date: Temporal.PlainDate;
  isSelected: boolean;
};
export const WeekDay = (props: WeekDayProps) => {
  const [local, attribs] = splitProps(props, ["date", "type"]);

  const locale = useLocale();
  const dtf = () => new Intl.DateTimeFormat(locale(), { weekday: "short" });

  return (
    <button type={local.type ?? "button"} {...attribs}>
      <div
        class="b-2 flex flex-col items-center gap-1 rounded-xl bg-orange-100 p-2 font-mono"
        classList={{ "b-stone-500": !props.isSelected, "b-lime-500": props.isSelected }}
      >
        <span>{dtf().format(props.date)}</span>
        <span>{props.date.day}</span>
      </div>
    </button>
  );
};
