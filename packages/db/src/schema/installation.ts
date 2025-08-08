import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';

export const installations = pgTable(
  'installations',
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    sentryId: uuid().notNull(),
    organizationId: integer(),
    organizationSlug: text(),
    expiresAt: timestamp({
      withTimezone: true,
    }).notNull(),
    dateCreated: timestamp({
      withTimezone: true,
    }).notNull(),
    token: text().notNull(),
    refreshToken: text().notNull(),
  },
  (table) => [index('installations_sentry_id_idx').on(table.sentryId)]
);
