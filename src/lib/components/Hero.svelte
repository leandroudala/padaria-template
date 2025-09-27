<!-- src/lib/components/Hero.svelte -->
<script lang="ts">
  import { siteContent } from '$lib/content';
  
  const { hero } = siteContent;
</script>

<section id="home" class="relative min-h-screen flex items-center justify-center overflow-hidden">
  <!-- Background image with overlay -->
  <div class="absolute inset-0 z-0">
    <div class="absolute inset-0 bg-gradient-to-r from-amber-900/80 via-amber-800/70 to-amber-700/60 z-10"></div>
    <!-- Placeholder for background image - you can replace this with an actual image -->
    <div class="w-full h-full bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50 opacity-30"></div>
  </div>
  
  <!-- Content -->
  <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="space-y-8">
      <!-- Badge/Label -->
      <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium">
        <svg class="w-4 h-4 mr-2 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        Tradição desde 1993
      </div>
      
      <!-- Main heading -->
      <h1 class="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
        <span class="block text-2xl sm:text-3xl lg:text-4xl font-light text-amber-200 mb-2">
          {hero.title}
        </span>
        <span class="bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-100 bg-clip-text text-transparent">
          {hero.subtitle}
        </span>
      </h1>
      
      <!-- Description -->
      <p class="max-w-3xl mx-auto text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed">
        {hero.description}
      </p>
      
      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
        <a 
          href="#menu"
          class="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <svg class="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          {hero.cta.primary}
        </a>
        
        <a 
          href="#location"
          class="group inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 text-white font-semibold rounded-full transition-all duration-300"
        >
          <svg class="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          {hero.cta.secondary}
        </a>
      </div>
    </div>
  </div>
  
  <!-- Decorative elements -->
  <div class="absolute bottom-0 left-0 right-0 z-10">
    <svg class="w-full h-20 text-white" viewBox="0 0 1200 120" fill="currentColor">
      <path d="M0,120L48,110C96,100,192,80,288,70C384,60,480,60,576,65C672,70,768,80,864,85C960,90,1056,90,1152,85C1248,80,1344,70,1392,65L1440,60V120H1392C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120H0Z"/>
    </svg>
  </div>
  
  <!-- Floating elements for visual appeal -->
  <div class="absolute top-20 left-10 w-16 h-16 bg-white/5 rounded-full blur-sm animate-float hidden lg:block"></div>
  <div class="absolute top-40 right-20 w-8 h-8 bg-amber-300/20 rounded-full blur-sm animate-float-delay hidden lg:block"></div>
  <div class="absolute bottom-40 left-20 w-12 h-12 bg-orange-300/10 rounded-full blur-sm animate-float-slow hidden lg:block"></div>
</section>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  @keyframes float-delay {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(90deg); }
  }
  
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(270deg); }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-float-delay {
    animation: float-delay 8s ease-in-out infinite 2s;
  }
  
  .animate-float-slow {
    animation: float-slow 10s ease-in-out infinite 4s;
  }
</style>