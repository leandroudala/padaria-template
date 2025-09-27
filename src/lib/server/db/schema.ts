// src/lib/server/db/schema.ts
import { pgTable, text, varchar, uuid, boolean, timestamp, numeric, index, unique } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  unique_name: unique("categories_name_unique").on(table.name),
  unique_slug: unique("categories_slug_unique").on(table.slug)
}));

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category_id: uuid("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  image_url: varchar("image_url", { length: 1024 }),
  available: boolean("available").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  category_idx: index("products_category_id_idx").on(table.category_id),
  available_idx: index("products_available_idx").on(table.available)
}));
