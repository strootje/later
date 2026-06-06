import { cx } from "class-variance-authority";
import { Index, type JSX, mergeProps, type ParentProps, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Button, type ButtonProps } from "./common.button.tsx";

type PointerEventHandler = JSX.EventHandler<HTMLDivElement, PointerEvent>;

type SwiperAction = {
  title: string | JSX.Element;
  action?: () => Promise<void>;
};

const defaultProps = {
  panThreshold: 8,
};

type SwiperProps = ParentProps & Partial<typeof defaultProps> & {
  actions?: {
    main?: Array<ButtonProps>;
    alt?: Array<ButtonProps>;
  };
  class?: string;
  swapMainToAlt?: boolean;
};
export const Swiper = (props: SwiperProps) => {
  const merged = mergeProps(defaultProps, props);
  const handleContextMenu: PointerEventHandler = (evt) => {
    evt.preventDefault();
  };

  const [state, setState] = createStore<{
    isDragging?: true;
    action?: "panX" | "panY";

    startX?: number;
    finalX?: number;
    deltaX?: number;

    startY?: number;
    finalY?: number;
    deltaY?: number;
  }>({});

  const handlePointerDown: PointerEventHandler = (evt) => {
    setState({
      isDragging: true,
      startX: state.startX ?? evt.clientX,
      finalX: state.finalX ?? evt.clientX,
      startY: state.startY ?? evt.clientY,
      finalY: state.finalY ?? evt.clientY,
    });
  };

  let ref: Element;

  const widthAction = () => ref.clientHeight + 4;
  const widthMainActionBar = () => (props.actions?.main?.length ?? 0) * widthAction();
  const widthAltActionBar = () => (props.actions?.alt?.length ?? 0) * widthAction();

  const widthActionBar = (deltaX: number) => {
    return deltaX > 0
      ? (props.swapMainToAlt ? widthAltActionBar() : widthMainActionBar())
      : (props.swapMainToAlt ? widthMainActionBar() : widthAltActionBar());
  };
  const inverseCorrection = (deltaX: number) => {
    return deltaX > 0 ? (props.swapMainToAlt ? -1 : 1) : (props.swapMainToAlt ? 1 : -1);
  };
  const freeMove = (deltaX: number) => {
    return Math.max(0, Math.min(Math.abs(deltaX), widthActionBar(deltaX))) * inverseCorrection(deltaX);
  };
  const restMove = (deltaX: number) => {
    return Math.sqrt(Math.abs(deltaX - freeMove(deltaX)) / 10) * inverseCorrection(deltaX);
  };

  const handlePointerMove: PointerEventHandler = (evt) => {
    setState(produce((draft) => {
      draft.finalX = evt.clientX;
      draft.finalY = evt.clientY;

      const deltaX = draft.finalX! - draft.startX!;
      const deltaY = draft.finalY! - draft.startY!;
      const delta = Math.hypot(deltaX, deltaY);

      if (!draft.action && delta > merged.panThreshold) {
        const diffXoverY = Math.abs(deltaX) > Math.abs(deltaY);
        draft.action = diffXoverY ? "panX" : "panY";
        evt.target.setPointerCapture(evt.pointerId);
      }

      if (draft.action === "panX") {
        draft.deltaX = freeMove(deltaX) + restMove(deltaX);
      } else if (draft.action === "panY") {
        globalThis.scrollBy(0, -evt.movementY);
      }
    }));
  };

  const handlePointerUp: PointerEventHandler = (evt) => {
    setState({
      isDragging: undefined,
      action: undefined,

      startX: undefined,
      finalX: undefined,
      deltaX: (Math.abs(state.deltaX!) > (widthActionBar(state.deltaX!) / 5 * 4))
        ? widthActionBar(state.deltaX!) * inverseCorrection(state.deltaX!)
        : undefined,

      startY: undefined,
      finalY: undefined,
      deltaY: undefined,
    });
  };

  const handlerPointerCancel: PointerEventHandler = () => {
    setState({
      isDragging: undefined,
      action: undefined,

      startX: undefined,
      finalX: undefined,
      deltaX: undefined,

      startY: undefined,
      finalY: undefined,
      deltaY: undefined,
    });
  };

  return (
    <div ref={(el) => ref = el} class="relative">
      <Show when={props.actions?.main}>
        {(actions) => (
          <div
            class="absolute top-0 bottom-0 mx-1 flex gap-1"
            style={{
              "flex-direction": props.swapMainToAlt ? "row-reverse" : undefined,
              left: !props.swapMainToAlt ? 0 : undefined,
              right: props.swapMainToAlt ? 0 : undefined,
            }}
          >
            <Index each={actions()}>{(action) => <Button {...action()} />}</Index>
          </div>
        )}
      </Show>

      <Show when={props.actions?.alt}>
        {(actions) => (
          <div
            class="absolute top-0 bottom-0 mx-1 flex gap-1"
            style={{
              "flex-direction": !props.swapMainToAlt ? "row-reverse" : undefined,
              left: props.swapMainToAlt ? 0 : undefined,
              right: !props.swapMainToAlt ? 0 : undefined,
            }}
          >
            <Index each={actions()}>{(action) => <Button {...action()} />}</Index>
          </div>
        )}
      </Show>

      <div
        class={cx(props.class, "touch-none select-none")}
        onContextMenu={handleContextMenu}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlerPointerCancel}
        style={{
          transform: `translate(${state.deltaX ?? 0}px, ${state.deltaY ?? 0}px)`,
          transition: state.isDragging ? "" : "transform ease-in-out 50ms",
        }}
      >
        {props.children}
      </div>
    </div>
  );
};
