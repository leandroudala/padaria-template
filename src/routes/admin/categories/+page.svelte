<!-- src/routes/admin/categories/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import AdminLayout from '$lib/components/admin/AdminLayout.svelte';
  import { categoryApi } from '$lib/admin/api';
  
  let categories = $state<any[]>([]);
  let isLoading = $state(true);
  let error = $state('');
  let successMessage = $state('');
  
  // Form states
  let showForm = $state(false);
  let editingCategory = $state<any>(null);
  let formData = $state({
    name: '',
    description: '',
    isActive: true
  });
  let isSubmitting = $state(false);
  let formErrors = $state<Record<string, string>>({});
  
  // Delete modal
  let showDeleteModal = $state(false);
  let deletingCategory = $state<any>(null);
  
  onMount(async () => {
    await loadCategories();
  });
  
  async function loadCategories() {
    try {
      isLoading = true;
      error = '';
      
      const result = await categoryApi.getAll();
      if (result.success) {
        categories = (result.data as any)?.categories || [];
      } else {
        error = result.error || 'Erro ao carregar categorias';
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      error = 'Erro inesperado ao carregar categorias';
    } finally {
      isLoading = false;
    }
  }
  
  function openCreateForm() {
    editingCategory = null;
    formData = { name: '', description: '', isActive: true };
    formErrors = {};
    showForm = true;
  }
  
  function openEditForm(category: any) {
    editingCategory = category;
    formData = {
      name: category.name || '',
      description: category.description || '',
      isActive: category.isActive ?? true
    };
    formErrors = {};
    showForm = true;
  }
  
  function closeForm() {
    showForm = false;
    editingCategory = null;
    formErrors = {};
  }
  
  function validateForm() {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    // Check for duplicate names (excluding current category if editing)
    const duplicateName = categories.find(cat => 
      cat.name.toLowerCase() === formData.name.trim().toLowerCase() && 
      (!editingCategory || cat.id !== editingCategory.id)
    );
    if (duplicateName) {
      errors.name = 'Já existe uma categoria com este nome';
    }
    
    formErrors = errors;
    return Object.keys(errors).length === 0;
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
        isActive: formData.isActive
      };
      
      let result;
      if (editingCategory) {
        result = await categoryApi.update(editingCategory.id, data);
      } else {
        result = await categoryApi.create(data);
      }
      
      if (result.success) {
        successMessage = editingCategory ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!';
        closeForm();
        await loadCategories();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          successMessage = '';
        }, 3000);
      } else {
        error = result.error || 'Erro ao salvar categoria';
      }
    } catch (err) {
      console.error('Error saving category:', err);
      error = 'Erro inesperado ao salvar categoria';
    } finally {
      isSubmitting = false;
    }
  }
  
  function openDeleteModal(category: any) {
    deletingCategory = category;
    showDeleteModal = true;
  }
  
  function closeDeleteModal() {
    showDeleteModal = false;
    deletingCategory = null;
  }
  
  async function handleDelete() {
    if (!deletingCategory) return;
    
    try {
      const result = await categoryApi.delete(deletingCategory.id);
      if (result.success) {
        successMessage = 'Categoria excluída com sucesso!';
        closeDeleteModal();
        await loadCategories();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          successMessage = '';
        }, 3000);
      } else {
        error = result.error || 'Erro ao excluir categoria';
        closeDeleteModal();
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      error = 'Erro inesperado ao excluir categoria';
      closeDeleteModal();
    }
  }
</script>

<AdminLayout title="Gerenciar Categorias">
  <!-- Header Actions -->
  <div class="flex justify-between items-center mb-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Categorias</h2>
      <p class="text-gray-600">Organize o cardápio da sua padaria</p>
    </div>
    <button
      onclick={openCreateForm}
      class="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
      </svg>
      Nova Categoria
    </button>
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
  
  <!-- Categories List -->
  {#if isLoading}
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div class="text-center">
        <div class="animate-spin w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full mx-auto mb-4"></div>
        <p class="text-gray-600">Carregando categorias...</p>
      </div>
    </div>
  {:else if categories.length === 0}
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div class="text-center">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-4v8a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2zM9 11h1m4 0h1"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma categoria encontrada</h3>
        <p class="text-gray-600 mb-4">Comece criando sua primeira categoria para organizar o cardápio</p>
        <button
          onclick={openCreateForm}
          class="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Criar Primeira Categoria
        </button>
      </div>
    </div>
  {:else}
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descrição
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each categories as category (category.id)}
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{category.name}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600 max-w-xs truncate">
                  {category.description || 'Sem descrição'}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                  {category.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    onclick={() => openEditForm(category)}
                    class="text-amber-600 hover:text-amber-700 p-1 rounded"
                    title="Editar categoria"
                    aria-label="Editar categoria"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    onclick={() => openDeleteModal(category)}
                    class="text-red-600 hover:text-red-700 p-1 rounded"
                    title="Excluir categoria"
                    aria-label="Excluir categoria"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</AdminLayout>

<!-- Create/Edit Form Modal -->
{#if showForm}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
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
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Nome da Categoria *
          </label>
          <input
            type="text"
            id="name"
            bind:value={formData.name}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 {formErrors.name ? 'border-red-300' : ''}"
            placeholder="Ex: Pães, Doces, Salgados..."
            required
          />
          {#if formErrors.name}
            <p class="mt-1 text-sm text-red-600">{formErrors.name}</p>
          {/if}
        </div>
        
        <!-- Description Field -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            bind:value={formData.description}
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Descreva a categoria (opcional)"
          ></textarea>
        </div>
        
        <!-- Active Toggle -->
        <div class="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            bind:checked={formData.isActive}
            class="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
          />
          <label for="isActive" class="ml-2 block text-sm text-gray-700">
            Categoria ativa
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
              {editingCategory ? 'Atualizar' : 'Criar'}
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && deletingCategory}
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
              Tem certeza que deseja excluir a categoria <strong>"{deletingCategory.name}"</strong>?
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