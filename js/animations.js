/* ============================================================
   animations.js — scroll reveal, parallax, dock aktif
   ============================================================ */
window.UND = window.UND || {};

window.UND.animations = (function () {
  'use strict';

  const { $, $$, rafThrottle, prefersReducedMotion } = window.UND.utils;

  /* ---------- Reveal saat masuk viewport ---------- */
  function reveal() {
    const els = $$('[data-reveal]');
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = Array.from(el.parentElement.querySelectorAll(':scope > [data-reveal]'));
        const order = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(order * 0.1, 0.6) + 's';
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    els.forEach(el => io.observe(el));
    return io;
  }

  /** Untuk elemen yang ditambahkan JS setelah observer dibuat. */
  function refresh() {
    $$('[data-reveal]:not(.is-visible)').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.94) el.classList.add('is-visible');
    });
  }

  /* ---------- Parallax siluet wayang (transform, bukan margin) ---------- */
  function parallax() {
    if (prefersReducedMotion()) return;
    const els = $$('[data-parallax]');
    if (!els.length) return;

    /* Transform dasar diambil dari computed style, bukan hanya atribut inline —
       supaya scaleX(-1) yang berasal dari CSS class (mis. .awan--tr) tidak hilang
       saat parallax menulis ulang transform. */
    const dasar = els.map(el => {
      const inline = el.style.transform || '';
      const comp = getComputedStyle(el).transform;
      const t = inline || (comp && comp !== 'none' ? comp : '');
      return { el, t, speed: parseFloat(el.dataset.parallax || '0.03') };
    });

    const onScroll = rafThrottle(() => {
      const y = window.scrollY;
      dasar.forEach(({ el, t, speed }) => {
        el.style.transform = `translate3d(0, ${(y * speed).toFixed(1)}px, 0) ${t}`;
      });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Dock: sorot bagian yang sedang dibaca ---------- */
  function dockSpy() {
    const items = $$('[data-dock]');
    if (!items.length || !('IntersectionObserver' in window)) return;

    const map = new Map();
    items.forEach(a => {
      const sec = document.querySelector(a.getAttribute('href'));
      if (sec) map.set(sec, a);
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        items.forEach(a => a.classList.remove('is-active'));
        map.get(entry.target)?.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    map.forEach((_, sec) => io.observe(sec));
  }

  function init() {
    reveal();
    parallax();
    dockSpy();
  }

  return { init, refresh };
})();
