You are an AI backend engineer and API designer. Your task: generate a complete backend design and starter code artifacts for a SvelteKit full-stack app Menu Manager with Postgres + Drizzle ORM.

Language & scope
- Use clear technical English for code and comments. For any user-facing text (error messages, validation messages) provide Brazilian Portuguese (pt-BR).
- Output a single Markdown document that contains all deliverables listed below.

High-level requirements
- Database: PostgreSQL.
- ORM: Drizzle ORM (TypeScript) with Drizzle-compatible migration SQL (drizzle-kit style).
- Entities:
  - Category: id (UUID), name (string, unique, not-null), slug (string, unique), created_at, updated_at.
  - Product: id (UUID), name (string, not-null), description (text), price (numeric(10,2)), category_id (FK -> Category.id), image_url (string), available (boolean), created_at, updated_at.
- API routes (SvelteKit endpoints):
  - Public: `GET /api/menu` → returns menu grouped by categories with products (only available products).
  - Admin (protected via Bearer token): `GET/POST/PUT/DELETE /api/admin/categories` and `/api/admin/products`.
  - Auth: `POST /api/auth/login` (returns Bearer JWT) and `POST /api/auth/refresh` (optional).
- Authentication: Token-based Bearer using JWT (HS256). Short access token expiry (e.g., 15m) and optional refresh token. Admin credentials may be seeded via ENV or admin user table (agent may propose one).
- Validation: Use Zod for request payload validation. Return clear error payloads in pt-BR.

Deliverables (must appear in the Markdown document)
1. **Pages / Routes mapping** — list SvelteKit routes and what each does (public vs admin).
2. **Drizzle schema file** (`schema.ts`) — full TypeScript code using drizzle-orm types for both tables (with indexes and FK constraints).
3. **Migration SQL** — `001_init.sql` with CREATE TABLE statements, constraints, and indexes.
4. **SvelteKit endpoint skeletons** — TypeScript skeleton files for each route showing imports, validation, DB calls, auth middleware usage, and example responses.
5. **Auth middleware** — `lib/auth.ts` snippet to verify Bearer JWT, attach `user` to `locals`, and guard admin endpoints.
6. **API contract JSON** — machine-readable JSON object named `api_contract` listing routes, HTTP methods, request schemas, sample request bodies, sample responses (success and error), status codes, and Content-Type.
7. **OpenAPI (minimal)** — a short OpenAPI / Swagger fragment covering the main endpoints (`/api/menu`, `/api/admin/products`, `/api/admin/categories`, `/api/auth/login`).
8. **Environment variables** — list required env names and example values (e.g., `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`).
9. **Testing & migration notes** — example unit/integration test ideas, and how to run migrations.
10. **Security & performance checklist** — bullets: SQL injection, XSS, CORS, rate limiting, input validation, pagination, indexes, transactions, image upload approach, CSRF for form endpoints (if any).
11. **Sample curl/Postman examples** — at least for `GET /api/menu` and `POST /api/admin/products` (with Authorization header).
12. **Extras (recommended)** — image upload strategy (signed S3/MinIO URLs), pagination/filtering for products, soft deletes vs hard deletes, audit fields, and database seeding.

Formatting & rules
- Return **one Markdown document** only.
- Include all code blocks (TypeScript/SQL/JSON/YAML) properly fenced.
- The `api_contract` JSON must be a top-level pretty-printed code block named and valid JSON.
- Use placeholder values for secrets and phone numbers, but real-looking examples (`+55` for Brazil).
- Keep file paths and filenames explicit (e.g., `src/routes/api/menu/+server.ts`, `src/lib/db.ts`, `prisma/seed.ts` — use drizzle equivalents).
- Be pragmatic: prefer secure defaults (e.g., password hashing, JWT with secret from env, parameterized queries).
- Avoid external network calls in generated code; provide instructions instead.

Return the document now.

# Pages / Routes mapping (Sveltekit)
Public
- GET  /api/menu                      -> list categories with embedded products (only available:true)
- GET  /api/menu/:category_slug       -> products for a specific category (optional)

Auth
- POST /api/auth/login                -> take admin email+password, return { accessToken, refreshToken? }
- POST /api/auth/refresh              -> exchange refresh token for new access token (optional)
- POST /api/auth/logout               -> revoke refresh token (optional)

Admin (requires Bearer token)
- GET    /api/admin/categories        -> list categories
- POST   /api/admin/categories        -> create category
- PUT    /api/admin/categories/:id    -> update category
- DELETE /api/admin/categories/:id    -> delete category

- GET    /api/admin/products          -> list products (with pagination/filter)
- POST   /api/admin/products          -> create product
- PUT    /api/admin/products/:id      -> update product
- DELETE /api/admin/products/:id      -> delete product

# Drizzle schema file (schema.ts)
```typescript
// src/db/schema.ts
import { pgTable, serial, text, varchar, uuid, boolean, timestamp, numeric } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => {
  return {
    unique_name: table.unique("unique_name", ["name"]),
    unique_slug: table.unique("unique_slug", ["slug"])
  }
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category_id: uuid("category_id").notNull().references(() => categories.id, { onDelete: "CASCADE" }),
  image_url: varchar("image_url", { length: 1024 }),
  available: boolean("available").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

```