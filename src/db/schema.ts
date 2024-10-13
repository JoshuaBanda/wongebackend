import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const shopTable = pgTable('shoptable', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    price: integer('price').notNull(),
    description: text('description').notNull(),
    type: text('type').notNull(),
    whatsappMessage: text('whatsappMessage').notNull(),

    // Photo fields
    photoId: serial('photoId').notNull(), // Unique ID for each photo
    publicId: text('publicId'), // Public ID of the photo
    url: text('url').notNull(), // URL of the photo
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});

// Types for inserts and selects
export type insertShop = typeof shopTable.$inferInsert;
export type selectShop = typeof shopTable.$inferSelect;
