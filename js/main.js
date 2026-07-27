/* ============================================================
   main.js — orkestrasi: urutan inisialisasi & sampul
   ============================================================ */
(function () {
  'use strict';

  const U = window.UND;
  const { $ } = U.utils;

  function bukaUndangan() {
    const cover    = $('#cover');
    const undangan = $('#undangan');
    const fab      = $('#fabStack');
    const dock     = $('#dock');

    cover.classList.add('is-open');
    document.body.classList.remove('is-locked');

    undangan.setAttribute('aria-hidden', 'false');
    undangan.classList.add('is-shown');
    fab?.setAttribute('aria-hidden', 'false');
    dock?.setAttribute('aria-hidden', 'false');

    // Beri tahu modul lain (musik menyalakan gending di sini)
    document.dispatchEvent(new CustomEvent('cover:open'));

    window.scrollTo({ top: 0, behavior: 'auto' });

    setTimeout(() => {
      fab?.classList.add('is-ready');
      dock?.classList.add('is-ready');
      U.animations.refresh();
      cover.setAttribute('inert', '');
    }, 500);
  }

  function init() {
    // 1) Isi konten dari config
    U.render.init();
    // 2) Nama tamu (setelah render agar tidak tertimpa)
    U.guest.init();
    // 3) Fitur
    U.countdown.init();
    U.gallery.init();
    U.rsvp.init();
    U.music.init();
    // 4) Animasi terakhir supaya semua elemen sudah ada di DOM
    U.animations.init();

    // Tombol buka sampul
    $('#btnOpen')?.addEventListener('click', bukaUndangan);

    // Enter di kolom nama tamu = langsung buka
    $('#guestInput')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); bukaUndangan(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
