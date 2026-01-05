import { useLiveQuery } from "@tanstack/solid-db";
import { createFileRoute } from "@tanstack/solid-router";
import { Index } from "solid-js";
import { Page, Section } from "../comps/layout.tsx";
import { adminUserCollection } from "../data.collections/admin.users.ts";

export const Route = createFileRoute("/settings/admin/users")({
  component: () => {
    const users = useLiveQuery((p) => p.from({ user: adminUserCollection }));

    return (
      <Page>
        <Page.Header>
          <h1>&lt; Users</h1>
        </Page.Header>

        <Section>
          <Index each={users.data}>{(user) => <UserItem user={user()} />}</Index>
        </Section>
      </Page>
    );
  },
});

type UserItemProps = { user: { name: string; email: string; role?: string } };
const UserItem = (props: UserItemProps) => {
  return (
    <article>
      <div>
        <span>{props.user.email}</span>
      </div>

      <div class="-mt-1 flex gap-2 text-stone-500 text-xs">
        <span>{props.user.role}</span>
        <span>{props.user.name}</span>
      </div>
    </article>
  );
};
