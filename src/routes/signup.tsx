import { clientAuth } from "@scope/better-auth/client";
import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/signup")({
  component: () => {
    return (
      <>
        <div>Hello "/signup"!</div>

        <button
          type="button"
          onclick={() => {
            clientAuth.signIn.magicLink({
              email: "bas@strootje.com",
            });
          }}
        >
          signup
        </button>
      </>
    );
  },
});
