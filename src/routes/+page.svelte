<!-- Main Bakery Website -->
<script lang="ts">
  import Navigation from '$lib/components/Navigation.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Menu from '$lib/components/Menu.svelte';
  import About from '$lib/components/About.svelte';
  import Gallery from '$lib/components/Gallery.svelte';
  import Location from '$lib/components/Location.svelte';
  import Contact from '$lib/components/Contact.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { siteContent } from '$lib/content';
</script>

<svelte:head>
  <title>{siteContent.siteName} - {siteContent.siteTagline}</title>
  <meta name="description" content={siteContent.siteDescription} />
  <meta name="keywords" content="padaria, artesanal, pães, doces, salgados, São Paulo, tradicional, caseiro" />
  <meta name="author" content={siteContent.siteName} />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="{siteContent.siteName} - {siteContent.siteTagline}" />
  <meta property="og:description" content={siteContent.siteDescription} />
  <meta property="og:site_name" content={siteContent.siteName} />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{siteContent.siteName} - {siteContent.siteTagline}" />
  <meta name="twitter:description" content={siteContent.siteDescription} />
  
  <!-- Viewport and theme -->
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#d97706" />
</svelte:head>

<Navigation />

<main class="overflow-x-hidden">
  <Hero />
  <Menu />
  <About />
  <Gallery />
  <Location />
  <Contact />
</main>

<Footer />
