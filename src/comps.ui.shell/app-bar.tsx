import { Link } from "@tanstack/solid-router";
import { Icon } from "../comps.ui/icon.tsx";

export const AppBar = () => {
  return (
    <>
      {/* <div class="invisible h-16" /> */}
      <nav class="fixed inset-[auto_0_0] col-[hero] bg-black bg-op-40 backdrop-blur">
        <ul class="flex justify-around py-1 text-2xl">
          <li>
            <Link class="inline-block px-2 py-1" activeProps={{ class: "text-brand-900" }} to="/">
              <Icon.Solar class="i-solar:check-square-bold-duotone p-2" />
            </Link>
          </li>

          <li>
            <Link class="inline-block px-2 py-1" activeProps={{ class: "text-brand-900" }} to="/settings">
              <Icon.Solar class="i-solar:settings-minimalistic-bold-duotone p-2" />
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
