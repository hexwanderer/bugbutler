import type { sessions, users } from './auth.schema';

export type Session = typeof sessions.$inferSelect;

export type User = typeof users.$inferSelect;
