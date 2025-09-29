<!-- src/lib/components/admin/AdminSidebar.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { adminAuth } from '$lib/admin/auth';
  
  interface Props {
    isOpen: boolean;
    closeSidebar: () => void;
  }
  
    let { isOpen = $bindable(false), closeSidebar }: { 
    isOpen?: boolean;
    closeSidebar: () => void;
  } = $props();
  
  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2'
    },
    {
      name: 'Categorias',
      href: '/admin/categories',
      icon: 'M19 11H5m14-4v8a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2zM9 11h1m4 0h1'
    },
    {
      name: 'Produtos',
      href: '/admin/products',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
    }
  ];
  
  function handleNavigation(href: string) {
    goto(href);
    closeSidebar();
  }
  
  async function handleLogout() {
    await adminAuth.logout();
  }
  
  let currentPath = $derived($page.url.pathname);
</script>

<div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 {
  isOpen ? 'translate-x-0' : '-translate-x-full'
}">
  <div class="flex flex-col h-full">
    <!-- Logo -->  
    <div class="flex items-center h-16 px-6 bg-gradient-to-r from-amber-600 to-orange-600">
      <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
        <svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
      </div>
      <div>
        <h1 class="text-lg font-bold text-white">Vovó Maria</h1>
        <p class="text-xs text-amber-100">Admin Panel</p>
      </div>
    </div>
    
    <!-- Navigation Menu -->
    <nav class="flex-1 px-4 py-6 space-y-2">
      {#each navigation as item}
        <button
          onclick={() => handleNavigation(item.href)}
          class="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 {
            currentPath === item.href
              ? 'bg-amber-50 text-amber-700 border-r-2 border-amber-500'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon}/>
          </svg>
          {item.name}
        </button>
      {/each}
    </nav>
    
    <!-- User Actions -->
    <div class="p-4 border-t border-gray-200">
      <button
        onclick={() => goto('/')}
        class="w-full flex items-center px-4 py-2 mb-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        Ver Site
      </button>
      
      <button
        onclick={handleLogout}
        class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        Sair
      </button>
    </div>
  </div>
</div>