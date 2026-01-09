import { animate, press } from "motion";
import { Index, JSX, onMount, type ParentProps, splitProps } from "solid-js";

type SwiperAction = {
  action?: () => Promise<void>;
  comp: JSX.Element;
};

type SwiperProps = {
  actions?: {
    left?: Array<SwiperAction>;
    right?: Array<SwiperAction>;
  };
};

export const Swiper = (props: ParentProps & SwiperProps) => {
  const [loProps, swiperProps] = splitProps(props, ["children"]);
  let ref!: HTMLDivElement;

  onMount(() => {
    press(ref, () => {
      animate(ref, { scale: .9 });
      return () => animate(ref, { scale: 1 });
    });
  });

  return (
    <div ref={ref} class="flex overflow-hidden">
      <div style={{ width: 0 }}>
        <Index each={swiperProps.actions?.left ?? []}>{(action) => action().comp}</Index>
      </div>

      <div class="w-full">
        {loProps.children}
      </div>

      <div style={{ width: 0 }}>
        <Index each={swiperProps.actions?.right ?? []}>{(action) => action().comp}</Index>
      </div>
    </div>
  );
};
