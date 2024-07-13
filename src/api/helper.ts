import { HttpResponse } from 'msw';

export function createErrorResponse(message: string, status: number) {
  return new HttpResponse(JSON.stringify({ message, statusCode: status }), {
    status,
  });
}
