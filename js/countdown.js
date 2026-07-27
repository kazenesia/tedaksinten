/* ============================================================
   countdown.js — hitung mundur menuju hari acara
   ============================================================ */
window.UND = window.UND || {};

window.UND.countdown = (function () {
  'use strict';

  const { $, $$ } = window.UND.utils;
  const CFG = window.UND.config;
  let timer = null;

  function pad(n) { return String(n).padStart(2, '0'); }

  function init() {
    const wrap = $('#countdown');
    if (!wrap) return;

    if (!CFG.fitur.hitungMundur) { wrap.hidden = true; return; }

    const target = new Date(CFG.acara.tanggalISO).getTime();
    if (Number.isNaN(target)) { wrap.hidden = true; return; }

    const cells = {
      d: wrap.querySelector('[data-cd="d"]'),
      h: wrap.querySelector('[data-cd="h"]'),
      m: wrap.querySelector('[data-cd="m"]'),
      s: wrap.querySelector('[data-cd="s"]')
    };

    function tick() {
      const diff = target - Date.now();

      if (diff <= 0) {
        clearInterval(timer);
        wrap.classList.add('is-done');
        wrap.innerHTML = '<p class="countdown__msg">Hari bahagia telah tiba 🌾</p>';
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor(diff % 86400000 / 3600000);
      const m = Math.floor(diff % 3600000 / 60000);
      const s = Math.floor(diff % 60000 / 1000);

      cells.d.textContent = pad(d);
      cells.h.textContent = pad(h);
      cells.m.textContent = pad(m);
      cells.s.textContent = pad(s);
    }

    tick();
    timer = setInterval(tick, 1000);

    // Hemat baterai: hentikan saat tab tidak terlihat
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(timer);
      } else if (!wrap.classList.contains('is-done')) {
        tick();
        clearInterval(timer);
        timer = setInterval(tick, 1000);
      }
    });
  }

  return { init };
})();
