/* ============================================================
   guest.js — nama tamu dari parameter URL
   ------------------------------------------------------------
   Format yang didukung:
     index.html?to=Hari Maulana
     index.html?to=hari-maulana        -> Hari Maulana
     index.html?to=hari_maulana        -> Hari Maulana
     index.html?to=Hari%20Maulana
     index.html?kepada=... / ?nama=... / ?u=... / ?tamu=...
     index.html#to=Hari Maulana        (fallback bila hosting memotong query)
   ============================================================ */
window.UND = window.UND || {};

window.UND.guest = (function () {
  'use strict';

  const { $, escapeHtml } = window.UND.utils;
  const CFG = window.UND.config;

  /** Ambil nilai mentah nama tamu dari query string atau hash. */
  function readRaw() {
    const keys = CFG.tamu.paramKeys;
    const search = new URLSearchParams(window.location.search);

    for (const k of keys) {
      const v = search.get(k);
      if (v && v.trim()) return v;
    }

    // Fallback: sebagian pemendek URL / hosting statis memindahkan query ke hash
    const hash = window.location.hash.replace(/^#/, '');
    if (hash.includes('=')) {
      const hp = new URLSearchParams(hash);
      for (const k of keys) {
        const v = hp.get(k);
        if (v && v.trim()) return v;
      }
    }
    return '';
  }

  /**
   * Rapikan nama: ganti pemisah, buang karakter aneh, kapitalkan tiap kata,
   * dan pertahankan penulisan gelar (H., Hj., KH., S.Pd, dst).
   */
  function beautify(raw) {
    let s = String(raw)
      .replace(/[+_]+/g, ' ')      // "hari_maulana" / "hari+maulana"
      .replace(/-+/g, ' ')          // "hari-maulana"
      .replace(/[<>{}\[\]\\^`|]/g, '') // buang karakter berbahaya
      .replace(/\s+/g, ' ')
      .trim();

    if (!s) return '';
    if (s.length > 60) s = s.slice(0, 60).trim();

    const gelarMap = new Map(
      CFG.tamu.gelar.map(g => [g.toLowerCase().replace(/\./g, ''), g])
    );

    return s.split(' ').map(word => {
      const bare = word.toLowerCase().replace(/\./g, '');
      if (gelarMap.has(bare)) return gelarMap.get(bare);
      // Tangani nama berimbuhan seperti "abdul-aziz" atau "d'silva"
      return word.replace(/(^|['\u2019])([\p{L}])/gu,
        (m, p1, p2) => p1 + p2.toLocaleUpperCase('id-ID'));
    }).join(' ');
  }

  /** Nama tamu yang sudah dirapikan, atau string kosong. */
  let current = '';

  function get() { return current; }

  /** Terapkan nama ke seluruh elemen yang relevan. */
  function apply(name) {
    current = name || '';
    const display = current || CFG.tamu.fallback;

    const elCover = $('#guestName');
    if (elCover) elCover.textContent = display;

    const elHero = $('#heroGreeting');
    if (elHero) {
      elHero.textContent = current
        ? `Kepada Bapak/Ibu/Saudara/i ${current}, yang berbahagia`
        : 'Kepada Bapak/Ibu/Saudara/i yang berbahagia';
    }

    // Isi otomatis kolom nama pada form RSVP
    const elRsvp = $('#rsvpNama');
    if (elRsvp && current && !elRsvp.value) elRsvp.value = current;

    // Perbarui judul tab & meta agar personal saat dibagikan
    if (current) {
      document.title = `Undangan untuk ${current} — Tedak Sinten ${CFG.anak.namaPanggilan}`;
    }
  }

  function init() {
    const raw = readRaw();
    const name = beautify(raw);
    apply(name);

    // Bila URL tidak memuat nama, tampilkan input manual di sampul
    if (!name) {
      const form  = $('#guestForm');
      const input = $('#guestInput');
      const label = $('#guestName');
      if (form && input) {
        form.hidden = false;
        if (label) label.textContent = CFG.tamu.fallback;

        const onType = () => {
          const v = beautify(input.value);
          if (label) label.textContent = v || CFG.tamu.fallback;
        };
        input.addEventListener('input', onType);
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          apply(beautify(input.value));
          input.blur();
        });
        // Simpan nama saat sampul dibuka
        document.addEventListener('cover:open', () => {
          if (input.value.trim()) apply(beautify(input.value));
        });
      }
    }

    return name;
  }

  /** Buat link undangan personal untuk seorang tamu. */
  function buildLink(nama) {
    const base = CFG.baseUrl || (location.origin + location.pathname);
    return `${base}?to=${encodeURIComponent(nama)}`;
  }

  return { init, get, apply, beautify, buildLink, escapeHtml };
})();
