// src/routes/api/admin/products/+server.ts
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { eq, and, desc, count } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { products, categories } from '$lib/server/db/schema';
import { requireAuth } from '$lib/server/auth';
import type { RequestHandler } from '@sveltejs/kit';

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Preço inválido. Use formato: 10.50'),
  category_id: z.string().uuid('ID da categoria deve ser um UUID válido'),
  image_url: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
  available: z.boolean().default(true)
});

// GET - List all products with optional filtering and pagination
export const GET: RequestHandler = async (event) => {
  try {
    await requireAuth(event);
    
    const url = event.url;
    const categoryId = url.searchParams.get('category_id');
    const available = url.searchParams.get('available');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    
    // Build conditions
    const conditions = [];
    if (categoryId) {
      conditions.push(eq(products.category_id, categoryId));
    }
    if (available !== null) {
      conditions.push(eq(products.available, available === 'true'));
    }
    
    const whereCondition = conditions.length === 0 ? undefined : 
      conditions.length === 1 ? conditions[0] : and(...conditions);
    
    // Get total count
    const countQueryBuilder = db.select({ count: count() }).from(products);
    const [{ count: totalCount }] = whereCondition ? 
      await countQueryBuilder.where(whereCondition) :
      await countQueryBuilder;
    
    // Get paginated results
    const queryBuilder = db.select().from(products);
    const allProducts = whereCondition ?
      await queryBuilder
        .where(whereCondition)
        .orderBy(desc(products.created_at))
        .limit(limit)
        .offset(offset) :
      await queryBuilder
        .orderBy(desc(products.created_at))
        .limit(limit)
        .offset(offset);
    
    return json({
      products: allProducts,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error('Products GET error:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};

// POST - Create new product
export const POST: RequestHandler = async (event) => {
  try {
    await requireAuth(event);
    
    const body = await event.request.json();
    const validation = productSchema.safeParse(body);
    
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
    
    const [newProduct] = await db
      .insert(products)
      .values({ 
        name, 
        description: description || null,
        price, 
        category_id, 
        image_url: image_url || null,
        available 
      })
      .returning();
    
    return json(newProduct, { status: 201 });
    
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error('Products POST error:', error);
    return json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
};