import { z } from 'zod';

export const eventSchema = z.object({
  message: z.string(),
  level: z.enum(['info', 'warning', 'error']),
  timestamp: z.number(),
});
