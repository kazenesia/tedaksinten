/* ============================================================
   music.js — musik latar
   ============================================================ */
window.UND = window.UND || {};

window.UND.music = (function () {
  'use strict';

  const { $, toast } = window.UND.utils;
  const CFG = window.UND.config;

  let audio, btn, playing = false;

  function setState(on) {
    playing = on;
    btn.classList.toggle('is-paused', !on);
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Jeda musik latar' : 'Putar musik latar');
  }

  async function play() {
    try {
      await audio.play();
      setState(true);
    } catch (e) {
      setState(false);
    }
  }

  function pause() {
    audio.pause();
    setState(false);
  }

  function init() {
    audio = $('#bgMusic');
    btn   = $('#musicBtn');
    if (!audio || !btn) return;

    if (!CFG.fitur.musik) { btn.hidden = true; return; }

    // Sumber diisi lewat JS agar file tidak diminta sebelum dibutuhkan
    const src = document.createElement('source');
    src.src = CFG.musik.file;
    src.type = 'audio/mpeg';
    audio.appendChild(src);
    audio.volume = 0.55;

    setState(false);

    btn.addEventListener('click', () => (playing ? pause() : play()));

    // Autoplay setelah tamu menekan "Buka Undangan" (interaksi pengguna = diizinkan browser)
    document.addEventListener('cover:open', () => { play(); });

    // Jeda otomatis saat tab ditinggalkan, lanjut saat kembali
    let dijedaOtomatis = false;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && playing) { audio.pause(); dijedaOtomatis = true; }
      else if (!document.hidden && dijedaOtomatis) { play(); dijedaOtomatis = false; }
    });

    audio.addEventListener('error', () => {
      btn.hidden = true;
      console.warn('[musik] File tidak ditemukan:', CFG.musik.file);
    });
  }

  return { init };
})();
