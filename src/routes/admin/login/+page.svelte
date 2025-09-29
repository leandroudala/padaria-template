<!-- src/routes/admin/login/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { adminAuth } from '$lib/admin/auth';
  
  let formData = $state({
    email: '',
    password: ''
  });
  
  let isSubmitting = $state(false);
  let error = $state('');
  let showPassword = $state(false);
  
  // Check if user is already logged in
  onMount(() => {
    if (browser) {
      const token = localStorage.getItem('admin_token');
      if (token) {
        goto('/admin/dashboard');
      }
    }
  });
  
  function validateForm() {
    if (!formData.email.trim()) {
      error = 'Email é obrigatório';
      return false;
    }
    if (!formData.password.trim()) {
      error = 'Senha é obrigatória';
      return false;
    }
    return true;
  }
  
  async function handleSubmit(event: Event) {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      isSubmitting = true;
      error = '';
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
        credentials: 'include' // Important for cookie handling
      });
      
      const result = await response.json() as any;
      
      if (result.success) {
        // Store the token and user info
        adminAuth.setTokens(result.data.token, result.data.refreshToken, result.data.user);
        
        // Redirect to dashboard
        goto('/admin/dashboard');
      } else {
        error = result.error || 'Credenciais inválidas';
      }
    } catch (err) {
      console.error('Login error:', err);
      error = 'Erro inesperado. Tente novamente.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Admin Login - Padaria Artesanal Vovó Maria</title>
  <meta name="robots" content="noindex, nofollow">
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
  <!-- Background pattern -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl"></div>
  </div>
  
  <div class="relative w-full max-w-md">
    <!-- Login Card -->
    <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <!-- Logo -->
        <div class="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
          </svg>
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
        <p class="text-gray-600">Acesse o painel administrativo</p>
      </div>
      
      <!-- Error Message -->
      {#if error}
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <p class="text-red-800 text-sm font-medium">{error}</p>
          </div>
        </div>
      {/if}
      
      <!-- Login Form -->
      <form onsubmit={handleSubmit} class="space-y-6">
        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            E-mail
          </label>
          <div class="relative">
            <input
              type="email"
              id="email"
              bind:value={formData.email}
              placeholder="admin@example.com"
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              required
              disabled={isSubmitting}
            />
            <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>
        
        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Senha
          </label>
          <div class="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              bind:value={formData.password}
              placeholder="••••••••"
              class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              required
              disabled={isSubmitting}
            />
            <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            
            <!-- Show/Hide Password Toggle -->
            <button
              type="button"
              onclick={() => showPassword = !showPassword}
              class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              {#if showPassword}
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.5 8.5m1.378 1.378l.85-.85m4.242 4.242L16.5 15.5m-1.378-1.378l-.85.85"/>
                </svg>
              {:else}
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              {/if}
            </button>
          </div>
        </div>
        
        <!-- Submit Button -->
        <button
          type="submit"
          disabled={isSubmitting}
          class="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {#if isSubmitting}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Entrando...
          {:else}
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
            Entrar
          {/if}
        </button>
      </form>
      
      <!-- Back to Site Link -->
      <div class="mt-8 text-center">
        <a 
          href="/"
          class="inline-flex items-center text-gray-600 hover:text-amber-600 transition-colors text-sm"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Voltar ao site
        </a>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="text-center mt-8">
      <p class="text-gray-500 text-sm">
        © 2024 Padaria Artesanal Vovó Maria
      </p>
    </div>
  </div>
</div>