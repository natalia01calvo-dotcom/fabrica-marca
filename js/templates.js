// EVOREN — Fábrica de assets: motor de plantillas reutilizables
// Cada plantilla es una función pura: data -> HTML (marca real, no texto plano).

const EvTpl = (() => {

  function esc(s) {
    if (s === undefined || s === null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function nl2br(s) {
    return esc(s).replace(/\n/g, '<br>');
  }

  function logo(size = 'md', onLight = false) {
    const mark = `
      <div class="ev-logo ev-logo-mark-${size}">
        <img src="${EVOREN.logoIsotipoDataUri}" alt="EVOREN">
        <span class="ev-logo-word ev-logo-word-${size}">EVOREN</span>
      </div>`;
    // No existe lockup para fondo claro en el design system: sobre superficie
    // clara el lockup va dentro de un contenedor ink (regla del readme).
    return onLight ? `<div class="ev-logo-on-light">${mark}</div>` : mark;
  }

  function footer(line) {
    return `
      <div class="ev-footer">
        <span class="ev-footer-line">${esc(line || 'EVOREN · evoren.co')}</span>
        ${logo('sm')}
      </div>`;
  }

  function parseKeyvals(raw) {
    if (!raw) return [];
    return raw.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
      const i = line.indexOf(':');
      if (i === -1) return { label: '', value: line };
      return { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
    });
  }

  function datosChips(raw) {
    const items = parseKeyvals(raw);
    if (!items.length) return '';
    return `<div class="ev-datos">${items.map(d =>
      `<div class="ev-dato-chip">${d.label ? `<b>${esc(d.label)}</b>` : ''}${esc(d.value)}</div>`
    ).join('')}</div>`;
  }

  function itemList(raw) {
    const items = parseKeyvals(raw);
    if (!items.length) return '';
    return `<ul class="ev-item-list">${items.map(i =>
      `<li><span>${esc(i.label || i.value)}</span>${i.label ? `<span class="ev-item-val">${esc(i.value)}</span>` : ''}</li>`
    ).join('')}</ul>`;
  }

  function parseSlides(raw) {
    if (!raw) return [];
    return raw.split(/\n-{3,}\n/).map(block => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      return { titulo: lines[0] || '', texto: lines.slice(1).join(' ') };
    }).filter(s => s.titulo);
  }

  function mediaDiv(dataUrl, extraClass = '') {
    if (!dataUrl) return '';
    return `<div class="ev-media ${extraClass}" style="background-image:url('${dataUrl}')"></div>`;
  }

  function bg() {
    return `<div class="ev-bg-arch"></div>`;
  }

  // ---------------------------------------------------------------
  // 1. POST CUADRADO
  // ---------------------------------------------------------------
  function postCuadrado(d) {
    return `
      <div class="ev-canvas ev-size-post tpl-post-cuadrado">
        ${bg()}
        ${mediaDiv(d.imagen)}
        <div class="ev-content">
          ${logo('md')}
          <div class="ev-rule-lima"></div>
          <div class="ev-titular">${nl2br(d.titulo)}</div>
          ${d.texto ? `<div class="ev-cuerpo">${nl2br(d.texto)}</div>` : ''}
          ${datosChips(d.datos)}
        </div>
        ${footer(d.pie)}
      </div>`;
  }

  // ---------------------------------------------------------------
  // 2. QUOTE CARD
  // ---------------------------------------------------------------
  function quoteCard(d) {
    return `
      <div class="ev-canvas ev-size-quote tpl-quote">
        ${bg()}
        ${logo('sm')}
        <div class="ev-quote-mark">&ldquo;</div>
        <div class="ev-titular">${nl2br(d.titulo)}</div>
        <div class="ev-rule-lima"></div>
        ${d.texto ? `<div class="ev-autor">${esc(d.texto)}</div>` : ''}
        ${footer(d.pie)}
      </div>`;
  }

  // ---------------------------------------------------------------
  // 3. BANNER HORIZONTAL
  // ---------------------------------------------------------------
  function bannerHorizontal(d) {
    return `
      <div class="ev-canvas ev-size-banner tpl-banner">
        ${bg()}
        ${mediaDiv(d.imagen)}
        <div class="ev-content">
          ${logo('md')}
          <div class="ev-rule-lima"></div>
          <div class="ev-titular">${nl2br(d.titulo)}</div>
          ${d.texto ? `<div class="ev-subtitular">${nl2br(d.texto)}</div>` : ''}
          ${datosChips(d.datos)}
        </div>
        ${footer(d.pie)}
      </div>`;
  }

  // ---------------------------------------------------------------
  // 4. HISTORIA VERTICAL
  // ---------------------------------------------------------------
  function historiaVertical(d) {
    return `
      <div class="ev-canvas ev-size-historia tpl-historia">
        ${mediaDiv(d.imagen)}
        ${bg()}
        <div style="position:absolute;top:88px;left:76px;z-index:2;">${logo('md')}</div>
        <div class="ev-content">
          ${d.eyebrow ? `<div class="ev-eyebrow">${esc(d.eyebrow)}</div>` : ''}
          <div class="ev-titular">${nl2br(d.titulo)}</div>
          ${d.texto ? `<div class="ev-cuerpo">${nl2br(d.texto)}</div>` : ''}
          <div class="ev-rule-lima"></div>
          ${datosChips(d.datos)}
        </div>
      </div>`;
  }

  // ---------------------------------------------------------------
  // 5. OFERTA / PROPUESTA COMERCIAL — 2 páginas (portada + contenido)
  // ---------------------------------------------------------------
  function ofertaComercialPages(d) {
    const portada = `
      <div class="ev-canvas ev-doc ev-size-doc tpl-doc-page">
        <div class="ev-cover-block">
          ${bg()}
          <div style="position:relative;z-index:2;">${logo('lg')}</div>
          <div style="position:relative;z-index:2;">
            <div class="ev-subtitular">Propuesta comercial</div>
            <div class="ev-titular" style="margin-top:18px;">${nl2br(d.titulo)}</div>
            ${d.cliente ? `<div class="ev-cuerpo" style="color:var(--ev-gris-claro);margin-top:18px;">Preparado para ${esc(d.cliente)}</div>` : ''}
          </div>
          <div style="position:relative;z-index:2;" class="ev-footer-line">${esc(new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }))}</div>
        </div>
      </div>`;
    const contenido = `
      <div class="ev-canvas ev-doc ev-size-doc tpl-doc-page">
        ${logo('sm', true)}
        <div class="ev-eyebrow" style="margin-top:36px;">Resumen</div>
        <div class="ev-titular" style="font-size:34px;margin-top:10px;">${esc(d.titulo)}</div>
        ${d.texto ? `<div class="ev-cuerpo" style="margin-top:16px;">${nl2br(d.texto)}</div>` : ''}
        <div class="ev-rule-lima"></div>
        ${d.datos ? `<div class="ev-eyebrow">Alcance y valores</div>${itemList(d.datos)}` : ''}
        <div class="ev-footer">
          <span class="ev-footer-line">EVOREN · Confianza para transformar, desarrollar e invertir.</span>
        </div>
      </div>`;
    return [portada, contenido];
  }

  // ---------------------------------------------------------------
  // 6. ONE-PAGER DE SERVICIO — 1 página
  // ---------------------------------------------------------------
  function onePagerServicio(d) {
    return `
      <div class="ev-canvas ev-doc ev-size-doc tpl-doc-page">
        ${logo('sm', true)}
        <div class="ev-eyebrow" style="margin-top:40px;">Servicio</div>
        <div class="ev-titular" style="margin-top:10px;">${nl2br(d.titulo)}</div>
        ${d.texto ? `<div class="ev-cuerpo" style="margin-top:16px;">${nl2br(d.texto)}</div>` : ''}
        ${mediaDiv(d.imagen)}
        <div class="ev-rule-lima"></div>
        ${d.datos ? `<div class="ev-eyebrow">Qué incluye</div>${itemList(d.datos)}` : ''}
        <div class="ev-footer">
          <span class="ev-footer-line">${esc(d.pie || 'EVOREN · evoren.co')}</span>
        </div>
      </div>`;
  }

  // ---------------------------------------------------------------
  // 7. DECK CORTO — N slides (5-8) a partir de texto estructurado
  // ---------------------------------------------------------------
  function deckCorto(d) {
    const slides = parseSlides(d.slides);
    const portada = `
      <div class="ev-canvas ev-size-slide tpl-slide tpl-slide-cover">
        ${bg()}
        ${mediaDiv(d.imagen)}
        ${logo('lg')}
        ${d.eyebrow ? `<div class="ev-eyebrow" style="margin-top:34px;">${esc(d.eyebrow)}</div>` : ''}
        <div class="ev-titular">${nl2br(d.titulo)}</div>
        ${d.texto ? `<div class="ev-subtitular">${nl2br(d.texto)}</div>` : ''}
        <div class="ev-rule-lima"></div>
      </div>`;
    const content = slides.map((s, i) => `
      <div class="ev-canvas ev-size-slide tpl-slide">
        ${bg()}
        ${logo('sm')}
        <div class="ev-titular">${nl2br(s.titulo)}</div>
        ${s.texto ? `<div class="ev-cuerpo">${nl2br(s.texto)}</div>` : ''}
        <div class="ev-rule-lima"></div>
        <div class="ev-slide-index">${String(i + 2).padStart(2, '0')} / ${String(slides.length + 1).padStart(2, '0')}</div>
      </div>`);
    return [portada, ...content];
  }

  // ---------------------------------------------------------------
  // 8. PORTADA DE PRESENTACIÓN — 1 slide
  // ---------------------------------------------------------------
  function portadaPresentacion(d) {
    return `
      <div class="ev-canvas ev-size-slide tpl-slide tpl-slide-cover">
        ${bg()}
        ${mediaDiv(d.imagen)}
        ${logo('lg')}
        ${d.eyebrow ? `<div class="ev-eyebrow" style="margin-top:34px;">${esc(d.eyebrow)}</div>` : ''}
        <div class="ev-titular">${nl2br(d.titulo)}</div>
        ${d.texto ? `<div class="ev-subtitular">${nl2br(d.texto)}</div>` : ''}
        <div class="ev-rule-lima"></div>
        ${d.datos ? datosChips(d.datos) : ''}
      </div>`;
  }

  // ---------------------------------------------------------------
  // 9. LANDING DE CAMPAÑA — documento HTML completo standalone
  // ---------------------------------------------------------------
  function landingCampana(d) {
    const beneficios = parseKeyvals(d.datos);
    const heroBg = d.imagen ? `background-image:url('${d.imagen}');background-size:cover;background-position:center;` : '';
    return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.titulo)} — EVOREN</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display+SC:wght@400;700&family=Syne:wght@400;600;700;800&family=Montserrat:wght@400;500;600;700&display=swap');
  :root{
    --azul:#002642; --lima:#CCFF00; --negro:#111111; --gris:#333333; --blanco:#F2F2F2; --grisclaro:#A8A8A5;
  }
  *{box-sizing:border-box;}
  body{margin:0;background:var(--negro);color:var(--blanco);font-family:'Montserrat',sans-serif;}
  .logo{display:flex;align-items:center;gap:12px;}
  .logo img{width:36px;height:36px;}
  .logo span{font-family:'Syne',sans-serif;font-weight:800;letter-spacing:.22em;text-transform:uppercase;font-size:16px;}
  nav{display:flex;justify-content:space-between;align-items:center;padding:28px 6vw;position:relative;z-index:3;}
  .cta{display:inline-flex;align-items:center;gap:8px;background:var(--lima);color:var(--negro);font-weight:700;border-radius:999px;padding:14px 28px;text-decoration:none;}
  header.hero{position:relative;padding:8vh 6vw 12vh;${heroBg}overflow:hidden;}
  header.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg, rgba(17,17,17,.35) 0%, rgba(17,17,17,.92) 85%);z-index:0;}
  header.hero .inner{position:relative;z-index:2;max-width:760px;}
  .eyebrow{font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--lima);font-size:14px;}
  h1{font-family:'Syne',sans-serif;font-weight:700;font-size:clamp(36px,6vw,68px);line-height:1.05;margin:18px 0;}
  .sub{font-family:'Playfair Display SC',serif;font-weight:400;color:var(--grisclaro);font-size:clamp(18px,2.2vw,24px);max-width:640px;}
  .rule{width:70px;height:6px;background:var(--lima);margin:26px 0;}
  section.beneficios{padding:9vh 6vw;background:var(--blanco);color:var(--negro);}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:28px;margin-top:40px;}
  .card{border:1px solid rgba(0,38,66,.15);border-radius:4px;padding:28px;background:rgba(0,38,66,.03);}
  .card b{color:var(--azul);display:block;font-size:20px;margin-bottom:8px;font-family:'Syne',sans-serif;font-weight:700;}
  .card span{color:var(--gris);font-size:16px;}
  section.cierre{padding:11vh 6vw;text-align:center;background:var(--negro);}
  section.cierre h2{font-family:'Syne',sans-serif;font-weight:700;font-size:clamp(28px,4vw,46px);max-width:700px;margin:0 auto 30px;}
  footer{padding:36px 6vw;display:flex;justify-content:space-between;align-items:center;color:var(--grisclaro);font-size:14px;border-top:1px solid rgba(242,242,242,.08);}
