import type { serverAuth } from "@scope/better-auth/server";
import type { InferUser } from "better-auth";
import { Avatar } from "../comps.ui/avatar.tsx";

export const UserCard = (props: { user: InferUser<typeof serverAuth> }) => {
  return (
    <article class="flex gap-1">
      <div class="aspect-square h-full rounded-xl bg-stone-300">
        <Avatar email={props.user.email} />
      </div>

      <div>
        <div>
          <span>{props.user.email}</span>
        </div>

        <div class="-mt-1 flex gap-2 text-stone-500 text-xs">
          <span>{props.user.role}</span>
          <span>{props.user.name}</span>
        </div>
      </div>
    </article>
  );
};
