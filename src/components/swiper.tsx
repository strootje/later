import { cx } from "class-variance-authority";
import { type JSX, type ParentProps } from "solid-js";
import { createStore, produce } from "solid-js/store";
import {} from "sqlocal";

type PointerEventHandler = JSX.EventHandler<HTMLDivElement, PointerEvent>;

type SwiperProps = ParentProps & {
  class?: string;
};
export const Swiper = (props: SwiperProps) => {
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
      startX: evt.clientX,
      finalX: evt.clientX,
      startY: evt.clientY,
      finalY: evt.clientY,
    });
  };

  const handlePointerMove: PointerEventHandler = (evt) => {
    setState(produce((draft) => {
      draft.finalX = evt.clientX;
      draft.finalY = evt.clientY;

      const deltaX = draft.finalX! - draft.startX!;
      const deltaY = draft.finalY! - draft.startY!;
      const delta = Math.hypot(deltaX, deltaY);

      if (!draft.action && delta > 16) {
        const diffXoverY = Math.abs(deltaX) > Math.abs(deltaY);
        draft.action = diffXoverY ? "panX" : "panY";
        evt.target.setPointerCapture(evt.pointerId);
      }

      if (draft.action === "panX") {
        draft.deltaX = deltaX;
      } else if (draft.action === "panY") {
        globalThis.scrollBy(0, -evt.movementY);
      }
    }));
  };

  const handlerPointerCancel: PointerEventHandler = (evt) => {
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
    <div class="overflow-hidden">
      <div
        class={cx(props.class, "touch-none select-none")}
        classList={{
          "z-1": state.isDragging,
        }}
        onContextMenu={handleContextMenu}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlerPointerCancel}
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