</style>
</head>
<body>
  <nav>
    <div class="logo"><img src="${EVOREN.logoIsotipoDataUri}" alt="EVOREN"><span>EVOREN</span></div>
    <a class="cta" href="#contacto">${esc(d.ctaTexto || 'Quiero saber más')}</a>
  </nav>
  <header class="hero">
    <div class="inner">
      ${d.eyebrow ? `<div class="eyebrow">${esc(d.eyebrow)}</div>` : ''}
      <h1>${nl2br(d.titulo)}</h1>
      ${d.texto ? `<div class="sub">${nl2br(d.texto)}</div>` : ''}
      <div class="rule"></div>
      <a class="cta" href="#contacto">${esc(d.ctaTexto || 'Quiero saber más')}</a>
    </div>
  </header>
  ${beneficios.length ? `
  <section class="beneficios">
    <div class="eyebrow" style="color:var(--azul);">Por qué EVOREN</div>
    <div class="grid">
      ${beneficios.map(b => `<div class="card"><b>${esc(b.label || b.value)}</b>${b.label ? `<span>${esc(b.value)}</span>` : ''}</div>`).join('')}
    </div>
  </section>` : ''}
  <section class="cierre" id="contacto">
    <h2>${esc(d.cierre || 'Hablemos de tu próximo proyecto.')}</h2>
    <a class="cta" href="mailto:hola@evoren.co">${esc(d.ctaTexto || 'Quiero saber más')}</a>
  </section>
  <footer>
    <span>EVOREN · evoren.co</span>
    <span>Confianza para transformar, desarrollar e invertir.</span>
  </footer>
</body>
</html>`;
  }

  return {
    esc, parseKeyvals, parseSlides,
    postCuadrado, quoteCard, bannerHorizontal, historiaVertical,
    ofertaComercialPages, onePagerServicio,
    deckCorto, portadaPresentacion,
    landingCampana
  };
})();
