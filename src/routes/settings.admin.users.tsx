import { createCollection, useLiveQuery } from "@tanstack/solid-db";
import { createFileRoute } from "@tanstack/solid-router";
import { Index } from "solid-js";
import { createAdminUsersCollectionOptions } from "../collections/admin.users.ts";

export const Route = createFileRoute("/settings/admin/users")({
  component: () => {
    const userCollection = createCollection(createAdminUsersCollectionOptions());
    const users = useLiveQuery((p) => p.from({ user: userCollection }));

    return (
      <>
        <div>Hello "/settings/admin/users"!</div>

        <ul>
          <Index each={users.data}>{(user) => <li>{user().email}</li>}</Index>
        </ul>
      </>
    );
  },
});
