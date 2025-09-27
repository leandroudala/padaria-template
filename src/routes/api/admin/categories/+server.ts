// src/routes/api/admin/categories/+server.ts
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { categories } from '$lib/server/db/schema';
import { requireAuth } from '$lib/server/auth';
import type { RequestHandler } from '@sveltejs/kit';

const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  slug: z.string().min(1, 'Slug é obrigatório').max(255, 'Slug muito longo')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens')
});

// GET - List all categories
export const GET: RequestHandler = async (event) => {
  try {
    await requireAuth(event);
    
    const allCategories = await db.select().from(categories);
    return json(allCategories);
    
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error('Categories GET error:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};

// POST - Create new category
export const POST: RequestHandler = async (event) => {
  try {
    await requireAuth(event);
    
    const body = await event.request.json();
    const validation = categorySchema.safeParse(body);
    
    if (!validation.success) {
      return json(
        { 
          error: 'Dados inválidos', 
          details: validation.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      );
    }
    
    const { name, slug } = validation.data;
    
    // Check if slug already exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
      
    if (existingCategory.length > 0) {
      return json(
        { error: 'Slug já existe. Escolha outro.' }, 
        { status: 409 }
      );
    }
    
    const [newCategory] = await db
      .insert(categories)
      .values({ name, slug })
      .returning();
    
    return json(newCategory, { status: 201 });
    
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error('Categories POST error:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};