<!-- src/routes/admin/products/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import AdminLayout from '$lib/components/admin/AdminLayout.svelte';
  import { productApi, categoryApi } from '$lib/admin/api';
  
  let products = $state<any[]>([]);
  let categories = $state<any[]>([]);
  let isLoading = $state(true);
  let error = $state('');
  let successMessage = $state('');
  
  // Form states
  let showForm = $state(false);
  let editingProduct = $state<any>(null);
  let formData = $state({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: '',
    isAvailable: true
  });
  let isSubmitting = $state(false);
  let formErrors = $state<Record<string, string>>({});
  
  // Delete modal
  let showDeleteModal = $state(false);
  let deletingProduct = $state<any>(null);
  
  // Filters
  let selectedCategory = $state('');
  let searchQuery = $state('');
  let statusFilter = $state('all'); // 'all', 'available', 'unavailable'
  
  onMount(async () => {
    await Promise.all([loadProducts(), loadCategories()]);
  });
  
  async function loadProducts() {
    try {
      const result = await productApi.getAll();
      if (result.success) {
        products = (result.data as any)?.products || [];
      } else {
        error = result.error || 'Erro ao carregar produtos';
      }
    } catch (err) {
      console.error('Error loading products:', err);
      error = 'Erro inesperado ao carregar produtos';
    }
  }
  
  async function loadCategories() {
    try {
      const result = await categoryApi.getAll();
      if (result.success) {
        categories = (result.data as any)?.categories || [];
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      isLoading = false;
    }
  }
  
  function openCreateForm() {
    editingProduct = null;
    formData = {
      name: '',
      description: '',
      price: '',
      categoryId: '',
      imageUrl: '',
      isAvailable: true
    };
    formErrors = {};
    showForm = true;
  }
  
  function openEditForm(product: any) {
    editingProduct = product;
    formData = {
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      categoryId: product.categoryId?.toString() || '',
      imageUrl: product.imageUrl || '',
      isAvailable: product.isAvailable ?? true
    };
    formErrors = {};
    showForm = true;
  }
  
  function closeForm() {
    showForm = false;
    editingProduct = null;
    formErrors = {};
  }
  
  function validateForm() {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!formData.price.trim()) {
      errors.price = 'Preço é obrigatório';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        errors.price = 'Preço deve ser um número válido maior que zero';
      }
    }
    
    if (!formData.categoryId) {
      errors.categoryId = 'Categoria é obrigatória';
    }
    
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      errors.imageUrl = 'URL da imagem deve ser válida';
    }
    
    // Check for duplicate names (excluding current product if editing)
    const duplicateName = products.find(prod => 
      prod.name.toLowerCase() === formData.name.trim().toLowerCase() && 
      (!editingProduct || prod.id !== editingProduct.id)
    );
    if (duplicateName) {
      errors.name = 'Já existe um produto com este nome';
    }
    
    formErrors = errors;
    return Object.keys(errors).length === 0;
  }
  
  function isValidUrl(string: string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
  
  async function handleSubmit(event: Event) {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      isSubmitting = true;
      successMessage = '';
      
      const data = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        categoryId: formData.categoryId, // Keep as string
        imageUrl: formData.imageUrl.trim() || null,
        isAvailable: formData.isAvailable
      };
      
      let result;
      if (editingProduct) {
        result = await productApi.update(editingProduct.id, data);
      } else {
        result = await productApi.create(data);
      }
      
      if (result.success) {
        successMessage = editingProduct ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!';
        closeForm();
        await loadProducts();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          successMessage = '';
        }, 3000);
      } else {
        error = result.error || 'Erro ao salvar produto';
      }
    } catch (err) {
      console.error('Error saving product:', err);
      error = 'Erro inesperado ao salvar produto';
    } finally {
      isSubmitting = false;
    }
  }
  
  function openDeleteModal(product: any) {
    deletingProduct = product;
    showDeleteModal = true;
  }
  
  function closeDeleteModal() {
    showDeleteModal = false;
    deletingProduct = null;
  }
  
  async function handleDelete() {
    if (!deletingProduct) return;
    
    try {
      const result = await productApi.delete(deletingProduct.id);
      if (result.success) {
        successMessage = 'Produto excluído com sucesso!';
        closeDeleteModal();
        await loadProducts();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          successMessage = '';
        }, 3000);
      } else {
        error = result.error || 'Erro ao excluir produto';
        closeDeleteModal();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      error = 'Erro inesperado ao excluir produto';
      closeDeleteModal();
    }
  }
  
  // Computed filtered products
  let filteredProducts = $derived(products.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (selectedCategory && product.categoryId?.toString() !== selectedCategory) {
      return false;
    }
    
    // Status filter
    if (statusFilter === 'available' && !product.isAvailable) {
      return false;
    }
    if (statusFilter === 'unavailable' && product.isAvailable) {
      return false;
    }
    
    return true;
  }));
  
  function getCategoryName(categoryId: number) {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Sem categoria';
  }
  
  function formatPrice(price: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }
