import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/solid-db";
import { getFeedbackPosts, upvoteFeedbackPost } from "../data.functions/feedback.service.ts";
import { useQueryClient } from "./query-client.ts";

export const feedbackPostCollection = createCollection(queryCollectionOptions({
  queryClient: useQueryClient(),
  queryKey: ["server:feedback:posts"],
  getKey: (item) => item.id,

  queryFn: async () => {
    const posts = await getFeedbackPosts();
    return posts;
  },

  onUpdate: async ({ transaction }) => {
    const { original, modified } = transaction.mutations[0];

    if (original.hasVoted !== modified.hasVoted) {
      await upvoteFeedbackPost({
        data: {
          remove: !modified.hasVoted,
          postId: modified.id,
        },
      });
    }
  },
}));
