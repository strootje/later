import { mergeRefs } from "@solid-primitives/refs";
import { createSignal, Index, JSX, type ParentProps, Show, splitProps } from "solid-js";

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

  const [isPressed, setPressed] = createSignal(false);
  const [startX, setStartX] = createSignal(0);
  const [curX, setCurX] = createSignal(0);

  const translateX = () => curX() - startX();
  const widthLeft = () => Math.max(0, translateX());
  const widthRight = () => Math.max(0, translateX() * -1);

  const actionWidth = () => ref.clientHeight + 8;
  const thresholdLeft = () => (swiperProps.actions?.left?.length ?? 0) * actionWidth();
  const thresholdRight = () => (swiperProps.actions?.right?.length ?? 0) * -actionWidth();

  let ref!: HTMLDivElement;

  const handleStartDrag = (e: PointerEvent) => {
    e.preventDefault();
    ref?.setPointerCapture(e.pointerId);

    if (isPressed()) {
      return;
    }

    setPressed(true);
    setStartX(e.clientX);
    setCurX(e.clientX);
  };

  const handleDragMove = (e: PointerEvent) => {
    e.preventDefault();
    setCurX(e.clientX);
  };

  const handleStopDrag = (e: PointerEvent) => {
    e.preventDefault();
    ref?.releasePointerCapture(e.pointerId);

    if (!isPressed()) {
      return;
    }

    setPressed(false);

    if (widthLeft() > Math.abs(thresholdLeft() * 2)) {
      actionWrapper(swiperProps.actions?.left?.at(0)?.action)();
    } else if (widthRight() > Math.abs(thresholdRight() * 2)) {
      actionWrapper(swiperProps.actions?.right?.at(0)?.action)();
    } else if (thresholdLeft() - translateX() < 0) {
      setCurX(thresholdLeft());
    } else if (thresholdRight() - translateX() > 0) {
      setCurX(thresholdRight());
    } else {
      setCurX(0);
    }

    setStartX(0);
  };

  const actionWrapper = (realAction?: () => Promise<void>) => {
    return async () => {
      await realAction?.();
      setCurX(0);
      setStartX(0);
    };
  };

  return (
    <div class="relative flex touch-none select-none overflow-hidden">
      <div
        class="w-full"
        style={{
          transform: `translateX(${translateX()}px)`,
          transition: isPressed() ? "" : `transform 200ms ease-out`,
        }}
        ref={mergeRefs((el) => (ref = el))}
        oncontextmenu={(e) => e.preventDefault()}
        onPointerMove={handleDragMove}
        onPointerDown={handleStartDrag}
        onpointercancel={handleStopDrag}
        onPointerUp={handleStopDrag}
      >
        {loProps.children}
      </div>

      <Show when={swiperProps.actions?.left}>
        {(actions) => (
          <div
            class="absolute left-0 flex h-full flex-row gap-2 overflow-hidden pr-2"
            style={{
              width: `${widthLeft()}px`,
              transition: isPressed() ? "" : "width 200ms ease-out",
            }}
          >
            <Index each={actions()}>
              {(action, i) => (
                <button
                  type="button"
                  onclick={actionWrapper(action().action)}
                  class="b-1 b-stone-500 aspect-square h-full rounded-full"
                  classList={{
                    "bg-white": i !== 0 || widthLeft() <= Math.abs(thresholdLeft() * 2),
                    "bg-green-500": i !== 0 || widthLeft() > Math.abs(thresholdLeft() * 2),
                  }}
                  style={{
                    scale: Math.min(1, Math.max(0, (widthLeft() - i * actionWidth()) / actionWidth())),
                    transition: isPressed() ? "" : "scale 200ms ease-out",
                    "flex-grow": i === 0 ? "1" : "0",
                  }}
                >
                  {action().comp}
                </button>
              )}
            </Index>
          </div>
        )}
      </Show>

      <Show when={swiperProps.actions?.right}>
        {(actions) => (
          <div
            class="absolute right-0 flex h-full flex-row-reverse gap-2 overflow-hidden pl-2"
            style={{
              width: `${widthRight()}px`,
              transition: isPressed() ? "" : "width 200ms ease-out",
            }}
          >
            <Index each={actions()}>
              {(action, i) => (
                <button
                  type="button"
                  onclick={actionWrapper(action().action)}
                  class="b-1 b-stone-500 aspect-square h-full rounded-full"
                  classList={{
                    "bg-white": i !== 0 || widthRight() <= Math.abs(thresholdRight() * 2),
                    "bg-green-500": i !== 0 || widthRight() > Math.abs(thresholdRight() * 2),
                  }}
                  style={{
                    scale: Math.min(1, Math.max(0, (widthRight() - i * actionWidth()) / actionWidth())),
                    transition: isPressed() ? "" : "scale 200ms ease-out",
                    "flex-grow": i === 0 ? "1" : "0",
                  }}
                >
                  {action().comp}
                </button>
              )}
            </Index>
          </div>
        )}
      </Show>
    </div>
  );
};
