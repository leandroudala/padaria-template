// src/lib/server/db/seed.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { categories, products } from './schema';

// Use environment variable directly
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema: { categories, products } });

export async function seedDatabase() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await db.delete(products);
  await db.delete(categories);

  // Insert categories
  const insertedCategories = await db.insert(categories).values([
    {
      name: 'Pães',
      slug: 'paes',
    },
    {
      name: 'Doces',
      slug: 'doces',
    },
    {
      name: 'Salgados',
      slug: 'salgados',
    },
    {
      name: 'Bolos',
      slug: 'bolos',
    }
  ]).returning();

  console.log(`✓ Created ${insertedCategories.length} categories`);

  // Insert sample products
  const sampleProducts = [
    // Pães
    {
      name: 'Pão de Açúcar',
      description: 'Pão doce tradicional, macio e saboroso',
      price: '8.50',
      category_id: insertedCategories[0].id,
      image_url: '/images/pao-de-acucar.webp',
      available: true
    },
    {
      name: 'Pão Francês',
      description: 'Pãozinho tradicional, crocante por fora e macio por dentro',
      price: '0.75',
      category_id: insertedCategories[0].id,
      image_url: '/images/pao-frances.webp',
      available: true
    },
    // Doces
    {
      name: 'Brigadeiro Gourmet',
      description: 'Brigadeiro artesanal com chocolate belga',
      price: '3.50',
      category_id: insertedCategories[1].id,
      image_url: '/images/brigadeiro.webp',
      available: true
    },
    {
      name: 'Beijinho',
      description: 'Doce de coco tradicional com coco ralado',
      price: '3.50',
      category_id: insertedCategories[1].id,
      image_url: '/images/beijinho.webp',
      available: true
    },
    // Salgados
    {
      name: 'Coxinha',
      description: 'Coxinha de frango tradicional, crocante e saborosa',
      price: '6.50',
      category_id: insertedCategories[2].id,
      image_url: '/images/coxinha.webp',
      available: true
    },
    {
      name: 'Pão de Queijo',
      description: 'Pão de queijo mineiro, quentinho e saboroso',
      price: '4.50',
      category_id: insertedCategories[2].id,
      image_url: '/images/pao-de-queijo.webp',
      available: true
    },
    // Bolos
    {
      name: 'Bolo de Chocolate',
      description: 'Bolo de chocolate com cobertura cremosa',
      price: '45.00',
      category_id: insertedCategories[3].id,
      image_url: '/images/bolo-chocolate.webp',
      available: true
    }
  ];

  const insertedProducts = await db.insert(products).values(sampleProducts).returning();
  console.log(`✓ Created ${insertedProducts.length} products`);

  console.log('🎉 Database seeded successfully!');
}

// Run seed if this file is executed directly
if (import.meta.main) {
  try {
    await seedDatabase();
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await client.end();
    process.exit(1);
  }
}