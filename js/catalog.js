// EVOREN — Catálogo de categorías y opciones de asset (fuente de verdad de la app)

const EvCatalog = {
  redes: {
    label: 'Redes sociales',
    hint: 'Piezas para Instagram, LinkedIn y demás — PNG listo para publicar.',
    options: {
      'post-cuadrado': {
        label: 'Post cuadrado', sub: '1080 × 1080 · PNG',
        format: 'png', dims: { w: 1080, h: 1080 },
        fields: [
          { key: 'titulo', label: 'Título', type: 'text', required: true, placeholder: 'Ej: Tu remodelación, sin sorpresas' },
          { key: 'texto', label: 'Texto / copy', type: 'textarea', placeholder: 'Bajada de 1-2 líneas...' },
          { key: 'datos', label: 'Datos clave (opcional)', type: 'keyvals', placeholder: 'Ahorro: hasta 20%\nEntrega: 45 días' },
          { key: 'imagen', label: 'Imagen de fondo (opcional)', type: 'image' },
          { key: 'pie', label: 'Línea de pie (opcional)', type: 'text', placeholder: 'EVOREN · evoren.co' },
        ],
        render: (d) => EvTpl.postCuadrado(d)
      },
      'quote-card': {
        label: 'Quote card', sub: '1080 × 1080 · PNG',
        format: 'png', dims: { w: 1080, h: 1080 },
        fields: [
          { key: 'titulo', label: 'Cita', type: 'textarea', required: true, placeholder: 'Escribe la frase destacada...' },
          { key: 'texto', label: 'Autor / atribución (opcional)', type: 'text', placeholder: 'Ej: Cliente EVOREN, Bogotá' },
          { key: 'pie', label: 'Línea de pie (opcional)', type: 'text', placeholder: 'EVOREN · evoren.co' },
        ],
        render: (d) => EvTpl.quoteCard(d)
      },
      'banner-horizontal': {
        label: 'Banner horizontal', sub: '1600 × 900 · PNG',
        format: 'png', dims: { w: 1600, h: 900 },
        fields: [
          { key: 'titulo', label: 'Título', type: 'text', required: true },
          { key: 'texto', label: 'Subtítulo (opcional)', type: 'textarea' },
          { key: 'datos', label: 'Datos clave (opcional)', type: 'keyvals', placeholder: 'Financiación: hasta 36 meses' },
          { key: 'imagen', label: 'Imagen lateral (opcional)', type: 'image' },
          { key: 'pie', label: 'Línea de pie (opcional)', type: 'text' },
        ],
        render: (d) => EvTpl.bannerHorizontal(d)
      },
      'historia-vertical': {
        label: 'Historia vertical', sub: '1080 × 1920 · PNG',
        format: 'png', dims: { w: 1080, h: 1920 },
        fields: [
          { key: 'eyebrow', label: 'Etiqueta superior (opcional)', type: 'text', placeholder: 'NUEVO PROYECTO' },
          { key: 'titulo', label: 'Título', type: 'text', required: true },
          { key: 'texto', label: 'Texto (opcional)', type: 'textarea' },
          { key: 'datos', label: 'Datos clave (opcional)', type: 'keyvals' },
          { key: 'imagen', label: 'Imagen de fondo (opcional)', type: 'image' },
        ],
        render: (d) => EvTpl.historiaVertical(d)
      },
    }
  },

  comercial: {
    label: 'Comercial',
    hint: 'Documentos para enviar a cliente — PDF con diseño de marca.',
    options: {
      'oferta-comercial': {
        label: 'Oferta / propuesta comercial', sub: 'PDF · portada + contenido',
        format: 'pdf-multi', dims: { w: 1240, h: 1754 },
        fields: [
          { key: 'titulo', label: 'Título de la propuesta', type: 'text', required: true, placeholder: 'Ej: Remodelación integral apartamento' },
          { key: 'cliente', label: 'Cliente', type: 'text', placeholder: 'Nombre del cliente o proyecto' },
          { key: 'texto', label: 'Resumen', type: 'textarea', placeholder: 'Describe el alcance del proyecto...' },
          { key: 'datos', label: 'Alcance y valores (uno por línea)', type: 'items', placeholder: 'Diseño y planos: $1.200.000\nEjecución de obra: $18.500.000\nAcabados premium: incluido' },
        ],
        render: (d) => EvTpl.ofertaComercialPages(d)
      },
      'one-pager-servicio': {
        label: 'One-pager de servicio', sub: 'PDF · 1 página',
        format: 'pdf-single', dims: { w: 1240, h: 1754 },
        fields: [
          { key: 'titulo', label: 'Nombre del servicio', type: 'text', required: true },
          { key: 'texto', label: 'Descripción', type: 'textarea' },
          { key: 'datos', label: 'Qué incluye (uno por línea)', type: 'items', placeholder: 'Visita técnica: incluida\nGarantía: 12 meses' },
          { key: 'imagen', label: 'Imagen (opcional)', type: 'image' },
          { key: 'pie', label: 'Línea de pie (opcional)', type: 'text' },
        ],
        render: (d) => EvTpl.onePagerServicio(d)
      },
    }
  },

  presentaciones: {
    label: 'Presentaciones',
    hint: 'Slides con identidad EVOREN — PDF horizontal.',
    options: {
      'deck-corto': {
        label: 'Deck corto (5-8 slides)', sub: 'PDF · portada + slides',
        format: 'pdf-multi', dims: { w: 1920, h: 1080 },
        fields: [
          { key: 'eyebrow', label: 'Etiqueta superior (opcional)', type: 'text', placeholder: 'PRESENTACIÓN' },
          { key: 'titulo', label: 'Título del deck', type: 'text', required: true },
          { key: 'texto', label: 'Subtítulo de portada (opcional)', type: 'textarea' },
          { key: 'imagen', label: 'Imagen de portada (opcional)', type: 'image' },
          {
            key: 'slides', label: 'Slides (título en la primera línea, texto debajo; separa cada slide con una línea "---")', type: 'textarea', required: true, rows: 10,
            placeholder: 'El problema\nEl sector inmobiliario aún opera con incertidumbre.\n---\nNuestra solución\nProcesos claros, tecnología y acompañamiento.\n---\nCómo funciona\nCotiza, financia y haz seguimiento desde un solo lugar.'
          },
        ],
        render: (d) => EvTpl.deckCorto(d)
      },
      'portada-presentacion': {
        label: 'Portada de presentación', sub: '1920 × 1080 · PNG o PDF',
        format: 'png-or-pdf', dims: { w: 1920, h: 1080 },
        fields: [
          { key: 'eyebrow', label: 'Etiqueta superior (opcional)', type: 'text' },
          { key: 'titulo', label: 'Título', type: 'text', required: true },
          { key: 'texto', label: 'Subtítulo (opcional)', type: 'textarea' },
          { key: 'datos', label: 'Datos clave (opcional)', type: 'keyvals' },
          { key: 'imagen', label: 'Imagen de fondo (opcional)', type: 'image' },
        ],
        render: (d) => EvTpl.portadaPresentacion(d)
      },
    }
  },

  landing: {
    label: 'Landing page de campaña',
    hint: 'Página HTML completa con tu marca, lista para publicar.',
    special: true,
    options: {
      'landing-campana': {
        label: 'Landing de campaña', sub: 'HTML autocontenido',
        format: 'html',
        fields: [
          { key: 'eyebrow', label: 'Etiqueta superior (opcional)', type: 'text', placeholder: 'CAMPAÑA' },
          { key: 'titulo', label: 'Título (hero)', type: 'text', required: true },
          { key: 'texto', label: 'Texto de apoyo', type: 'textarea' },
          { key: 'datos', label: 'Beneficios (uno por línea: Título: Descripción)', type: 'items', placeholder: 'Transparencia: Presupuesto claro desde el día uno\nMétodo: Procesos estandarizados y seguimiento\nFinanciación: Planes accesibles a tu medida' },
          { key: 'cierre', label: 'Frase de cierre (opcional)', type: 'text', placeholder: 'Hablemos de tu próximo proyecto.' },
          { key: 'ctaTexto', label: 'Texto del botón CTA (opcional)', type: 'text', placeholder: 'Quiero saber más' },
          { key: 'imagen', label: 'Imagen de portada (opcional)', type: 'image' },
        ],
        render: (d) => EvTpl.landingCampana(d)
      }
    }
  }
};

const EvCategoryOrder = ['redes', 'comercial', 'presentaciones', 'landing'];
