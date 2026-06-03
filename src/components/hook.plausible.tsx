import { init, type PlausibleConfig } from "@plausible-analytics/tracker";
import { ClientOnly } from "@tanstack/solid-router";
import { onMount } from "solid-js";

const PlausibleInit = (props: PlausibleConfig) => {
  onMount(() => init(props));
  return null;
};

export const Plausible = {
  Init: (props: PlausibleConfig) => (
    <ClientOnly>
      <PlausibleInit {...props} />
    </ClientOnly>
  ),
};
