import { defineEventHandler } from 'h3';
import { auth } from '@/auth';

export default defineEventHandler(async ({ req, context }) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (session) {
    context.authInfo = {
      authenticated: true,
      user: session.user,
      session: session.session,
    };
  } else {
    context.authInfo = {
      authenticated: false,
      user: null,
      session: null,
    };
  }
});
