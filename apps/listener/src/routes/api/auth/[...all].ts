import { defineEventHandler, setCookie } from 'h3';
import { auth } from '@/auth';

export default defineEventHandler(async (event) => {
  const response = await auth.handler(event.req);
  if (
    event.req.url.endsWith('/sign-in') ||
    event.req.url.endsWith('/sign-up')
  ) {
    setCookie(event, 'bugbutler.session_token', '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
    });
  }

  return response;
});
