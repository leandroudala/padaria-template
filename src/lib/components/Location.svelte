<!-- src/lib/components/Location.svelte -->
<script lang="ts">
  import { siteContent } from '$lib/content';
  
  const { location } = siteContent;
</script>

<section id="location" class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <div class="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
        </svg>
        Localização
      </div>
      
      <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
        {location.title}
      </h2>
      
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        {location.subtitle}
      </p>
    </div>
    
    <div class="grid lg:grid-cols-2 gap-12">
      <!-- Location Info -->
      <div class="space-y-8">
        <!-- Address Card -->
        <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100">
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Endereço</h3>
              <div class="text-gray-700 space-y-1">
                <p>{location.address.street}</p>
                <p>{location.address.neighborhood} - {location.address.city}, {location.address.state}</p>
                <p>CEP: {location.address.zipCode}</p>
              </div>
              
              <a 
                href="https://www.google.com/maps/search/{encodeURIComponent(`${location.address.street}, ${location.address.neighborhood}, ${location.address.city}, ${location.address.state}`)}"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center mt-4 text-amber-700 hover:text-amber-800 font-medium transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                {location.directions}
              </a>
            </div>
          </div>
        </div>
        
        <!-- Hours Card -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900 mb-4">{location.hours.title}</h3>
              <div class="space-y-2 text-gray-700">
                <div class="flex justify-between items-center py-2 border-b border-blue-200/50">
                  <span class="font-medium">Segunda a Sexta</span>
                  <span>06h às 19h</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-blue-200/50">
                  <span class="font-medium">Sábado</span>
                  <span>06h às 18h</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="font-medium">Domingo</span>
                  <span>07h às 16h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Contact Cards -->
        <div class="grid sm:grid-cols-2 gap-6">
          <!-- Phone -->
          <div class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-600">Telefone</p>
                <a 
                  href="tel:{location.phone}"
                  class="font-semibold text-gray-900 hover:text-green-600 transition-colors"
                >
                  {location.phone}
                </a>
              </div>
            </div>
          </div>
          
          <!-- WhatsApp -->
          <div class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.306"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-600">WhatsApp</p>
                <a 
                  href="https://wa.me/{location.whatsapp.replace(/[^\d]/g, '')}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold text-gray-900 hover:text-green-600 transition-colors"
                >
                  {location.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Map Placeholder -->
      <div class="lg:order-first">
        <div class="aspect-square lg:aspect-auto lg:h-full rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-100 to-gray-200">
          <!-- Interactive Map Placeholder -->
          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50 relative">
            <!-- Map Icon -->
            <div class="text-center">
              <svg class="w-20 h-20 text-amber-600/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
              <p class="text-amber-600/70 font-medium mb-2">Mapa Interativo</p>
              <p class="text-amber-600/50 text-sm">Clique para abrir no Google Maps</p>
            </div>
            
            <!-- Click overlay for Google Maps -->
            <a 
              href="https://www.google.com/maps/search/{encodeURIComponent(`${location.address.street}, ${location.address.neighborhood}, ${location.address.city}, ${location.address.state}`)}"
              target="_blank"
              rel="noopener noreferrer"
              class="absolute inset-0 hover:bg-black/5 transition-colors"
              aria-label="Abrir localização no Google Maps"
            ></a>
            
            <!-- Location pin -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>