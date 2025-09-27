// src/routes/api/menu/+server.ts
import { json } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { categories, products } from '$lib/server/db/schema';
import type { RequestHandler } from '@sveltejs/kit';
import type { CategoryWithProducts } from '$lib/server/db/types';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const categorySlug = url.searchParams.get('category');
    
    if (categorySlug) {
      // Get products for a specific category
      const category = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1);
        
      if (!category.length) {
        return json({ error: 'Categoria não encontrada' }, { status: 404 });
      }
      
      const categoryProducts = await db
        .select()
        .from(products)
        .where(and(eq(products.category_id, category[0].id), eq(products.available, true)));
        
      const result: CategoryWithProducts = {
        ...category[0],
        products: categoryProducts
      };
      
      return json(result);
    }
    
    // Get all categories with their products
    const allCategories = await db.select().from(categories);
    const allProducts = await db
      .select()
      .from(products)
      .where(eq(products.available, true));
    
    // Group products by category
    const categoriesWithProducts: CategoryWithProducts[] = allCategories.map(category => ({
      ...category,
      products: allProducts.filter(product => product.category_id === category.id)
    }));
    
    return json({ categories: categoriesWithProducts });
    
  } catch (error) {
    console.error('Menu API error:', error);
    return json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
};