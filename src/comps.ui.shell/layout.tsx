import { cva, cx, type VariantProps } from "class-variance-authority";
import { type ComponentProps, splitProps } from "solid-js";

const gridVariants = cva([
  "grid-cols-[[hero-start]_auto_[content-start]_1fr_[content-end]_auto[hero-end]]",
  "grid *:col-[content]",
], {
  variants: {
    spacing: {
      md: "gap-3",
    },
  },
  defaultVariants: {
    spacing: "md",
  },
});

const itemVariants = cva(["grid grid-cols-subgrid"], {
  variants: {
    hero: {
      true: "col-[hero]",
    },
    spacing: {
      sm: "gap-1",
      md: "gap-2",
    },
  },
  defaultVariants: {
    spacing: "md",
  },
});

const PageRoot = (props: ComponentProps<"div"> & VariantProps<typeof gridVariants>) => {
  const [gridProps, parentProps, divProps] = splitProps(props, ["spacing"], ["children", "class"]);
  return (
    <div {...divProps} class={cx("bg-yellow-300 min-h-dvh content-start", parentProps.class, gridVariants(gridProps))}>
      {parentProps.children}
    </div>
  );
};

const PageHeader = (props: ComponentProps<"header"> & VariantProps<typeof itemVariants>) => {
  const [itemProps, parentProps, headerProps] = splitProps(props, ["hero", "spacing"], ["children", "class"]);
  return (
    <header {...headerProps} class={cx("text-2xl fw-700 -mb-1", parentProps.class, itemVariants(itemProps))}>
      {parentProps.children}
    </header>
  );
};

export const Page = Object.assign(PageRoot, {
  Header: PageHeader,
});

const SectionRoot = (props: ComponentProps<"section"> & VariantProps<typeof itemVariants>) => {
  const [itemProps, parentProps, sectionProps] = splitProps(props, ["hero", "spacing"], ["children", "class"]);
  return (
    <section {...sectionProps} class={cx(parentProps.class, itemVariants(itemProps))}>{parentProps.children}</section>
  );
};

const SectionHeader = (props: ComponentProps<"header"> & VariantProps<typeof itemVariants>) => {
  const [itemProps, parentProps, headerProps] = splitProps(props, ["hero"], ["children", "class"]);
  return (
    <header {...headerProps} class={cx("text-xl fw-700 -mb-1", parentProps.class, itemVariants(itemProps))}>
      {parentProps.children}
    </header>
  );
};

export const Section = Object.assign(SectionRoot, {
  Header: SectionHeader,
});
