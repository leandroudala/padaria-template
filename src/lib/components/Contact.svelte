<!-- src/lib/components/Contact.svelte -->
<script lang="ts">
  import { siteContent } from '$lib/content';
  
  const { contact } = siteContent;
  
  // Form state
  let formData = $state({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  let isSubmitting = $state(false);
  let submitStatus = $state<'idle' | 'success' | 'error'>('idle');
  let errors = $state<Record<string, string>>({});
  
  // Validation functions
  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function validatePhone(phone: string): boolean {
    // Brazilian phone format validation
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone) || phone.length === 0; // Optional field
  }
  
  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Formato de telefone inválido';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Assunto é obrigatório';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    }
    
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }
  
  // Format phone input
  function formatPhone(value: string): string {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  }
  
  function handlePhoneInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const formatted = formatPhone(target.value);
    formData.phone = formatted;
    target.value = formatted;
  }
  
  async function handleSubmit(event: Event) {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    isSubmitting = true;
    submitStatus = 'idle';
    
    try {
      // Simulate form submission (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form on success
      formData = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      };
      
      submitStatus = 'success';
      errors = {};
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        submitStatus = 'idle';
      }, 5000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      submitStatus = 'error';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<section id="contact" class="py-20 bg-gradient-to-b from-white to-amber-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <div class="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
        Contato
      </div>
      
      <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
        {contact.title}
      </h2>
      
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        {contact.subtitle}
      </p>
    </div>
    
    <div class="grid lg:grid-cols-3 gap-12">
      <!-- Contact Form -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <!-- Success Message -->
          {#if submitStatus === 'success'}
            <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <p class="text-green-800 font-medium">{contact.form.success}</p>
              </div>
            </div>
          {/if}
          
          <!-- Error Message -->
          {#if submitStatus === 'error'}
            <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <p class="text-red-800 font-medium">{contact.form.error}</p>
              </div>
            </div>
          {/if}
          
          <form onsubmit={handleSubmit} class="space-y-6">
            <!-- Name and Email Row -->
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Name Field -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  {contact.form.name.label} *
                </label>
                <input
                  type="text"
                  id="name"
                  bind:value={formData.name}
                  placeholder={contact.form.name.placeholder}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors {errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}"
                  required
                />
                {#if errors.name}
                  <p class="mt-1 text-sm text-red-600">{errors.name}</p>
                {/if}
              </div>
              
              <!-- Email Field -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  {contact.form.email.label} *
                </label>
                <input
                  type="email"
                  id="email"
                  bind:value={formData.email}
                  placeholder={contact.form.email.placeholder}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors {errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}"
                  required
                />
                {#if errors.email}
                  <p class="mt-1 text-sm text-red-600">{errors.email}</p>
                {/if}
              </div>
            </div>
            
            <!-- Phone and Subject Row -->
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Phone Field -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  {contact.form.phone.label}
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  oninput={handlePhoneInput}
                  placeholder={contact.form.phone.placeholder}
                  maxlength="15"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors {errors.phone ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}"
                />
                {#if errors.phone}
                  <p class="mt-1 text-sm text-red-600">{errors.phone}</p>
                {/if}
              </div>
              
              <!-- Subject Field -->
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                  {contact.form.subject.label} *
                </label>
                <input
                  type="text"
                  id="subject"
                  bind:value={formData.subject}
                  placeholder={contact.form.subject.placeholder}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors {errors.subject ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}"
                  required
                />
                {#if errors.subject}
                  <p class="mt-1 text-sm text-red-600">{errors.subject}</p>
                {/if}
              </div>
            </div>
            
            <!-- Message Field -->
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                {contact.form.message.label} *
              </label>
              <textarea
                id="message"
                bind:value={formData.message}
                placeholder={contact.form.message.placeholder}
                rows="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none {errors.message ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}"
                required
              ></textarea>
              {#if errors.message}
                <p class="mt-1 text-sm text-red-600">{errors.message}</p>
              {/if}
            </div>
            
            <!-- Submit Button -->
            <div class="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                class="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {#if isSubmitting}
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {contact.form.sending}
                {:else}
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                  {contact.form.submit}
                {/if}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Contact Info -->
      <div class="space-y-8">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">{contact.info.title}</h3>
          
          <div class="space-y-6">
            <!-- Phone -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">{contact.info.phone}</p>
                <a 
                  href="tel:{siteContent.location.phone}"
                  class="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {siteContent.location.phone}
                </a>
              </div>
            </div>
            
            <!-- WhatsApp -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.306"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">{contact.info.whatsapp}</p>
                <a 
                  href="https://wa.me/5511949076185"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-green-600 hover:text-green-700 transition-colors"
                >
                  {siteContent.location.whatsapp}
                </a>
              </div>
            </div>
            
            <!-- Email -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">{contact.info.email}</p>
                <a 
                  href="mailto:{siteContent.location.email}"
                  class="text-purple-600 hover:text-purple-700 transition-colors break-all"
                >
                  {siteContent.location.email}
                </a>
              </div>
            </div>
          </div>
          
          <div class="mt-8 pt-6 border-t border-gray-200">
            <p class="text-center text-gray-600 font-medium">{contact.info.visit}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>