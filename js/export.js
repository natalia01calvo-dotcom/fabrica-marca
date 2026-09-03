// EVOREN — Exportación: nombres de archivo, PNG, PDF, HTML

const EvExport = (() => {

  function stripAccents(s) {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function slugify(text, maxWords = 5) {
    if (!text) return 'sin-titulo';
    const words = stripAccents(text).trim().split(/\s+/).slice(0, maxWords);
    return words.join(' ')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'sin-titulo';
  }

  function todayISO() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  function buildFilename(categoriaId, tipoId, tituloTexto, ext) {
    return `${categoriaId}-${tipoId}-${todayISO()}-${slugify(tituloTexto)}.${ext}`;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 300);
  }

  async function nodeToCanvas(node, w, h) {
    return html2canvas(node, {
      width: w, height: h,
      windowWidth: w, windowHeight: h,
      scale: 1, backgroundColor: null, useCORS: true, allowTaint: false
    });
  }

  async function exportPng(node, w, h, filename) {
    const canvas = await nodeToCanvas(node, w, h);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => { downloadBlob(blob, filename); resolve(); }, 'image/png', 1.0);
    });
  }

  async function exportPdf(nodes, w, h, filename) {
    const { jsPDF } = window.jspdf;
    const orientation = w > h ? 'l' : 'p';
    const doc = new jsPDF({ unit: 'px', format: [w, h], orientation });
    for (let i = 0; i < nodes.length; i++) {
      const canvas = await nodeToCanvas(nodes[i], w, h);
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      if (i > 0) doc.addPage([w, h], orientation);
      doc.addImage(imgData, 'JPEG', 0, 0, w, h);
    }
    doc.save(filename);
  }

  function exportHtml(htmlString, filename) {
    const blob = new Blob([htmlString], { type: 'text/html' });
    downloadBlob(blob, filename);
  }

  return { slugify, buildFilename, exportPng, exportPdf, exportHtml, downloadBlob, todayISO };
})();
