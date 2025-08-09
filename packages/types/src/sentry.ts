import { z } from 'zod';

export const eventSchema = z.object({
  action: z.literal('created'),
  installation: z.object({
    uuid: z.uuid(),
  }),
  actor: z.object({
    type: z.literal('user'),
    id: z.number(),
    name: z.string(),
  }),
});

export const installationHookSchema = z.object({
  installation: z.object({
    app: z.object({
      uuid: z.uuid(),
      slug: z.string(),
    }),
    organization: z.object({
      slug: z.string(),
      id: z.number(),
    }),
    uuid: z.uuid(),
    status: z.literal('installed'),
  }),
});

export const errorHookSchema = z.object({
  error: z.object({
    event_id: z.string(),
    project: z.number(),
    release: z.string(),
    environment: z.string(),
  }),
});

export const installationSchema = z.object({
  id: z.coerce.number(),
  scopes: z.array(z.string()),
  expiresAt: z.coerce.date(),
  dateCreated: z.coerce.date(),
  state: z.string().nullable(),
  token: z.string(),
  refreshToken: z.string(),
  tokenLastCharacters: z.string(),
});

export function getEventSchema(resource: 'error' | 'installation') {
  switch (resource) {
    case 'error':
      return z.object({
        ...eventSchema,
        data: errorHookSchema,
      });
    case 'installation':
      return z.object({
        ...eventSchema,
        data: installationHookSchema,
      });
    default:
      throw new Error('Invalid resource');
  }
}
