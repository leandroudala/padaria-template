<!-- src/lib/components/Menu.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { siteContent } from '$lib/content';
  
  const { menu: menuContent } = siteContent;
  
  interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    categoryId: string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  interface Category {
    id: string;
    name: string;
    description: string | null;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    products: Product[];
  }
  
  interface MenuResponse {
    categories: Category[];
  }
  
  let categories = $state<Category[]>([]);
  let loading = $state(true);
  let error = $state(false);
  
  async function loadMenu() {
    try {
      loading = true;
      error = false;
      
      const response = await fetch('/api/menu');
      if (!response.ok) {
        throw new Error('Failed to fetch menu');
      }
      
      const data = await response.json() as MenuResponse;
      categories = data.categories || [];
    } catch (err) {
      console.error('Error loading menu:', err);
      error = true;
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    loadMenu();
  });
  
  function formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }
</script>

<section id="menu" class="py-20 bg-gradient-to-b from-white to-amber-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <div class="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
        Cardápio
      </div>
      
      <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
        {menuContent.title}
      </h2>
      
      <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
        {menuContent.subtitle}
      </p>
      
      <p class="text-lg text-gray-500 max-w-2xl mx-auto">
        {menuContent.description}
      </p>
    </div>
    
    <!-- Loading State -->
    {#if loading}
      <div class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600"></div>
        <span class="ml-4 text-lg text-gray-600">{siteContent.common.loading}</span>
      </div>
    
    <!-- Error State -->
    {:else if error}
      <div class="text-center py-20">
        <div class="max-w-md mx-auto">
          <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{siteContent.common.error}</h3>
          <p class="text-gray-600 mb-4">Não foi possível carregar nosso cardápio no momento.</p>
          <button 
            onclick={loadMenu}
            class="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {siteContent.common.tryAgain}
          </button>
        </div>
      </div>
    
    <!-- Menu Content -->
    {:else if categories.length > 0}
      <div class="space-y-16">
        {#each categories as category (category.id)}
          <div class="category-section">
            <!-- Category Header -->
            <div class="text-center mb-12">
              <h3 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {category.name}
              </h3>
              {#if category.description}
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                  {category.description}
                </p>
              {/if}
            </div>
            
            <!-- Products Grid -->
            {#if category.products && category.products.length > 0}
              <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {#each category.products.filter(p => p.isAvailable) as product (product.id)}
                  <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                    <!-- Product Image Placeholder -->
                    <div class="h-48 bg-gradient-to-br from-amber-100 to-orange-100 relative overflow-hidden">
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div class="absolute inset-0 flex items-center justify-center">
                        <svg class="w-16 h-16 text-amber-600/30" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                        </svg>
                      </div>
                      
                      <!-- Price Badge -->
                      <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span class="text-sm font-semibold text-amber-700">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>
                    
                    <!-- Product Content -->
                    <div class="p-6">
                      <h4 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
                        {product.name}
                      </h4>
                      
                      {#if product.description}
                        <p class="text-gray-600 text-sm leading-relaxed mb-4">
                          {product.description}
                        </p>
                      {/if}
                      
                      <div class="flex items-center justify-between">
                        <div class="flex items-center text-sm text-gray-500">
                          <svg class="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                          </svg>
                          Disponível
                        </div>
                        
                        <div class="text-lg font-bold text-amber-700">
                          {formatPrice(product.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="text-center py-8">
                <p class="text-gray-500">Nenhum produto disponível nesta categoria no momento.</p>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    
    <!-- Empty State -->
    {:else}
      <div class="text-center py-20">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Cardápio em breve</h3>
        <p class="text-gray-600">Em breve disponibilizaremos nosso cardápio completo aqui.</p>
      </div>
    {/if}
  </div>
</section>

<style>
  .category-section:not(:last-child) {
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 4rem;
  }
</style>