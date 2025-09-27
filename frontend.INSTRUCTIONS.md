You are an AI web-product engineer + copywriter. Your task: generate a complete **institutional (one-page) website** for a bakery with a gallery and menu, implemented as design and content deliverables that a developer can use to build a SvelteKit + Tailwind CSS v4 site.

Language & tone
- Content language: **Brazilian Portuguese (pt-BR)**.
- Tone: cozy, warm, artisanal, trustworthy. Short, friendly CTAs.

Technology & design constraints
- Framework: SvelteKit (deliver routes / page structure only — no full app code required).
- Styling: Tailwind CSS v4 utility classes (provide class suggestions for major components).
- Color palette (primary): `#FEF3C7` (cream), `#78350F` (deep brown), `#FBBF24` (warm gold).
- Typography: clean, readable, semi-serif or sans-serif pairings. Emphasize hierarchy (H1/H2/H3).
- Layout: responsive mobile-first, accessible (WCAG AA), good contrast, keyboard-navigable.
- Visuals: soft shadows, rounded cards, generous spacing, card grids for menu/gallery, image aspect ratio guidance (e.g., 4:3 for menu images, 1:1 or 3:2 for gallery thumbnails).

Required sections (one-page + lightbox gallery)
1. **Hero** — H1 must be exactly: `O Sabor da Tradição`. Subheading (1–2 lines). Primary CTA: "Encomendar pelo WhatsApp".
2. **Menu Highlights** — Grid of 3–5 best-selling items. Each: small high-quality image (placeholder URL), name, price (BRL), 1-line description (10–18 words), dietary tags optional. Include `alt` text and recommended image dimensions.
3. **Galeria** — Gallery grid (6 images recommended) with lightbox behavior, captions and `alt` text.
4. **Localização & Horário** — full address (string), opening hours (structured), small static map placeholder or embed instructions.
5. **Contato & Encomendas** — phone/WhatsApp CTA button (proper `https://wa.me/` format with placeholder number), contact form fields suggested (name, telefone, pedido, observações).
6. **Sobre / Nossa História** — 2–4 short paragraphs (45–80 words each) focusing on craftsmanship and local roots.
7. **Footer** — address, hours summary, social links placeholders, copyright.

SEO, meta & structured data
- Provide meta title (<=60 chars), meta description (120–155 chars) in pt-BR.
- Provide Open Graph tags (og:title, og:description, og:image placeholder).
- Provide **JSON-LD** structured data for `Bakery` / `LocalBusiness` with address, openingHours, telephone, url (placeholders).

Accessibility & performance notes
- Provide `alt` text for all images.
- Ensure color contrast meets WCAG AA; if a contrast is marginal, provide alternate darker/lighter hex suggestions.
- Suggest lazy-loading for gallery images and `loading="lazy"` attributes.
- Recommend image sizes and formats (WebP fallback).

Data & output format (strict)
- **Deliver everything as Markdown.** The Markdown should contain:
  1. A short “Pages / Routes” section listing site routes and map to sections (e.g., `/` -> hero, menu, gallery ...).
  2. The **full copywriting** in Brazilian Portuguese for every section and each CTA (final text to paste into templates).
  3. A single **JSON object** (pretty-printed code block) named `site_content` containing the copy and data. The JSON MUST include these keys and fill them with the copy you generated:
     ```json
     {
       "meta": {"title":"", "description":"", "og_image":""},
       "hero": {"title":"O Sabor da Tradição", "subtitle":"", "image_url":"", "image_alt": "", "cta_text":"", "cta_whatsapp":"https://wa.me/<PHONE>?text=<URL-ENCODED-TEXT>"},
       "menu": [
         {"id": 1, "item":"", "price":"", "description":"", "image_url":"", "image_alt":""}
       ],
       "gallery": [
         {"id": 1, "image_url":"", "caption":"", "image_alt":""}
       ],
       "location": {"address":"", "city":"", "state":"", "zip":"", "google_maps_embed":"" , "hours":[{"day":"Segunda", "open":"08:00", "close":"18:00"}]},
       "contact": {"phone":"", "whatsapp":"", "email":"", "form_fields":["nome","telefone","pedido","observacoes"]},
       "about": {"short":"", "long":""},
       "footer": {"copyright":"", "social":[{"name":"instagram","url":""}]},
       "structured_data": { /* JSON-LD object for LocalBusiness */ }
     }
     ```
  4. Example Tailwind v4 class suggestions for the hero, menu card, gallery thumbnail, and WhatsApp button.
  5. Accessibility & SEO checklist (3–6 bullet items).
- The JSON must embed the **actual copy** (in Portuguese) you generated — not placeholders — for all fields above. Use placeholder URLs for images but realistic file names (e.g., `/images/pao-de-queijo-1.webp`), and placeholder phone as `+55 11 91234-5678` (but include the properly formatted `wa.me` link).

Length & microcopy rules
- Hero subtitle: max 1 short sentence (<= 120 characters).
- Menu item description: 8–18 words.
- Gallery captions: 4–10 words.
- About: each paragraph 45–80 words.
- Meta description: 120–155 characters.

Output instruction to the agent
- Return one Markdown document only.
- Start with a one-line summary of deliverables (in pt-BR).
- Then list Pages/Routes.
- Then the full copy for each section (pt-BR).
- Then the `site_content` JSON code block (pretty-printed) with all copy filled in.
- Then Tailwind class suggestions and the accessibility/SEO checklist.
- Do not return other code files — focus on copy, JSON content, structure, and design notes the developer needs to implement the page.

Important: all content (copy + labels + meta) must be written in Brazilian Portuguese. Use natural, idiomatic phrasing appropriate for a neighborhood bakery.
