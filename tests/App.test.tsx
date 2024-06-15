import { render, screen } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { SetupServerApi, setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

import App from '@/src/App';

describe('App - e2e test', () => {
  let mock: SetupServerApi;

  beforeAll(() => {
    mock = setupServer();
    mock.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    mock.resetHandlers();
  });

  afterAll(() => {
    mock.close();
  });

  test('should render empty list correctly', async () => {
    mock.use(http.get('/api/users', () => HttpResponse.json({ data: [] })));

    render(<App />);

    expect(screen.getByText('Hello world!')).toBeInTheDocument();
  });
});
