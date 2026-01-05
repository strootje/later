import { createMiddleware, createServerFn } from "@tanstack/solid-start";
import * as v from "valibot";
import { getUserMiddleware } from "./user.service.ts";

const getFeedbackUserMiddleware = createMiddleware().middleware([
  getUserMiddleware,
]).server(async ({
  context: { user },
  next,
}) => {
  const resp = await fetch("https://feedback.strooware.nl/api/v1/users", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": "Bearer 1Wfz1xfqff2GXEkhwCekzStehPwIJpDLDvPDV6Ht0XLXyh5AMHb0NZu9KcU4tmBk",
    },
    body: JSON.stringify({
      name: user.email,
      email: user.email,
      reference: user.id,
    }),
  });

  if (!resp.ok) {
    throw "auth not oke..";
  }

  const { id: feedbackUserId } = await resp.json() as { id: number };

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
  const query = new URLSearchParams({
    tags: "app-later",
  });

  const resp = await fetch(`https://feedback.strooware.nl/api/v1/posts?${query.toString()}`, {
    headers: {
      "content-type": "application/json",
      "authorization": "Bearer 1Wfz1xfqff2GXEkhwCekzStehPwIJpDLDvPDV6Ht0XLXyh5AMHb0NZu9KcU4tmBk",
      "X-Fider-UserID": `${feedbackUserId}`,
    },
  });

  if (!resp.ok) {
    throw "error..";
  }

  return await resp.json() as Array<{
    id: number;
    number: number;
    title: string;
    hasVoted: boolean;
    votesCount: number;
    user: {
      id: number;
      name: string;
      role: string;
    };
  }>;
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
  const resp = await fetch(`https://feedback.strooware.nl/api/v1/posts`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": "Bearer 1Wfz1xfqff2GXEkhwCekzStehPwIJpDLDvPDV6Ht0XLXyh5AMHb0NZu9KcU4tmBk",
      "X-Fider-UserID": `${feedbackUserId}`,
    },
    body: JSON.stringify(post),
  });

  if (!resp.ok) {
    throw "error;..";
  }

  const newPost = await resp.json() as {
    id: number;
    number: number;
    title: string;
    slug: string;
  };

  const tagResp = await fetch(`https://feedback.strooware.nl/api/v1/posts/${newPost.id}/tags/app-later`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": "Bearer 1Wfz1xfqff2GXEkhwCekzStehPwIJpDLDvPDV6Ht0XLXyh5AMHb0NZu9KcU4tmBk",
      "X-Fider-UserID": `${feedbackUserId}`,
    },
  });

  if (!tagResp.ok) {
    throw "error for tag..";
  }

  return newPost;
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
  const resp = await fetch(`https://feedback.strooware.nl/api/v1/posts/${postId}/votes`, {
    method: remove ? "DELETE" : "POST",
    headers: {
      "content-type": "application/json",
      "authorization": "Bearer 1Wfz1xfqff2GXEkhwCekzStehPwIJpDLDvPDV6Ht0XLXyh5AMHb0NZu9KcU4tmBk",
      "X-Fider-UserID": `${feedbackUserId}`,
    },
  });

  if (!resp.ok) {
    throw "error";
  }
});
