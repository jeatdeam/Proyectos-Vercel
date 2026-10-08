import { boolean, index, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const votaciones = pgTable(
  'votaciones',
  {
    id: serial('id').primaryKey(),
    opcion: text('opcion').notNull(),
    fecha: timestamp('fecha', { withTimezone: true }).notNull().defaultNow(),
    ipUsuario: text('ip_usuario').notNull(),
  },
  (table) => [
    index('votaciones_opcion_idx').on(table.opcion),
    index('votaciones_ip_fecha_idx').on(table.ipUsuario, table.fecha),
  ],
)

export const creators = pgTable('creators', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  handle: text('handle').notNull(),
  avatarUrl: text('avatar_url').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const votes = pgTable('votes', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  creatorId: integer('creator_id').notNull(),
  wantsToAttend: boolean('wants_to_attend').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
