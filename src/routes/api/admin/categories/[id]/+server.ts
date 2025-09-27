// src/routes/api/admin/categories/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { categories, products } from '$lib/server/db/schema';
import { requireAuth } from '$lib/server/auth';
import type { RequestHandler } from '@sveltejs/kit';

const categoryUpdateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  slug: z.string().min(1, 'Slug é obrigatório').max(255, 'Slug muito longo')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens')
});

// GET - Get single category
export const GET: RequestHandler = async (event) => {
  try {
    await requireAuth(event);
    
    const { id } = event.params;
    if (!id) {
      return json({ error: 'ID da categoria é obrigatório' }, { status: 400 });
    }
    
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    
    if (!category) {
      return json({ error: 'Categoria não encontrada' }, { status: 404 });
    }
    
    return json(category);
    
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error('Category GET error:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};

// PUT - Update category
export const PUT: RequestHandler = async (event) => {
  try {
    await requireAuth(event);
    
    const { id } = event.params;
    if (!id) {
      return json({ error: 'ID da categoria é obrigatório' }, { status: 400 });
    }
    
    const body = await event.request.json();
    const validation = categoryUpdateSchema.safeParse(body);
    
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
    
    // Check if category exists
    const [existingCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
      
    if (!existingCategory) {
      return json({ error: 'Categoria não encontrada' }, { status: 404 });
    }
    
    // Check if slug is taken by another category
    const [slugConflict] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
      
    if (slugConflict && slugConflict.id !== id) {
      return json(
        { error: 'Slug já existe. Escolha outro.' }, 
        { status: 409 }
      );
    }
    
    const [updatedCategory] = await db
      .update(categories)
      .set({ 
        name, 
        slug, 
        updated_at: new Date() 
      })
      .where(eq(categories.id, id))
      .returning();
    
    return json(updatedCategory);
    
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error('Category PUT error:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};

// DELETE - Delete category
export const DELETE: RequestHandler = async (event) => {
  try {
    await requireAuth(event);
    
    const { id } = event.params;
    if (!id) {
      return json({ error: 'ID da categoria é obrigatório' }, { status: 400 });
    }
    
    // Check if category exists
    const [existingCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
      
    if (!existingCategory) {
      return json({ error: 'Categoria não encontrada' }, { status: 404 });
    }
    
    // Check if category has products
    const [hasProducts] = await db
      .select({ count: products.id })
      .from(products)
      .where(eq(products.category_id, id))
      .limit(1);
      
    if (hasProducts) {
      return json(
        { error: 'Não é possível excluir categoria com produtos. Exclua os produtos primeiro.' }, 
        { status: 409 }
      );
    }
    
    await db
      .delete(categories)
      .where(eq(categories.id, id));
    
    return json({ message: 'Categoria excluída com sucesso' });
    
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error('Category DELETE error:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};