</script>

<AdminLayout title="Gerenciar Produtos">
  <!-- Header Actions -->
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Produtos</h2>
      <p class="text-gray-600">Gerencie os produtos do seu cardápio</p>
    </div>
    <button
      onclick={openCreateForm}
      class="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
      </svg>
      Novo Produto
    </button>
  </div>
  
  <!-- Filters -->
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Search -->
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
        <input
          type="text"
          id="search"
          bind:value={searchQuery}
          placeholder="Nome do produto..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>
      
      <!-- Category Filter -->
      <div>
        <label for="category-filter" class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
        <select
          id="category-filter"
          bind:value={selectedCategory}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          <option value="">Todas as categorias</option>
          {#each categories as category}
            <option value={category.id.toString()}>{category.name}</option>
          {/each}
        </select>
      </div>
      
      <!-- Status Filter -->
      <div>
        <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          id="status-filter"
          bind:value={statusFilter}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          <option value="all">Todos</option>
          <option value="available">Disponível</option>
          <option value="unavailable">Indisponível</option>
        </select>
      </div>
      
      <!-- Results Count -->
      <div class="flex items-end">
        <p class="text-sm text-gray-600">
          {filteredProducts.length} de {products.length} produtos
        </p>
      </div>
    </div>
  </div>
  
  <!-- Success Message -->
  {#if successMessage}
    <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <p class="text-green-800 font-medium">{successMessage}</p>
      </div>
    </div>
  {/if}
  
  <!-- Error Message -->
  {#if error}
    <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <p class="text-red-800 font-medium">{error}</p>
        </div>
        <button
          onclick={() => error = ''}
          class="text-red-600 hover:text-red-700"
          aria-label="Fechar mensagem de erro"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
  {/if}
  
  <!-- Products Grid/List -->
  {#if isLoading}
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div class="text-center">
        <div class="animate-spin w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full mx-auto mb-4"></div>
        <p class="text-gray-600">Carregando produtos...</p>
      </div>
    </div>
  {:else if filteredProducts.length === 0}
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div class="text-center">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {products.length === 0 ? 'Nenhum produto encontrado' : 'Nenhum produto corresponde aos filtros'}
        </h3>
        <p class="text-gray-600 mb-4">
          {products.length === 0 ? 'Comece criando seu primeiro produto' : 'Tente ajustar os filtros ou limpar a busca'}
        </p>
        {#if products.length === 0}
          <button
            onclick={openCreateForm}
            class="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Criar Primeiro Produto
          </button>
        {/if}
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredProducts as product (product.id)}
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <!-- Product Image -->
          <div class="aspect-video bg-gray-100 flex items-center justify-center">
            {#if product.imageUrl}
              <img
                src={product.imageUrl}
                alt={product.name}
                class="w-full h-full object-cover"
                loading="lazy"
              />
            {:else}
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            {/if}
          </div>
          
          <!-- Product Info -->
          <div class="p-4">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                {product.isAvailable ? 'Disponível' : 'Indisponível'}
              </span>
            </div>
            
            <p class="text-sm text-gray-600 mb-2">{getCategoryName(product.categoryId)}</p>
            
            {#if product.description}
              <p class="text-sm text-gray-700 mb-3 line-clamp-2">{product.description}</p>
            {/if}
            
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold text-amber-600">{formatPrice(product.price)}</span>
              
              <div class="flex items-center space-x-2">
                <button
                  onclick={() => openEditForm(product)}
                  class="text-amber-600 hover:text-amber-700 p-1 rounded"
                  title="Editar produto"
                  aria-label="Editar produto"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button
                  onclick={() => openDeleteModal(product)}
                  class="text-red-600 hover:text-red-700 p-1 rounded"
                  title="Excluir produto"
                  aria-label="Excluir produto"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</AdminLayout>

<!-- Create/Edit Form Modal -->
{#if showForm}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            {editingProduct ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          <button
            onclick={closeForm}
            class="text-gray-400 hover:text-gray-600"
            aria-label="Fechar formulário"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Modal Body -->
      <form onsubmit={handleSubmit} class="px-6 py-4 space-y-4">
        <!-- Name Field -->
        <div>
          <label for="product-name" class="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto *
          </label>
          <input
            type="text"
            id="product-name"
            bind:value={formData.name}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 {formErrors.name ? 'border-red-300' : ''}"
            placeholder="Ex: Pão Francês, Brigadeiro..."
            required
          />
          {#if formErrors.name}
            <p class="mt-1 text-sm text-red-600">{formErrors.name}</p>
          {/if}
        </div>
        
        <!-- Price Field -->
        <div>
          <label for="product-price" class="block text-sm font-medium text-gray-700 mb-1">
            Preço *
          </label>
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-500">R$</span>
            <input
              type="number"
              id="product-price"
              bind:value={formData.price}
              step="0.01"
              min="0"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 {formErrors.price ? 'border-red-300' : ''}"
              placeholder="0,00"
              required
            />
          </div>
          {#if formErrors.price}
            <p class="mt-1 text-sm text-red-600">{formErrors.price}</p>
          {/if}
        </div>
        
        <!-- Category Field -->
        <div>
          <label for="product-category" class="block text-sm font-medium text-gray-700 mb-1">
            Categoria *
          </label>
          <select
            id="product-category"
            bind:value={formData.categoryId}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 {formErrors.categoryId ? 'border-red-300' : ''}"
            required
          >
            <option value="">Selecione uma categoria</option>
            {#each categories as category}
              <option value={category.id.toString()}>{category.name}</option>
            {/each}
          </select>
          {#if formErrors.categoryId}
            <p class="mt-1 text-sm text-red-600">{formErrors.categoryId}</p>
          {/if}
        </div>
        
        <!-- Description Field -->
        <div>
          <label for="product-description" class="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="product-description"
            bind:value={formData.description}
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Descreva o produto (opcional)"
          ></textarea>
        </div>
        
        <!-- Image URL Field -->
        <div>
          <label for="product-image" class="block text-sm font-medium text-gray-700 mb-1">
            URL da Imagem
          </label>
          <input
            type="url"
            id="product-image"
            bind:value={formData.imageUrl}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 {formErrors.imageUrl ? 'border-red-300' : ''}"
            placeholder="https://exemplo.com/imagem.jpg"
          />
          {#if formErrors.imageUrl}
            <p class="mt-1 text-sm text-red-600">{formErrors.imageUrl}</p>
          {/if}
        </div>
        
        <!-- Available Toggle -->
        <div class="flex items-center">
          <input
            type="checkbox"
            id="product-available"
            bind:checked={formData.isAvailable}
            class="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
          />
          <label for="product-available" class="ml-2 block text-sm text-gray-700">
            Produto disponível
          </label>
        </div>
        
        <!-- Form Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onclick={closeForm}
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            class="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {#if isSubmitting}
              <span class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </span>
            {:else}
              {editingProduct ? 'Atualizar' : 'Criar'}
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && deletingProduct}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Confirmar Exclusão</h3>
      </div>
      
      <!-- Modal Body -->
      <div class="px-6 py-4">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">
              Tem certeza que deseja excluir o produto <strong>"{deletingProduct.name}"</strong>?
            </p>
            <p class="text-xs text-red-600 mt-1">
              Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Modal Actions -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <button
          onclick={closeDeleteModal}
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onclick={handleDelete}
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          Excluir
        </button>
      </div>
    </div>
  </div>
{/if}