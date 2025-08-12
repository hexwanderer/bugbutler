import { organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:57000',
  plugins: [organizationClient()],
  fetchOptions: {
    auth: {
      type: 'Bearer',
      token: () => localStorage.getItem('bearer_token') ?? '',
    },
  },
});
