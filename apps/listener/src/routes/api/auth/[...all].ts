import { defineEventHandler } from 'h3';
import { auth } from '@/auth';

export default defineEventHandler(async (event) => {
  const response = await auth.handler(event.req);

  return response;
});
