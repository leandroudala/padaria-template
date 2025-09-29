<!-- src/lib/components/admin/AdminLayout.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { adminAuth, type AdminUser } from '$lib/admin/auth';
  import AdminSidebar from './AdminSidebar.svelte';
  import AdminHeader from './AdminHeader.svelte';
  
  interface Props {
    children: any;
    title?: string;
  }
  
  let { children, title = 'Admin Dashboard' }: Props = $props();
  
  let isLoading = $state(true);
  let isSidebarOpen = $state(false);
  let user = $state<AdminUser | null>(null);
  
  onMount(async () => {
    // Check authentication
    const authenticated = await adminAuth.requireAuth();
    if (authenticated) {
      user = adminAuth.getUser();
    }
    isLoading = false;
  });
  
  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
  }
  
  function closeSidebar() {
    isSidebarOpen = false;
  }
</script>

<svelte:head>
  <title>{title} - Admin Panel</title>
  <meta name="robots" content="noindex, nofollow">
</svelte:head>

{#if isLoading}
  <!-- Loading State -->
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
      </div>
      <p class="text-gray-600">Carregando painel administrativo...</p>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <AdminSidebar bind:isOpen={isSidebarOpen} {closeSidebar} />
    
    <!-- Mobile Sidebar Overlay -->
    {#if isSidebarOpen}
      <div 
        class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
        onclick={closeSidebar}
        aria-hidden="true"
      ></div>
    {/if}
    
    <!-- Main Content -->
    <div class="lg:pl-64 flex flex-col min-h-screen">
      <!-- Header -->
      <AdminHeader {toggleSidebar} {user} {title} />
      
      <!-- Page Content -->
      <main class="flex-1 pb-8">
        <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {@render children()}
        </div>
      </main>
    </div>
  </div>
{/if}