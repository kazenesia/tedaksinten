/* ============================================================
   gallery.js — galeri foto + lightbox
   ============================================================ */
window.UND = window.UND || {};

window.UND.gallery = (function () {
  'use strict';

  const { $, escapeHtml } = window.UND.utils;
  const CFG = window.UND.config;

  function init() {
    const sec  = $('#galeri');
    const grid = $('#galeriGrid');
    const foto = CFG.anak.fotoGaleri || [];

    if (!sec || !grid) return;
    if (!CFG.fitur.galeri || !foto.length) { sec.hidden = true; return; }

    // Tampilkan hanya gambar yang benar-benar ada.
    // Ekstensi di config boleh salah — dicoba alternatifnya lebih dulu.
    const EXT = ['webp','jpg','jpeg','png'];
    const kandidat = (path) => {
      const dasar = path.replace(/\.[^./]+$/, '');
      return [...new Set([path, ...EXT.map(e => `${dasar}.${e}`)])];
    };

    let dimuat = 0, selesai = 0;
    foto.forEach((src, i) => {
      let list = kandidat(src);
      let k = 0;
      let sudahAntiCache = false;
      (function coba() {
        if (k >= list.length) {
          if (!sudahAntiCache) {
            // Ulangi hanya path asli dengan anti-cache, bukan semua ekstensi
            sudahAntiCache = true;
            const bust = '_cb=' + Date.now();
            list = [src + (src.includes('?') ? '&' : '?') + bust];
            k = 0;
            coba();
            return;
          }
          tandaiSelesai();
          return;
        }
        const uji = new Image();
        uji.onload = () => {
          const btn = document.createElement('button');
          btn.className = 'galeri__item';
          btn.type = 'button';
          btn.dataset.full = uji.src;
          btn.style.order = String(i);
          btn.setAttribute('aria-label', `Perbesar foto ${i + 1}`);
          const thumb = new Image();
          thumb.src = uji.src;
          thumb.alt = `Foto ${CFG.anak.namaPanggilan} ${i + 1}`;
          thumb.loading = 'lazy';
          btn.appendChild(thumb);
          grid.appendChild(btn);
          dimuat++;
          sec.hidden = false;
          tandaiSelesai();
        };
        uji.onerror = () => { k++; coba(); };
        uji.src = list[k];
      })();
    });

    function tandaiSelesai() {
      selesai++;
      if (selesai >= foto.length && dimuat === 0) sec.hidden = true;
    }

    // Lightbox
    const lb    = $('#lightbox');
    const lbImg = $('#lightboxImg');
    const lbX   = $('#lightboxClose');

    function open(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || '';
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      lbX.focus();
    }
    function close() {
      lb.hidden = true;
      lbImg.src = '';
      document.body.style.overflow = '';
    }

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.galeri__item');
      if (btn) open(btn.dataset.full, btn.querySelector('img')?.alt);
    });
    lbX.addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lb.hidden) close();
    });
  }

  return { init };
})();
