import { Show } from "solid-js";
import { useRegisterSW } from "virtual:pwa-register/solid";

export const UpdatePrompt = () => {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
  });

  return (
    <Show when={needRefresh()}>
      <div class="absolute inset-[auto_0_0_0] bg-red p-4">
        <button type="button" onClick={() => updateServiceWorker()}>worker updated, click to reload</button>
      </div>
    </Show>
  );
};
