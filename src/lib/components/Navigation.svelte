<!-- src/lib/components/Navigation.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { siteContent } from '$lib/content';
  
  const { navigation, siteName } = siteContent;
  
  let isMenuOpen = $state(false);
  let isScrolled = $state(false);
  let activeSection = $state('home');
  
  const navItems = [
    { name: navigation.home, href: '#home' },
    { name: navigation.menu, href: '#menu' },
    { name: navigation.about, href: '#about' },
    { name: navigation.gallery, href: '#gallery' },
    { name: navigation.location, href: '#location' },
    { name: navigation.contact, href: '#contact' }
  ];
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    // Prevent body scroll when mobile menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }
  
  function closeMenu() {
    isMenuOpen = false;
    document.body.style.overflow = 'auto';
  }
  
  function scrollToSection(href: string, event: Event) {
    event.preventDefault();
    closeMenu();
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const headerHeight = 80; // Navigation height
      const elementPosition = targetElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }
  
  function handleScroll() {
    // Update scroll state for navbar background
    isScrolled = window.scrollY > 20;
    
    // Update active section based on scroll position
    const sections = navItems.map(item => item.href.substring(1));
    const scrollPosition = window.scrollY + 100; // Offset for better detection
    
    for (let i = sections.length - 1; i >= 0; i--) {
      const element = document.getElementById(sections[i]);
      if (element && element.offsetTop <= scrollPosition) {
        activeSection = sections[i];
        break;
      }
    }
  }
  
  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial state
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<nav class="fixed top-0 left-0 right-0 z-40 transition-all duration-300 {isScrolled 
  ? 'bg-white/95 backdrop-blur-md shadow-lg' 
  : 'bg-transparent'}">
  
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-20">
      <!-- Logo/Brand -->
      <div class="flex-shrink-0">
        <a 
          href="#home"
          onclick={(e) => scrollToSection('#home', e)}
          class="flex items-center space-x-3 group"
        >
          <!-- Logo Icon -->
          <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          </div>
          
          <!-- Brand Text -->
          <div class="hidden sm:block">
            <h1 class="text-xl font-bold {isScrolled ? 'text-gray-900' : 'text-white'} transition-colors duration-300">
              {siteName}
            </h1>
            <p class="text-xs {isScrolled ? 'text-gray-600' : 'text-white/80'} transition-colors duration-300">
              {siteContent.siteTagline}
            </p>
          </div>
        </a>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:block">
        <div class="flex items-center space-x-8">
          {#each navItems as item}
            <a
              href={item.href}
              onclick={(e) => scrollToSection(item.href, e)}
              class="relative px-3 py-2 text-sm font-medium transition-all duration-300 group {
                activeSection === item.href.substring(1)
                  ? isScrolled 
                    ? 'text-amber-600' 
                    : 'text-amber-200'
                  : isScrolled 
                    ? 'text-gray-700 hover:text-amber-600' 
                    : 'text-white/90 hover:text-amber-200'
              }"
            >
              {item.name}
              
              <!-- Active indicator -->
              <span class="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 {
                activeSection === item.href.substring(1) ? 'scale-x-100' : ''
              }"></span>
            </a>
          {/each}
        </div>
      </div>
      
      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button
          onclick={toggleMenu}
          class="inline-flex items-center justify-center p-2 rounded-md {isScrolled 
            ? 'text-gray-700 hover:text-amber-600 hover:bg-gray-100' 
            : 'text-white hover:text-amber-200 hover:bg-white/10'} transition-colors duration-300"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg class="w-6 h-6 {isMenuOpen ? 'hidden' : 'block'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg class="w-6 h-6 {isMenuOpen ? 'block' : 'hidden'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
  
  <!-- Mobile menu -->
  <div class="md:hidden transform transition-all duration-300 {isMenuOpen 
    ? 'translate-y-0 opacity-100' 
    : '-translate-y-full opacity-0 pointer-events-none'}">
    
    <div class="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-200">
      <div class="px-4 py-6 space-y-1">
        {#each navItems as item}
          <a
            href={item.href}
            onclick={(e) => scrollToSection(item.href, e)}
            class="block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 {
              activeSection === item.href.substring(1)
                ? 'text-amber-600 bg-amber-50'
                : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
            }"
          >
            {item.name}
          </a>
        {/each}
        
        <!-- Mobile Contact Info -->
        <div class="pt-6 mt-6 border-t border-gray-200">
          <div class="space-y-3">
            <a 
              href="tel:{siteContent.location.phone}"
              class="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-amber-600 transition-colors"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              {siteContent.location.phone}
            </a>
            
            <a 
              href="https://wa.me/{siteContent.location.whatsapp.replace(/[^\d]/g, '')}"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.306"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>

<!-- Mobile menu overlay -->
{#if isMenuOpen}
  <div 
    class="fixed inset-0 bg-black/20 z-30 md:hidden"
    onclick={closeMenu}
    aria-hidden="true"
  ></div>
{/if}