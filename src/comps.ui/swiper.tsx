import { animate, press } from "motion";
import { Index, JSX, onMount, type ParentProps, splitProps } from "solid-js";

type SwiperAction = {
  action: () => Promise<void>;
  comp: JSX.Element;
};

type SwiperProps = {
  actions?: {
    left?: Array<SwiperAction>;
    right?: Array<SwiperAction>;
  };
};

export const Swiper = (props: ParentProps & SwiperProps) => {
  const [parentProps, swiperProps] = splitProps(props, ["children"]);
  let ref!: HTMLDivElement;

  onMount(() => {
    press(ref, () => {
      animate(ref, { scale: .9 });
      return () => animate(ref, { scale: 1 });
    });
  });

  return (
    <div ref={ref}>
      <Index each={swiperProps.actions?.left ?? []}>{(action) => action().comp}</Index>
      <div>{parentProps.children}</div>
      <Index each={swiperProps.actions?.right ?? []}>{(action) => action().comp}</Index>
    </div>
  );
};
