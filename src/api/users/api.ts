import { HttpResponse, delay, http } from 'msw';

import { ARTIFICIAL_DELAY_MS } from '../constants';
import type { MockDatabase } from '../db';

export function setupUsersApi(db: MockDatabase) {
  return [
    http.get('/fake-api/users', async () => {
      await delay(ARTIFICIAL_DELAY_MS);
      return HttpResponse.json(db.user.getAll());
    }),

    http.get('/fake-api/users/:userId', async ({ params }) => {
      await delay(ARTIFICIAL_DELAY_MS);
      return HttpResponse.json(
        db.user.findFirst({
          where: { id: { equals: params.userId as string } },
        }),
      );
    }),
  ];
}
