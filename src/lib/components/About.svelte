<!-- src/lib/components/About.svelte -->
<script lang="ts">
  import { siteContent } from '$lib/content';
  
  const { about } = siteContent;
</script>

<section id="about" class="py-20 bg-gradient-to-b from-amber-50 to-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <div class="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Nossa História
      </div>
      
      <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
        {about.title}
      </h2>
      
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        {about.subtitle}
      </p>
    </div>
    
    <!-- Story Section -->
    <div class="grid lg:grid-cols-2 gap-16 items-center mb-20">
      <!-- Story Content -->
      <div class="space-y-6">
        <p class="text-lg text-gray-700 leading-relaxed">
          {about.story.paragraph1}
        </p>
        
        <p class="text-lg text-gray-700 leading-relaxed">
          {about.story.paragraph2}
        </p>
        
        <p class="text-lg text-gray-700 leading-relaxed">
          {about.story.paragraph3}
        </p>
        
        <!-- Stats -->
        <div class="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
          <div class="text-center">
            <div class="text-3xl font-bold text-amber-600 mb-2">30+</div>
            <div class="text-sm text-gray-600">Anos de Tradição</div>
          </div>
          
          <div class="text-center">
            <div class="text-3xl font-bold text-amber-600 mb-2">100%</div>
            <div class="text-sm text-gray-600">Artesanal</div>
          </div>
          
          <div class="text-center">
            <div class="text-3xl font-bold text-amber-600 mb-2">1000+</div>
            <div class="text-sm text-gray-600">Famílias Atendidas</div>
          </div>
        </div>
      </div>
      
      <!-- Story Image -->
      <div class="relative">
        <div class="aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
          <!-- Placeholder for story image -->
          <div class="w-full h-full bg-gradient-to-br from-amber-200 via-orange-100 to-yellow-50 flex items-center justify-center">
            <div class="text-center">
              <svg class="w-24 h-24 text-amber-600/30 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 017 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
              <p class="text-amber-600/60 font-medium">Foto da Nossa História</p>
            </div>
          </div>
        </div>
        
        <!-- Decorative elements -->
        <div class="absolute -top-6 -right-6 w-20 h-20 bg-amber-200/30 rounded-full blur-xl"></div>
        <div class="absolute -bottom-6 -left-6 w-16 h-16 bg-orange-200/30 rounded-full blur-lg"></div>
      </div>
    </div>
    
    <!-- Values Section -->
    <div class="text-center mb-12">
      <h3 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        {about.values.title}
      </h3>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Os pilares que nos guiam todos os dias
      </p>
    </div>
    
    <div class="grid md:grid-cols-3 gap-8">
      <!-- Quality Value -->
      <div class="group text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div class="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        
        <h4 class="text-xl font-bold text-gray-900 mb-4">
          {about.values.quality.title}
        </h4>
        
        <p class="text-gray-600 leading-relaxed">
          {about.values.quality.description}
        </p>
      </div>
      
      <!-- Tradition Value -->
      <div class="group text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div class="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </div>
        
        <h4 class="text-xl font-bold text-gray-900 mb-4">
          {about.values.tradition.title}
        </h4>
        
        <p class="text-gray-600 leading-relaxed">
          {about.values.tradition.description}
        </p>
      </div>
      
      <!-- Freshness Value -->
      <div class="group text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div class="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
        </div>
        
        <h4 class="text-xl font-bold text-gray-900 mb-4">
          {about.values.freshness.title}
        </h4>
        
        <p class="text-gray-600 leading-relaxed">
          {about.values.freshness.description}
        </p>
      </div>
    </div>
  </div>
</section>