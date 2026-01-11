import { passkeyClient } from "@better-auth/passkey/client";
import type { serverAuth } from "@scope/better-auth/server";
import { adminClient, inferAdditionalFields, magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/solid";

export const clientAuth = createAuthClient({
  plugins: [
    adminClient(),
    inferAdditionalFields<typeof serverAuth>(),
    magicLinkClient(),
    passkeyClient(),
  ],
});
