<!-- src/lib/components/admin/AdminHeader.svelte -->
<script lang="ts">
  import type { AdminUser } from '$lib/admin/auth';
  
  interface Props {
    toggleSidebar: () => void;
    user: AdminUser | null;
    title: string;
  }
  
  let { toggleSidebar, user, title }: Props = $props();
</script>

<header class="bg-white shadow-sm border-b border-gray-200">
  <div class="mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Mobile menu button -->
      <div class="flex items-center">
        <button
          onclick={toggleSidebar}
          class="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Open sidebar"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        
        <!-- Page Title -->
        <h1 class="ml-4 text-2xl font-semibold text-gray-900 lg:ml-0">
          {title}
        </h1>
      </div>
      
      <!-- User Info -->
      <div class="flex items-center space-x-4">
        <!-- Current Time -->
        <div class="hidden sm:block text-sm text-gray-500">
          {new Date().toLocaleString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
        
        <!-- User Avatar -->
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
            </svg>
          </div>
          
          {#if user}
            <div class="hidden sm:block">
              <p class="text-sm font-medium text-gray-900">Admin</p>
              <p class="text-xs text-gray-500">{user.email}</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</header>