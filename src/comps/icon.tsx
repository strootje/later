import { icons } from "@iconify-json/solar/icons.json" with { type: "json" };
import { cx } from "class-variance-authority";

type AllSolarIcons = keyof typeof icons;
type FilteredsolarIcons = Exclude<
  AllSolarIcons,
  | `${string}-broken`
  | `${string}-line-duotone`
  | `${string}-linear`
  | `${string}-outline`
  | `${string}-bold`
  | `${string}-bold-duotone`
>;

type SolarBrokenIcons = {
  icon: Extract<AllSolarIcons, `${string}-broken`>;
  broken: true;
};

type SolarLineIcons = {
  icon: Extract<AllSolarIcons, `${string}-linear`>;
  duotone: false;
  line: true;
};

type SolarLineDuotoneIcons = {
  icon: Extract<AllSolarIcons, `${string}-line-duotone`>;
  duotone: true;
  line: true;
};

type SolarBoldIcons = {
  icon: Extract<AllSolarIcons, `${string}-bold`>;
  duotone: false;
  bold: true;
};

type SolarBoldDuotoneIcons = {
  icon: Extract<AllSolarIcons, `${string}-bold-duotone`>;
  duotone: false;
  bold: true;
};

type SolarProps = SolarBrokenIcons | SolarLineIcons | SolarLineDuotoneIcons | SolarBoldIcons | SolarBoldDuotoneIcons;

const iconRoot = () => {
};

export const Icon = Object.assign({}, {
  Solar: (props: SolarProps) => <i class={cx("inline-block", `i-solar:${props.icon}-bold`)} />,
});
