import { db, installations } from '@workspace/db';
import env from '@workspace/env';
import { installationSchema } from '@workspace/types/sentry';
import { eventHandler, redirect } from 'h3';
import { v7 as uuidv7 } from 'uuid';
import { encrypt } from '@/utils/encrypt';

const SENTRY_INSTALL_URL = (installationId: string) =>
  `https://sentry.io/api/0/sentry-app-installations/${installationId}/authorizations/`;

const SENTRY_VERIFY_URL = (installationId: string) =>
  `https://sentry.io/api/0/sentry-app-installations/${installationId}/`;

export default eventHandler(async (event) => {
  const search = new URLSearchParams(new URL(event.req.url).search);
  const [code, installationId] = [
    search.get('code'),
    search.get('installationId'),
  ];

  if (!(code && installationId)) {
    return new Response('Not found', { status: 404 });
  }

  const response = await fetch(SENTRY_INSTALL_URL(installationId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      client_id: env.SENTRY_CLIENT_ID,
      client_secret: env.SENTRY_CLIENT_SECRET,
    }),
  });

  const responseData = await response.json();
  const { data, error } = await installationSchema.safeParseAsync(responseData);
  if (error) {
    console.error(
      `Error parsing installation data for body: ${JSON.stringify(responseData)}`
    );
    return new Response(
      `Error parsing installation data: ${JSON.stringify(error)}`,
      { status: 500 }
    );
  }

  const encryptedToken = encrypt(data.token);
  const encryptedRefreshToken = encrypt(data.refreshToken);

  await db.insert(installations).values({
    id: uuidv7(),
    sentryId: installationId,
    token: encryptedToken,
    refreshToken: encryptedRefreshToken,
    expiresAt: data.expiresAt,
    dateCreated: data.dateCreated,
  });

  await fetch(SENTRY_VERIFY_URL(installationId), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'installed',
    }),
  });

  return redirect(event, 'https://sentry.io/settings/');
});
