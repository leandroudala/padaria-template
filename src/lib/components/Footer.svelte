<!-- src/lib/components/Footer.svelte -->
<script lang="ts">
  import { siteContent } from '$lib/content';
  
  const { footer, location } = siteContent;
  
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<footer class="bg-gradient-to-b from-amber-900 to-amber-950 text-white">
  <!-- Main Footer Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      <!-- Brand Section -->
      <div class="lg:col-span-2">
        <div class="mb-6">
          <h3 class="text-2xl font-bold text-amber-200 mb-2">{siteContent.siteName}</h3>
          <p class="text-amber-100 text-lg">{siteContent.siteTagline}</p>
        </div>
        
        <p class="text-amber-100/90 leading-relaxed mb-6 max-w-md">
          {footer.description}
        </p>
        
        <!-- Social Media Links -->
        <div class="flex space-x-4">
          <a 
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            class="group w-10 h-10 bg-amber-800 hover:bg-amber-700 rounded-full flex items-center justify-center transition-colors"
            aria-label={footer.social.facebook}
          >
            <svg class="w-5 h-5 text-amber-200 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          
          <a 
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            class="group w-10 h-10 bg-amber-800 hover:bg-amber-700 rounded-full flex items-center justify-center transition-colors"
            aria-label={footer.social.instagram}
          >
            <svg class="w-5 h-5 text-amber-200 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988 6.622 0 11.988-5.367 11.988-11.988C24.005 5.367 18.639.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.73-3.016-1.8L7.583 13.9c.26.464.756.788 1.329.788.827 0 1.5-.673 1.5-1.5s-.673-1.5-1.5-1.5c-.573 0-1.069.324-1.329.788L5.433 10.2c.568-1.07 1.719-1.8 3.016-1.8 1.897 0 3.45 1.553 3.45 3.45-.001 1.896-1.553 3.449-3.45 3.449z"/>
            </svg>
          </a>
          
          <a 
            href="https://wa.me/{location.whatsapp.replace(/[^\d]/g, '')}"
            target="_blank"
            rel="noopener noreferrer"
            class="group w-10 h-10 bg-amber-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
            aria-label={footer.social.whatsapp}
          >
            <svg class="w-5 h-5 text-amber-200 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.306"/>
            </svg>
          </a>
        </div>
      </div>
      
      <!-- About Links -->
      <div>
        <h4 class="text-lg font-semibold text-amber-200 mb-4">{footer.sections.about.title}</h4>
        <ul class="space-y-2">
          {#each footer.sections.about.links as link}
            <li>
              <a 
                href={link.href}
                class="text-amber-100/80 hover:text-amber-200 transition-colors text-sm"
              >
                {link.text}
              </a>
            </li>
          {/each}
        </ul>
      </div>
      
      <!-- Products Links -->
      <div>
        <h4 class="text-lg font-semibold text-amber-200 mb-4">{footer.sections.products.title}</h4>
        <ul class="space-y-2">
          {#each footer.sections.products.links as link}
            <li>
              <a 
                href={link.href}
                class="text-amber-100/80 hover:text-amber-200 transition-colors text-sm"
              >
                {link.text}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
    
    <!-- Contact Info Section -->
    <div class="mt-12 pt-8 border-t border-amber-800">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Address -->
        <div class="flex items-start space-x-3">
          <svg class="w-5 h-5 text-amber-300 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <div>
            <p class="text-amber-200 font-medium text-sm">Endereço</p>
            <p class="text-amber-100/90 text-sm">{footer.sections.contact.address}</p>
            <p class="text-amber-100/90 text-sm">{location.address.city}, {location.address.state}</p>
          </div>
        </div>
        
        <!-- Phone -->
        <div class="flex items-start space-x-3">
          <svg class="w-5 h-5 text-amber-300 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          <div>
            <p class="text-amber-200 font-medium text-sm">Telefone</p>
            <a 
              href="tel:{footer.sections.contact.phone}"
              class="text-amber-100/90 hover:text-amber-200 transition-colors text-sm"
            >
              {footer.sections.contact.phone}
            </a>
            <br>
            <a 
              href="https://wa.me/{footer.sections.contact.whatsapp.replace(/[^\d]/g, '')}"
              target="_blank"
              rel="noopener noreferrer"
              class="text-amber-100/90 hover:text-amber-200 transition-colors text-sm"
            >
              WhatsApp: {footer.sections.contact.whatsapp}
            </a>
          </div>
        </div>
        
        <!-- Email -->
        <div class="flex items-start space-x-3">
          <svg class="w-5 h-5 text-amber-300 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <div>
            <p class="text-amber-200 font-medium text-sm">E-mail</p>
            <a 
              href="mailto:{footer.sections.contact.email}"
              class="text-amber-100/90 hover:text-amber-200 transition-colors text-sm break-all"
            >
              {footer.sections.contact.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Bottom Bar -->
  <div class="border-t border-amber-800 bg-amber-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <!-- Copyright -->
        <p class="text-amber-100/70 text-sm text-center md:text-left">
          {footer.copyright}
        </p>
        
        <!-- Back to Top Button -->
        <button
          onclick={scrollToTop}
          class="group inline-flex items-center space-x-2 text-amber-100/70 hover:text-amber-200 transition-colors text-sm"
          aria-label={siteContent.common.backToTop}
        >
          <span>{siteContent.common.backToTop}</span>
          <svg class="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</footer>