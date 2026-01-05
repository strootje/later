import { FliptClient } from "@flipt-io/flipt";
import { createServerFn } from "@tanstack/solid-start";

const namespaceKey = "later";

let client: FliptClient;
const useClient = () => {
  return client ??= new FliptClient({
    url: "https://flags.strooware.nl",
    //   headers: {
    //     "X-Flipt-Environment": "development",
    //   },
  });
};

export const getSignupWaitinglistFlag = createServerFn().handler(async () => {
  const result = await useClient().evaluation.boolean({
    flagKey: "ops-signup-waitinglist",
    entityId: "",
    context: {},
    namespaceKey,
  });

  return result.enabled;
});
