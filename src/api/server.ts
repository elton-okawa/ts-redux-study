import { faker } from '@faker-js/faker';
import { setupWorker } from 'msw/browser';

import { db } from './db';
import { setupPostsApi } from './posts/api';
import { createCommentData } from './posts/comment';
import { createPostData } from './posts/post';
import { setupUsersApi } from './users/api';
import { createUserData } from './users/user';

const NUM_USERS = 3;
const POSTS_PER_USER = 3;
const COMMENTS_PER_POST = 3;

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
  return array[faker.number.int({ min: 0, max: array.length })];
}

/* MSW Data Model Setup */

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

    if (faker.number.float() > 0.5)
      db.vote.create({ owner: randomItem(authors), post });
  });
}

/* MSW REST API Handlers */

export const handlers = [...setupPostsApi(db), ...setupUsersApi(db)];

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
