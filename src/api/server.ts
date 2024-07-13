import { faker } from '@faker-js/faker';
import { factory } from '@mswjs/data';
import { HttpResponse, http } from 'msw';
import { setupWorker } from 'msw/browser';

import { commentModel, createCommentData, serializeComment } from './comment';
import { createErrorResponse } from './helper';
import {
  Post,
  createPostData,
  postModel,
  serializePostDetail,
  serializePostSummary,
} from './post';
import { createUserData, userModel } from './user';
import { serializeVote, voteModel } from './vote';

const NUM_USERS = 3;
const POSTS_PER_USER = 3;
const COMMENTS_PER_POST = 3;

// Add an extra delay to all endpoints, so loading spinners show up.
const ARTIFICIAL_DELAY_MS = 2000;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* RNG setup */

// Set up a seeded random number generator, so that we get
// a consistent set of users / entries each time the page loads.
// This can be reset by deleting this localStorage value,
// or turned off by setting `useSeededRNG` to false.
const useSeededRNG = true;

if (useSeededRNG) {
  let randomSeedString = localStorage.getItem('randomTimestampSeed');
  let seedDate;

  if (randomSeedString) {
    seedDate = new Date(randomSeedString);
  } else {
    seedDate = new Date();
    randomSeedString = seedDate.toISOString();
    localStorage.setItem('randomTimestampSeed', randomSeedString);
  }

  faker.seed(seedDate.getTime());
}

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/* MSW Data Model Setup */

export const db = factory({
  user: userModel,
  post: postModel,
  comment: commentModel,
  vote: voteModel,
});

const authors = Array.from({ length: NUM_USERS }).map(() =>
  db.user.create(createUserData()),
);
for (const author of authors) {
  Array.from({ length: POSTS_PER_USER }).map(() => {
    const post = db.post.create(createPostData({ author }));
    Array.from({ length: COMMENTS_PER_POST }).map(() => {
      return db.comment.create(
        createCommentData({ owner: randomItem(authors), post: post as any }),
      );
    });

    if (Math.random() > 0.5)
      db.vote.create({ owner: randomItem(authors), post });
  });
}

/* MSW REST API Handlers */

export const handlers = [
  http.get('/fake-api/posts', async function () {
    const posts = db.post.getAll().map(serializePostSummary);
    await delay(ARTIFICIAL_DELAY_MS);
    return HttpResponse.json(posts);
  }),
  http.post('/fake-api/posts', async function ({ request }) {
    const data = (await request.json()) as {
      title: string;
      content: string;
      author: string;
    };

    if (Math.random() >= 0.5) {
      await delay(ARTIFICIAL_DELAY_MS);

      return createErrorResponse('Server error saving this post!', 500);
    }

    const user = db.user.findFirst({ where: { id: { equals: data.author } } });
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

  http.post('/fake-api/posts/:postId/comments', async ({ request, params }) => {
    const postId = params.postId as string;
    const body = (await request.json()) as { owner: string; content: string };

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

    const newComment = db.comment.create({
      owner,
      post,
      createdAt: new Date().toISOString(),
      content: body.content,
    });

    await delay(ARTIFICIAL_DELAY_MS);
    return HttpResponse.json(serializeComment(newComment));
  }),

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

  http.get('/fake-api/users', async () => {
    await delay(ARTIFICIAL_DELAY_MS);
    return HttpResponse.json(db.user.getAll());
  }),
];

export const worker = setupWorker(...handlers);
console.log(worker.listHandlers()); // Optional: nice for debugging to see all available route handlers that will be intercepted

/* Mock Websocket Setup */

// const socketServer = new MockSocketServer('ws://localhost');

// let currentSocket;

// const sendMessage = (socket, obj) => {
//   socket.send(JSON.stringify(obj));
// };

// // Allow our UI to fake the server pushing out some notifications over the websocket,
// // as if other users were interacting with the system.
// const sendRandomNotifications = (socket, since) => {
//   const numNotifications = getRandomInt(1, 5);

//   const notifications = generateRandomNotifications(
//     since,
//     numNotifications,
//     db,
//   );

//   sendMessage(socket, { type: 'notifications', payload: notifications });
// };

// export const forceGenerateNotifications = (since) => {
//   sendRandomNotifications(currentSocket, since);
// };

// socketServer.on('connection', (socket) => {
//   currentSocket = socket;

//   socket.on('message', (data) => {
//     const message = JSON.parse(data);

//     switch (message.type) {
//       case 'notifications': {
//         const since = message.payload;
//         sendRandomNotifications(socket, since);
//         break;
//       }
//       default:
//         break;
//     }
//   });
// });
