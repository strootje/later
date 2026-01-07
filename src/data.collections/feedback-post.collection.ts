import { singleQueryClient } from "@strootje/more/query";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/solid-db";
import { getFeedbackPosts, upvoteFeedbackPost } from "../data.functions/feedback.service.ts";

export const feedbackPostCollection = createCollection(queryCollectionOptions({
  queryClient: singleQueryClient(),
  queryKey: ["server:feedback:posts"],
  queryFn: () => getFeedbackPosts(),
  getKey: (item) => item.id,

  onInsert: async ({ transaction }) => {
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
