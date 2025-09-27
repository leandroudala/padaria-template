// src/routes/api/admin/products/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { products, categories } from '$lib/server/db/schema';
import { requireAuth } from '$lib/server/auth';
import type { RequestHandler } from '@sveltejs/kit';

const productUpdateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Preço inválido. Use formato: 10.50'),
  category_id: z.string().uuid('ID da categoria deve ser um UUID válido'),
  image_url: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
  available: z.boolean().default(true)
});

// GET - Get single product
export const GET: RequestHandler = async (event) => {
  try {
    await requireAuth(event);
    
    const { id } = event.params;
    if (!id) {
      return json({ error: 'ID do produto é obrigatório' }, { status: 400 });
    }
    
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    
    if (!product) {
      return json({ error: 'Produto não encontrado' }, { status: 404 });
    }
    
    return json(product);
    
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error('Product GET error:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};

// PUT - Update product
export const PUT: RequestHandler = async (event) => {
  try {
    await requireAuth(event);
    
    const { id } = event.params;
    if (!id) {
      return json({ error: 'ID do produto é obrigatório' }, { status: 400 });
    }
    
    const body = await event.request.json();
    const validation = productUpdateSchema.safeParse(body);
    
    if (!validation.success) {
      return json(
        { 
          error: 'Dados inválidos', 
          details: validation.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      );
    }
    
    const { name, description, price, category_id, image_url, available } = validation.data;
    
    // Check if product exists
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
      
    if (!existingProduct) {
      return json({ error: 'Produto não encontrado' }, { status: 404 });
    }
    
    // Verify category exists
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, category_id))
      .limit(1);
      
    if (!category) {
      return json(
        { error: 'Categoria não encontrada' }, 
        { status: 400 }
      );
    }
    
    const [updatedProduct] = await db
      .update(products)
      .set({ 
        name, 
        description: description || null,
        price, 
        category_id, 
        image_url: image_url || null,
        available,
        updated_at: new Date() 
      })
      .where(eq(products.id, id))
      .returning();
    
    return json(updatedProduct);
    
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error('Product PUT error:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};

// DELETE - Delete product
export const DELETE: RequestHandler = async (event) => {
  try {
    await requireAuth(event);
    
    const { id } = event.params;
    if (!id) {
      return json({ error: 'ID do produto é obrigatório' }, { status: 400 });
    }
    
    // Check if product exists
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
      
    if (!existingProduct) {
      return json({ error: 'Produto não encontrado' }, { status: 404 });
    }
    
    await db
      .delete(products)
      .where(eq(products.id, id));
    
    return json({ message: 'Produto excluído com sucesso' });
    
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error('Product DELETE error:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};