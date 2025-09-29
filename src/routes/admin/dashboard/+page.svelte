<!-- src/routes/admin/dashboard/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import AdminLayout from '$lib/components/admin/AdminLayout.svelte';
  import { categoryApi, productApi } from '$lib/admin/api';
  
  let stats = $state({
    totalCategories: 0,
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0
  });
  
  let isLoading = $state(true);
  let error = $state('');
  
  onMount(async () => {
    await loadStats();
  });
  
  async function loadStats() {
    try {
      isLoading = true;
      error = '';
      
      const [categoriesResult, productsResult] = await Promise.all([
        categoryApi.getAll(),
        productApi.getAll()
      ]);
      
      if (categoriesResult.success && productsResult.success) {
        const categories = (categoriesResult.data as any)?.categories || [];
        const products = (productsResult.data as any)?.products || [];
        
        stats = {
          totalCategories: categories.length,
          totalProducts: products.length,
          activeProducts: products.filter((p: any) => p.isAvailable).length,
          inactiveProducts: products.filter((p: any) => !p.isAvailable).length
        };
      } else {
        error = 'Erro ao carregar estatísticas';
      }
    } catch (err) {
      console.error('Error loading stats:', err);
      error = 'Erro inesperado ao carregar dados';
    } finally {
      isLoading = false;
    }
  }
</script>

<AdminLayout title="Dashboard">
  <!-- Welcome Section -->
     <div class="mb-8">
        <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-3xl font-bold mb-2">Bem-vindo ao Admin Panel!</h2>
              <p class="text-amber-100 text-lg">Gerencie sua padaria de forma fácil e eficiente</p>
          </div>
           <div class="hidden md:block">
              <svg class="w-24 h-24 text-amber-200/30" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
     
     <!-- Statistics Cards -->
     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Categories -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-4v8a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2zM9 11h1m4 0h1"/>
            </svg>
          </div>
           <div>
              <p class="text-sm font-medium text-gray-600">Categorias</p>
              <p class="text-2xl font-bold text-gray-900">
                {#if isLoading}
                  <span class="animate-pulse bg-gray-200 rounded w-8 h-6 inline-block"></span>
                {:else}
                  {stats.totalCategories}
                {/if}
            </p>
          </div>
        </div>
      </div>
       
       <!-- Total Products -->
       <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
           <div>
              <p class="text-sm font-medium text-gray-600">Total de Produtos</p>
              <p class="text-2xl font-bold text-gray-900">
                {#if isLoading}
                  <span class="animate-pulse bg-gray-200 rounded w-8 h-6 inline-block"></span>
                {:else}
                  {stats.totalProducts}
                {/if}
            </p>
          </div>
        </div>
      </div>
       
       <!-- Active Products -->
       <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
           <div>
              <p class="text-sm font-medium text-gray-600">Produtos Ativos</p>
              <p class="text-2xl font-bold text-gray-900">
                {#if isLoading}
                  <span class="animate-pulse bg-gray-200 rounded w-8 h-6 inline-block"></span>
                {:else}
                  {stats.activeProducts}
                {/if}
            </p>
          </div>
        </div>
      </div>
       
       <!-- Inactive Products -->
       <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"/>
            </svg>
          </div>
           <div>
              <p class="text-sm font-medium text-gray-600">Produtos Inativos</p>
              <p class="text-2xl font-bold text-gray-900">
                {#if isLoading}
                  <span class="animate-pulse bg-gray-200 rounded w-8 h-6 inline-block"></span>
                {:else}
                  {stats.inactiveProducts}
                {/if}
            </p>
          </div>
        </div>
      </div>
    </div>
     
     <!-- Error Message -->
     {#if error}
       <div class="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
            <p class="text-red-800 font-medium">{error}</p>
            <button
              onclick={loadStats}
              class="ml-auto text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Tentar novamente
            </button>
        </div>
      </div>
     {/if}
     
     <!-- Quick Actions -->
     <div class="grid md:grid-cols-2 gap-8">
        <!-- Management Cards -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
          
          <!-- Categories Management -->
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-4v8a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2zM9 11h1m4 0h1"/>
                </svg>
              </div>
               <div>
                  <h4 class="text-lg font-medium text-gray-900">Gerenciar Categorias</h4>
                  <p class="text-sm text-gray-600">Organize o cardápio por categorias</p>
              </div>
            </div>
             <a
               href="/admin/categories"
               class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
             >
               Acessar
               <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
         
         <!-- Products Management -->
         <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
               <div>
                  <h4 class="text-lg font-medium text-gray-900">Gerenciar Produtos</h4>
                  <p class="text-sm text-gray-600">Adicione e edite produtos do cardápio</p>
              </div>
            </div>
             <a
               href="/admin/products"
               class="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
             >
               Acessar
               <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
       
       <!-- Recent Activity (Placeholder) -->
       <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Atividade Recente</h3>
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div class="text-center py-8">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
              <p class="text-gray-600">Nenhuma atividade recente</p>
              <p class="text-sm text-gray-500 mt-2">As ações realizadas aparecerão aqui</p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>