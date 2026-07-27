/* ============================================================
   utils.js — helper kecil yang dipakai modul lain
   ============================================================ */
window.UND = window.UND || {};

window.UND.utils = (function () {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** Bersihkan teks dari HTML — WAJIB untuk apa pun yang berasal dari URL/input. */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Tampilkan pesan singkat di bawah layar. */
  let toastTimer;
  function toast(msg, ms = 2400) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-show'), ms);
  }

  /** Salin teks ke clipboard, dengan fallback untuk browser lama / http. */
  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:absolute;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  /** Batasi frekuensi eksekusi fungsi (untuk event scroll). */
  function rafThrottle(fn) {
    let ticking = false;
    return function (...args) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        fn.apply(this, args);
        ticking = false;
      });
    };
  }

  /** Format tanggal ke gaya "Minggu, 2 Agustus 2026". */
  function formatTanggal(iso) {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        timeZone: 'Asia/Jakarta'
      }).format(new Date(iso));
    } catch (e) {
      return '';
    }
  }

  /** Ubah tanggal ISO ke format kalender (YYYYMMDDTHHmmssZ). */
  function toICSDate(iso) {
    return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return { $, $$, escapeHtml, toast, copyText, rafThrottle, formatTanggal, toICSDate, prefersReducedMotion };
})();
