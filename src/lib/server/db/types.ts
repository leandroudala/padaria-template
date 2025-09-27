// src/lib/server/db/types.ts
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type { categories, products } from './schema';

// Inferred types from Drizzle schema
export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;

// API response types
export type CategoryWithProducts = Category & {
  products: Product[];
};

export type MenuResponse = {
  categories: CategoryWithProducts[];
};