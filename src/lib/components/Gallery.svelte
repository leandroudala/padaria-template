<!-- src/lib/components/Gallery.svelte -->
<script lang="ts">
  import { siteContent } from '$lib/content';
  
  const { gallery } = siteContent;
  
  // Sample gallery images (in a real app, these would come from a CMS or API)
  const galleryImages = [
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop&crop=center',
      alt: gallery.imageAlt.bread,
      category: 'products'
    },
    {
      id: '2', 
      src: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&h=400&fit=crop&crop=center',
      alt: gallery.imageAlt.pastry,
      category: 'products'
    },
    {
      id: '3',
      src: 'https://cdn.pixabay.com/photo/2016/11/29/10/09/bakery-1868925_1280.jpg',
      alt: gallery.imageAlt.interior,
      category: 'bakery'
    },
    {
      id: '4',
      src: 'https://cdn.pixabay.com/photo/2020/02/11/21/09/baker-4840960_1280.jpg',
      alt: gallery.imageAlt.baker,
      category: 'team'
    },
    {
      id: '5',
      src: 'https://images.unsplash.com/photo-1590080874088-eec64895b423?w=600&h=400&fit=crop&crop=center',
      alt: gallery.imageAlt.display,
      category: 'bakery'
    },
    {
      id: '6',
      src: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop&crop=center',
      alt: gallery.imageAlt.bread,
      category: 'products'
    }
  ];
  
  let selectedCategory = $state('all');
  let lightboxImage = $state<string | null>(null);
  let lightboxIndex = $state(0);
  
  const filteredImages = $derived(selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory));
  
  function openLightbox(imageSrc: string) {
    lightboxImage = imageSrc;
    lightboxIndex = filteredImages.findIndex(img => img.src === imageSrc);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightboxImage = null;
    lightboxIndex = 0;
    document.body.style.overflow = 'auto';
  }
  
  function nextImage() {
    if (lightboxIndex < filteredImages.length - 1) {
      lightboxIndex++;
      lightboxImage = filteredImages[lightboxIndex].src;
    }
  }
  
  function previousImage() {
    if (lightboxIndex > 0) {
      lightboxIndex--;
      lightboxImage = filteredImages[lightboxIndex].src;
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (!lightboxImage) return;
    
    switch (event.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        previousImage();
        break;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<section id="gallery" class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <div class="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
        </svg>
        Galeria
      </div>
      
      <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
        {gallery.title}
      </h2>
      
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        {gallery.subtitle}
      </p>
    </div>
    
    <!-- Filter Buttons -->
    <div class="flex flex-wrap justify-center gap-4 mb-12">
      <button
        onclick={() => selectedCategory = 'all'}
        class="px-6 py-3 rounded-full font-medium transition-all duration-300 {selectedCategory === 'all' 
          ? 'bg-amber-600 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
      >
        Todas as Fotos
      </button>
      
      <button
        onclick={() => selectedCategory = 'products'}
        class="px-6 py-3 rounded-full font-medium transition-all duration-300 {selectedCategory === 'products' 
          ? 'bg-amber-600 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
      >
        {gallery.categories.products}
      </button>
      
      <button
        onclick={() => selectedCategory = 'bakery'}
        class="px-6 py-3 rounded-full font-medium transition-all duration-300 {selectedCategory === 'bakery' 
          ? 'bg-amber-600 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
      >
        {gallery.categories.bakery}
      </button>
      
      <button
        onclick={() => selectedCategory = 'team'}
        class="px-6 py-3 rounded-full font-medium transition-all duration-300 {selectedCategory === 'team' 
          ? 'bg-amber-600 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
      >
        {gallery.categories.team}
      </button>
    </div>
    
    <!-- Image Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredImages as image (image.id)}
        <button 
          class="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-500/50"
          onclick={() => openLightbox(image.src)}
          aria-label="Abrir {image.alt} em tela cheia"
        >
          <img
            src={image.src}
            alt={image.alt}
            class="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
            loading="lazy"
          />
          
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg class="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
              </svg>
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>
</section>

<!-- Lightbox Modal -->
{#if lightboxImage}
  <div 
    class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
    onclick={closeLightbox}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <!-- Close Button -->
    <button
      onclick={closeLightbox}
      class="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      aria-label={siteContent.common.close}
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
    
    <!-- Previous Button -->
    {#if lightboxIndex > 0}
      <button
        onclick={previousImage}
        class="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label={siteContent.common.previous}
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
    {/if}
    
    <!-- Next Button -->
    {#if lightboxIndex < filteredImages.length - 1}
      <button
        onclick={nextImage}
        class="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label={siteContent.common.next}
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    {/if}
    
    <!-- Image -->
    <div 
      class="max-w-7xl max-h-full"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="button"
      tabindex="0"
    >
      <img
        src={lightboxImage}
        alt={filteredImages[lightboxIndex]?.alt || ''}
        class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
      />
      
      <!-- Image Counter -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white rounded-full text-sm">
        {lightboxIndex + 1} de {filteredImages.length}
      </div>
    </div>
  </div>
{/if}