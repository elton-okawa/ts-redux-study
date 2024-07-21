import { HttpResponse, delay, http } from 'msw';

import { ARTIFICIAL_DELAY_MS } from '../constants';
import type { MockDatabase } from '../db';
import { createErrorResponse } from '../helper';
import { serializeComment } from './comment';
import { serializePostDetail, serializePostSummary } from './post';
import { serializeVote } from './vote';

export function setupPostsApi(db: MockDatabase) {
  return [
    http.get('/fake-api/posts', async function ({ request }) {
      const url = new URL(request.url);
      const cursor = url.searchParams.get('cursor');
      const pageSize = url.searchParams.has('pageSize')
        ? parseInt(url.searchParams.get('pageSize')!)
        : 6;

      const posts = db.post
        .findMany({ orderBy: { createdAt: 'desc' }, take: pageSize, cursor })
        .map(serializePostSummary);
      const count = db.post.count();
      await delay(ARTIFICIAL_DELAY_MS);
      return HttpResponse.json({
        count,
        next: posts[posts.length - 1].id,
        results: posts,
      });
    }),
    http.post('/fake-api/posts', async function ({ request }) {
      const data = (await request.json()) as {
        title: string;
        content: string;
        author: string;
      };

      if (data.title === 'error') {
        await delay(ARTIFICIAL_DELAY_MS);

        return createErrorResponse('Mocked error: cannot save post', 500);
      }

      const user = db.user.findFirst({
        where: { id: { equals: data.author } },
      });
      if (!user) {
        return createErrorResponse(`User '${data.author}' not found!`, 422);
      }

      const post = db.post.create({
        ...data,
        author: user,
        createdAt: new Date().toISOString(),
      });
      await delay(ARTIFICIAL_DELAY_MS);
      return HttpResponse.json(serializePostSummary(post));
    }),

    http.get('/fake-api/posts/:postId', async function ({ params }) {
      const post = db.post.findFirst({
        where: { id: { equals: params.postId as string } },
      });
      await delay(ARTIFICIAL_DELAY_MS);

      if (!post) {
        return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      }
      return HttpResponse.json(serializePostDetail(post));
    }),

    http.patch('/fake-api/posts/:postId', async ({ request, params }) => {
      const { id, ...data } = (await request.json()) as {
        id: string;
        title: string;
        content: string;
      };
      const updatedPost = db.post.update({
        where: { id: { equals: params.postId as string } },
        data,
      });
      await delay(ARTIFICIAL_DELAY_MS);
      return HttpResponse.json(serializePostSummary(updatedPost));
    }),

    http.get('/fake-api/posts/:postId/comments', async ({ params }) => {
      const postId = params.postId as string;
      const post = db.post.findFirst({
        where: { id: { equals: postId } },
      });

      if (!post) {
        return createErrorResponse(`Post '${postId}' does not exist`, 422);
      }

      const comments = db.comment
        .findMany({
          where: { post: { id: { equals: params.postId as string } } },
        })
        .map(serializeComment);

      await delay(ARTIFICIAL_DELAY_MS);
      return HttpResponse.json(comments);
    }),

    http.post(
      '/fake-api/posts/:postId/comments',
      async ({ request, params }) => {
        const postId = params.postId as string;
        const body = (await request.json()) as {
          owner: string;
          content: string;
        };

        const post = db.post.findFirst({
          where: { id: { equals: postId } },
        });
        if (!post) {
          return createErrorResponse(`Post '${postId}' does not exist`, 422);
        }

        const owner = db.user.findFirst({
          where: { id: { equals: body.owner } },
        });
        if (!owner) {
          return createErrorResponse(
            `User '${body.owner}' does not exist`,
            422,
          );
        }

        const newComment = db.comment.create({
          owner,
          post,
          createdAt: new Date().toISOString(),
          content: body.content,
        });

        await delay(ARTIFICIAL_DELAY_MS);
        return HttpResponse.json(serializeComment(newComment));
      },
    ),

    http.get('/fake-api/posts/:postId/votes', async ({ params }) => {
      const postId = params.postId as string;
      const post = db.post.findFirst({
        where: { id: { equals: postId } },
      });

      if (!post) {
        return createErrorResponse(`Post '${postId}' does not exist`, 422);
      }

      const votes = db.vote
        .findMany({
          where: { post: { id: { equals: params.postId as string } } },
        })
        .map(serializeVote);

      await delay(ARTIFICIAL_DELAY_MS);
      return HttpResponse.json(votes);
    }),

    http.post('/fake-api/posts/:postId/votes', async ({ request, params }) => {
      const postId = params.postId as string;
      const body = (await request.json()) as { owner: string };

      const post = db.post.findFirst({
        where: { id: { equals: postId } },
      });
      if (!post) {
        return createErrorResponse(`Post '${postId}' does not exist`, 422);
      }

      const owner = db.user.findFirst({
        where: { id: { equals: body.owner } },
      });
      if (!owner) {
        return createErrorResponse(`User '${body.owner}' does not exist`, 422);
      }

      const votes = db.vote
        .findMany({
          where: { post: { id: { equals: params.postId as string } } },
        })
        .map(serializeVote);

      if (votes.find((vote) => vote.owner === owner)) {
        return createErrorResponse(`User '${owner}' already voted`, 422);
      }

      const newVote = db.vote.create({
        owner,
        post,
      });

      await delay(ARTIFICIAL_DELAY_MS);
      return HttpResponse.json(serializeVote(newVote));
    }),
  ];
}
