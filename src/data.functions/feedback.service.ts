import { createFiderClient } from "@strootje/fider-api";
import { createMiddleware, createServerFn, createServerOnlyFn } from "@tanstack/solid-start";
import * as v from "valibot";
import { getUserMiddleware } from "./user.service.ts";

const appTag = "app-later";
const fider = createServerOnlyFn(() => {
  if (!import.meta.env.VITE_FIDER_API_TOKEN) {
    throw `[src/data.functions/feedback.service] ::: missing VITE_FIDER_API_TOKEN`;
  }

  return createFiderClient({
    baseUri: "https://feedback.strooware.nl",
    token: import.meta.env.VITE_FIDER_API_TOKEN,
  });
});

const getFeedbackUserMiddleware = createMiddleware().middleware([
  getUserMiddleware,
]).server(async ({
  context: { user },
  next,
}) => {
  const { id: feedbackUserId } = await fider().users.create({
    email: user.email,
    name: user.email,
    reference: user.id,
  });

  return next({
    context: {
      feedbackUserId,
    },
  });
});

export const getFeedbackPosts = createServerFn().middleware([
  getFeedbackUserMiddleware,
]).handler(async ({
  context: { feedbackUserId },
}) => {
  return await fider().as(feedbackUserId).posts.list({
    tags: [appTag],
  });
});

export const addFeedbackPost = createServerFn().inputValidator(v.object({
  title: v.string(),
  tags: v.optional(v.array(v.string()), []),
})).middleware([
  getFeedbackUserMiddleware,
]).handler(async ({
  context: { feedbackUserId },
  data: post,
}) => {
  const newPost = await fider().as(feedbackUserId).posts.create({
    title: post.title,
  });

  if (newPost.isErr()) {
    throw newPost.error;
  }

  await fider().as(feedbackUserId).posts(newPost.value.id).addTag({
    tag: appTag,
  });

  return newPost.value;
});

export const upvoteFeedbackPost = createServerFn().inputValidator(v.object({
  remove: v.optional(v.boolean(), false),
  postId: v.number(),
})).middleware([
  getFeedbackUserMiddleware,
]).handler(async ({
  context: { feedbackUserId },
  data: { remove, postId },
}) => {
  if (remove) {
    await fider().as(feedbackUserId).posts(postId).removeVote({});
  } else {
    await fider().as(feedbackUserId).posts(postId).addVote({});
  }
});
