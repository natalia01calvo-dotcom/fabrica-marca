// EVOREN — Fábrica de assets: estado y render de la app

const EvApp = (() => {
  const root = document.getElementById('ev-root');
  const stage = document.getElementById('ev-stage');

  let state = { screen: 'category', categoryId: null, optionId: null, formData: {}, pageIndex: 0 };
  let debounceTimer = null;

  function setState(patch) {
    state = { ...state, ...patch };
    render();
  }

  function goCategory() { state = { screen: 'category', categoryId: null, optionId: null, formData: {}, pageIndex: 0 }; render(); }
  function goOption(categoryId) { state = { screen: 'option', categoryId, optionId: null, formData: {}, pageIndex: 0 }; render(); }
  function goForm(categoryId, optionId) {
    state = { screen: 'form', categoryId, optionId, formData: {}, pageIndex: 0 };
    render();
  }

  // ---------------------------------------------------------------
  // Render raíz
  // ---------------------------------------------------------------
  function render() {
    if (state.screen === 'category') return renderCategoryScreen();
    if (state.screen === 'option') return renderOptionScreen();
    if (state.screen === 'form') return renderFormScreen();
  }

  function topbar() {
    const crumbs = [];
    crumbs.push(state.screen === 'category'
      ? `<span class="current">Categorías</span>`
      : `<button data-nav="category">Categorías</button>`);
    if (state.categoryId) {
      const cat = EvCatalog[state.categoryId];
      crumbs.push('<span>/</span>');
      crumbs.push(state.screen === 'option'
        ? `<span class="current">${cat.label}</span>`
        : `<button data-nav="option" data-cat="${state.categoryId}">${cat.label}</button>`);
    }
    if (state.optionId) {
      const opt = EvCatalog[state.categoryId].options[state.optionId];
      crumbs.push('<span>/</span>');
      crumbs.push(`<span class="current">${opt.label}</span>`);
    }
    return `
      <div class="ev-topbar">
        <div class="brand">
          <img src="${EVOREN.logoIsotipoDataUri}" alt="EVOREN">
          <span class="word">EVOREN</span>
          <span class="sep">|</span>
          <span class="desc">Fábrica de assets de marca</span>
        </div>
        <div class="ev-breadcrumb">${crumbs.join('')}</div>
      </div>`;
  }

  function attachTopbarNav() {
    root.querySelectorAll('[data-nav="category"]').forEach(b => b.onclick = goCategory);
    root.querySelectorAll('[data-nav="option"]').forEach(b => b.onclick = () => goOption(b.dataset.cat));
  }

  // ---------------------------------------------------------------
  // Pantalla 1: categorías
  // ---------------------------------------------------------------
  const CATEGORY_ICON = { redes: '◐', comercial: '▤', presentaciones: '▦', landing: '◈' };

  function renderCategoryScreen() {
    const cards = EvCategoryOrder.map(id => {
      const cat = EvCatalog[id];
      const count = Object.keys(cat.options).length;
      return `
        <button class="ev-card" data-cat="${id}">
          <div class="ev-card-icon">${CATEGORY_ICON[id]}</div>
          <h3>${cat.label}</h3>
          <p>${cat.hint}</p>
          <span class="ev-card-sub">${count} ${count === 1 ? 'opción' : 'opciones'}</span>
        </button>`;
    }).join('');

    root.innerHTML = `
      <div class="ev-app">
        ${topbar()}
        <div class="ev-main">
          <h1 class="ev-step-title">¿Qué quieres crear?</h1>
          <p class="ev-step-sub">Elige una categoría para ver las piezas disponibles.</p>
          <div class="ev-grid">${cards}</div>
        </div>
      </div>`;
    attachTopbarNav();
    root.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => goOption(b.dataset.cat));
  }

  // ---------------------------------------------------------------
  // Pantalla 2: opciones dentro de la categoría
  // ---------------------------------------------------------------
  function renderOptionScreen() {
    const cat = EvCatalog[state.categoryId];
    const cards = Object.entries(cat.options).map(([id, opt]) => `
      <button class="ev-card" data-opt="${id}">
        <div class="ev-card-icon">${CATEGORY_ICON[state.categoryId]}</div>
        <h3>${opt.label}</h3>
        <p>${opt.sub}</p>
      </button>`).join('');

    root.innerHTML = `
      <div class="ev-app">
        ${topbar()}
        <div class="ev-main">
          <h1 class="ev-step-title">${cat.label}</h1>
          <p class="ev-step-sub">${cat.hint}</p>
          <div class="ev-grid">${cards}</div>
        </div>
      </div>`;
    attachTopbarNav();
    root.querySelectorAll('[data-opt]').forEach(b => b.onclick = () => goForm(state.categoryId, b.dataset.opt));
  }

  // ---------------------------------------------------------------
  // Pantalla 3: formulario + preview en vivo
  // ---------------------------------------------------------------
  function fieldHtml(f) {
    const val = state.formData[f.key] || '';
    if (f.type === 'text') {
      return `
        <div class="ev-field">
          <label>${f.label}${f.required ? '<span class="req">*</span>' : ''}</label>
          <input type="text" data-field="${f.key}" value="${EvTpl.esc(val)}" placeholder="${EvTpl.esc(f.placeholder || '')}">
        </div>`;
    }
    if (f.type === 'textarea' || f.type === 'keyvals' || f.type === 'items') {
      const hint = f.type === 'keyvals' ? 'Una línea por dato — formato "Etiqueta: Valor" (opcional el ":").'
        : f.type === 'items' ? 'Una línea por ítem — formato "Nombre: Valor".'
        : '';
      return `
        <div class="ev-field">
          <label>${f.label}${f.required ? '<span class="req">*</span>' : ''}</label>
          <textarea data-field="${f.key}" rows="${f.rows || 4}" placeholder="${EvTpl.esc(f.placeholder || '')}">${EvTpl.esc(val)}</textarea>
          ${hint ? `<div class="hint">${hint}</div>` : ''}
        </div>`;
    }
    if (f.type === 'image') {
      if (val) {
        return `
          <div class="ev-field">
            <label>${f.label}</label>
            <div class="ev-image-preview">
              <img src="${val}" alt="">
              <button type="button" data-remove-image="${f.key}">Quitar imagen</button>
            </div>
          </div>`;
      }
      return `
        <div class="ev-field">
          <label>${f.label}</label>
          <div class="ev-image-drop">
            Arrastra o haz clic para subir una imagen
            <input type="file" accept="image/*" data-field-image="${f.key}">
          </div>
        </div>`;
    }
    return '';
  }

  function collectPages(opt, data) {
    const result = opt.render(data);
    return Array.isArray(result) ? result : [result];
  }

  function fillStage(opt, pages) {
    stage.innerHTML = '';
    pages.forEach(html => {
      const wrap = document.createElement('div');
      wrap.innerHTML = html;
      stage.appendChild(wrap.firstElementChild);
    });
  }

  function extFor(format) {
    if (format === 'png') return 'png';
    if (format === 'pdf-single' || format === 'pdf-multi') return 'pdf';
    if (format === 'html') return 'html';
    return 'png';
  }

  function missingRequired(opt) {
    return opt.fields.filter(f => f.required && !(state.formData[f.key] || '').trim());
  }

  function renderFormScreen() {
    const cat = EvCatalog[state.categoryId];
    const opt = cat.options[state.optionId];
    const isHtml = opt.format === 'html';
    const isMultiDims = !isHtml;
    const missing = missingRequired(opt);
    const filename = EvExport.buildFilename(state.categoryId, state.optionId, state.formData.titulo || '', extFor(opt.format === 'png-or-pdf' ? 'png' : opt.format));

    let previewInner = '';
    let pages = [];
    if (isHtml) {
      const fullHtml = opt.render(state.formData);
      previewInner = `<iframe id="ev-landing-frame" style="height:640px;"></iframe>`;
      pages = [fullHtml];
    } else {
      pages = collectPages(opt, state.formData);
      fillStage(opt, pages);
      const scale = Math.min(1, 560 / opt.dims.w);
      previewInner = `
        <div class="ev-preview-viewport" style="width:${Math.round(opt.dims.w * scale)}px;height:${Math.round(opt.dims.h * scale)}px;">
          <div class="ev-preview-scaler" id="ev-preview-scaler" style="transform:scale(${scale});width:${opt.dims.w}px;height:${opt.dims.h}px;"></div>
        </div>
        ${pages.length > 1 ? `
        <div class="ev-page-nav">
          <button id="ev-page-prev" ${state.pageIndex === 0 ? 'disabled' : ''}>‹</button>
          <span>Página ${state.pageIndex + 1} de ${pages.length}</span>
          <button id="ev-page-next" ${state.pageIndex === pages.length - 1 ? 'disabled' : ''}>›</button>
        </div>` : ''}
      `;
    }

    let exportButtons = '';
    if (opt.format === 'png') exportButtons = `<button class="ev-btn" id="ev-export" ${missing.length ? 'disabled' : ''}>Descargar PNG</button>`;
    else if (opt.format === 'pdf-single') exportButtons = `<button class="ev-btn" id="ev-export" ${missing.length ? 'disabled' : ''}>Descargar PDF</button>`;
    else if (opt.format === 'pdf-multi') exportButtons = `<button class="ev-btn" id="ev-export" ${missing.length ? 'disabled' : ''}>Descargar PDF (${pages.length} pág.)</button>`;
    else if (opt.format === 'png-or-pdf') exportButtons = `
      <button class="ev-btn" id="ev-export-png" ${missing.length ? 'disabled' : ''}>Descargar PNG</button>
      <button class="ev-btn secondary" id="ev-export-pdf" ${missing.length ? 'disabled' : ''}>Descargar PDF</button>`;
    else if (opt.format === 'html') exportButtons = `<button class="ev-btn" id="ev-export" ${missing.length ? 'disabled' : ''}>Descargar HTML</button>`;

    root.innerHTML = `
      <div class="ev-app">
        ${topbar()}
        <div class="ev-main">
          <h1 class="ev-step-title">${opt.label}</h1>
          <p class="ev-step-sub">${opt.sub}</p>
          <div class="ev-workspace">
            <div class="ev-form-col">
              <form id="ev-form">${opt.fields.map(fieldHtml).join('')}</form>
              <div class="ev-export-box">
                <div class="ev-filename">${filename}</div>
                ${exportButtons}
                ${missing.length ? `<div class="ev-req-warning">Falta completar: ${missing.map(f => f.label).join(', ')}</div>` : ''}
              </div>
            </div>
            <div class="ev-preview-col">
              <div class="ev-preview-shell">${previewInner}</div>
            </div>
          </div>
        </div>
      </div>`;
    attachTopbarNav();

    if (!isHtml) {
      const scaler = document.getElementById('ev-preview-scaler');
      scaler.innerHTML = pages[Math.min(state.pageIndex, pages.length - 1)];
      const prev = document.getElementById('ev-page-prev');
      const next = document.getElementById('ev-page-next');
      if (prev) prev.onclick = () => setState({ pageIndex: state.pageIndex - 1 });
      if (next) next.onclick = () => setState({ pageIndex: state.pageIndex + 1 });
    } else {
      const frame = document.getElementById('ev-landing-frame');
      frame.srcdoc = pages[0];
    }

    // inputs de texto/textarea
    root.querySelectorAll('[data-field]').forEach(el => {
      el.oninput = () => {
        state.formData[el.dataset.field] = el.value;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => render(), 180);
      };
    });

    // imágenes
    root.querySelectorAll('[data-field-image]').forEach(el => {
      el.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => { state.formData[el.dataset.fieldImage] = reader.result; render(); };
        reader.readAsDataURL(file);
      };
    });
    root.querySelectorAll('[data-remove-image]').forEach(el => {
      el.onclick = () => { delete state.formData[el.dataset.removeImage]; render(); };
    });

    // export
    const doExport = async (btn, action) => {
      const original = btn.textContent;
      btn.disabled = true; btn.textContent = 'Generando…';
      try { await action(); } finally { btn.disabled = missingRequired(opt).length > 0; btn.textContent = original; }
    };

    if (opt.format === 'png') {
      const btn = document.getElementById('ev-export');
      btn.onclick = () => doExport(btn, () => EvExport.exportPng(stage.children[0], opt.dims.w, opt.dims.h, filename));
    } else if (opt.format === 'pdf-single') {
      const btn = document.getElementById('ev-export');
      btn.onclick = () => doExport(btn, () => EvExport.exportPdf([stage.children[0]], opt.dims.w, opt.dims.h, filename));
    } else if (opt.format === 'pdf-multi') {
      const btn = document.getElementById('ev-export');
      btn.onclick = () => doExport(btn, () => EvExport.exportPdf(Array.from(stage.children), opt.dims.w, opt.dims.h, filename));
    } else if (opt.format === 'png-or-pdf') {
      const btnPng = document.getElementById('ev-export-png');
      const btnPdf = document.getElementById('ev-export-pdf');
      const pngName = EvExport.buildFilename(state.categoryId, state.optionId, state.formData.titulo || '', 'png');
      const pdfName = EvExport.buildFilename(state.categoryId, state.optionId, state.formData.titulo || '', 'pdf');
      btnPng.onclick = () => doExport(btnPng, () => EvExport.exportPng(stage.children[0], opt.dims.w, opt.dims.h, pngName));
      btnPdf.onclick = () => doExport(btnPdf, () => EvExport.exportPdf([stage.children[0]], opt.dims.w, opt.dims.h, pdfName));
    } else if (opt.format === 'html') {
      const btn = document.getElementById('ev-export');
      btn.onclick = () => doExport(btn, async () => EvExport.exportHtml(opt.render(state.formData), filename));
    }
  }

  return { init: goCategory };
})();

document.addEventListener('DOMContentLoaded', EvApp.init);
