/* ============================================================
   render.js — mengisi konten halaman dari config.js
   ============================================================ */
window.UND = window.UND || {};

window.UND.render = (function () {
  'use strict';

  const { $, $$, escapeHtml, toast, copyText, formatTanggal, toICSDate } = window.UND.utils;
  const CFG = window.UND.config;


  /** Hasilkan daftar path alternatif dengan ekstensi berbeda. */
  function variasiEkstensi(path) {
    const EXT = ['webp', 'jpg', 'jpeg', 'png'];
    const dasar = path.replace(/\.[^./]+$/, '');
    const asli = path;
    const daftar = [asli, ...EXT.map(e => `${dasar}.${e}`)];
    return [...new Set(daftar)];
  }

  /**
   * Coba muat gambar satu per satu; panggil onOk pada yang pertama berhasil.
   * Bila SEMUA gagal, diulang sekali dengan penanda anti-cache — karena browser
   * ikut menyimpan hasil 404. Tanpa ini, tamu yang pernah membuka undangan
   * sebelum foto diunggah akan terus melihat placeholder walau foto sudah ada.
   */
  function muatGambar(list, onOk, onFail) {
    coba(list, false);

    function coba(daftar, antiCache) {
      let i = 0;
      (function berikutnya() {
        if (i >= daftar.length) {
          if (!antiCache) {
            // Ulangi HANYA path asli dengan penanda anti-cache — cukup untuk
            // mengatasi 404 yang tersimpan, tanpa memborong semua ekstensi lagi.
            const bust = '_cb=' + Date.now();
            const asli = list[0];
            coba([asli + (asli.includes('?') ? '&' : '?') + bust], true);
          } else if (onFail) {
            onFail();
          }
          return;
        }
        const src = daftar[i++];
        const uji = new Image();
        uji.onload = () => onOk(src);
        uji.onerror = berikutnya;
        uji.src = src;
      })();
    }
  }

  function teksIdentitas() {
    const a = CFG.anak, o = CFG.orangTua, ac = CFG.acara;

    // Nama di sampul & hero
    const namaHtml = a.namaBaris.map(escapeHtml).join('<br>');
    const cn = $('#coverName'); if (cn) cn.innerHTML = namaHtml;
    const hn = $('.hero__name'); if (hn) hn.innerHTML = namaHtml;
    const pn = $('#penutupNama'); if (pn) pn.textContent = a.namaLengkap;

    const hs = $('.hero__sub');
    if (hs) hs.textContent = `Putra dari ${o.sapaanAyah} & ${o.sapaanIbu}`;

    const sp = $('.sapaan__parents');
    if (sp) sp.innerHTML = `${escapeHtml(o.ayah)} <span class="amp">&amp;</span> ${escapeHtml(o.ibu)}`;

    const pk = $('.penutup__keluarga');
    if (pk) pk.textContent = `Keluarga ${o.ayah} & ${o.ibu}`;

    const tahun = new Date(ac.tanggalISO).getFullYear();
    const ft = $('#footerText');
    if (ft) ft.textContent = `Keluarga ${o.ayah} & ${o.ibu} — Tedak Sinten ${tahun}`;

    // Tanggal
    const tglLengkap = `${ac.hari}, ${ac.tanggalTeks}`;
    const cd = $('#coverDate');   if (cd) cd.textContent = tglLengkap;
    const dt = $('#detailTanggal'); if (dt) dt.textContent = tglLengkap;
    const dj = $('#detailJam');     if (dj) dj.textContent = ac.jamTeks;
    const dtp = $('#detailTempat'); if (dtp) dtp.textContent = ac.tempat;
    const da = $('#detailAlamat');  if (da) da.textContent = ac.alamat;

    const d = new Date(ac.tanggalISO);
    const bulan = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(d);
    const tgl = new Intl.DateTimeFormat('id-ID', { day: '2-digit', timeZone: 'Asia/Jakarta' }).format(d);
    const bd = $('.date-badge__day');   if (bd) bd.textContent = tgl;
    const bm = $('.date-badge__month'); if (bm) bm.textContent = bulan;

    // Foto utama.
    // Bila ekstensi di config tidak cocok dengan berkas yang ada
    // (mis. ditulis .jpg padahal berkasnya .webp), coba ekstensi lain
    // secara berurutan sebelum menyerah ke placeholder.
    const slot = $('#fotoSlot');
    if (slot && a.fotoUtama) {
      const kandidat = variasiEkstensi(a.fotoUtama);
      muatGambar(kandidat, (src) => {
        const img = new Image();
        img.src = src;
        img.alt = `Foto ${a.namaPanggilan}`;
        slot.innerHTML = '';
        slot.appendChild(img);
      }, () => {
        // Diagnostik: bedakan "berkas memang tidak ada" vs "cache lama".
        console.warn(
          '%c[foto] Foto utama tidak ditemukan.',
          'color:#b6592f;font-weight:bold'
        );
        console.warn('Path yang dicoba:\n  ' + kandidat.join('\n  '));
        console.warn(
          'Cek: (1) nama berkas huruf kecil semua, ' +
          '(2) letaknya langsung di assets/img/ bukan subfolder, ' +
          '(3) buka path di atas langsung di browser — kalau 404, berkasnya belum ada; ' +
          'kalau tampil, kemungkinan cache: muat ulang paksa (Ctrl/Cmd+Shift+R).'
        );
      });
    }
    const cap = $('#fotoCap');
    if (cap) cap.textContent = `${a.namaPanggilan}, ${a.usia}`;
  }

  function timeline() {
    const wrap = $('#timeline');
    if (!wrap) return;
    if (!CFG.susunan || !CFG.susunan.length) {
      const sec = $('#prosesi'); if (sec) sec.hidden = true;
      return;
    }
    wrap.innerHTML = CFG.susunan.map((s, i) => `
      <li class="timeline__item" data-reveal>
        <p class="timeline__jam">${escapeHtml(s.jam)} WIB</p>
        <h3 class="timeline__judul">${escapeHtml(s.judul)}</h3>
        <p class="timeline__teks">${escapeHtml(s.teks)}</p>
      </li>`).join('');
  }

  function maps() {
    const a = CFG.acara;
    const url = a.mapsUrl ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.mapsQuery)}`;
    const btn = $('#btnMaps');
    if (btn) btn.href = url;
  }

  function kalender() {
    const btn = $('#btnCalendar');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const a = CFG.acara, anak = CFG.anak;
      const judul = `Tedak Sinten ${anak.namaLengkap}`;
      const lokasi = `${a.tempat}, ${a.alamat}`;
      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Undangan//Tedak Sinten//ID',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@undangan`,
        `DTSTAMP:${toICSDate(new Date().toISOString())}`,
        `DTSTART:${toICSDate(a.tanggalISO)}`,
        `DTEND:${toICSDate(a.selesaiISO || a.tanggalISO)}`,
        `SUMMARY:${judul}`,
        `LOCATION:${lokasi.replace(/,/g, '\\,')}`,
        `DESCRIPTION:Undangan prosesi Tedak Sinten ${anak.namaLengkap}`,
        'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY',
        `DESCRIPTION:Besok ${judul}`, 'END:VALARM',
        'END:VEVENT', 'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'tedak-sinten.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      toast('Acara diunduh — buka file untuk menyimpannya ke kalender.');
    });
  }

  function share() {
    const btn = $('#btnShare');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const url = location.href;
      const judul = `Undangan Tedak Sinten ${CFG.anak.namaLengkap}`;
      const teks = `${judul}\n${CFG.acara.hari}, ${CFG.acara.tanggalTeks} · ${CFG.acara.jamTeks}\n`;
      if (navigator.share) {
        try { await navigator.share({ title: judul, text: teks, url }); return; } catch (e) { /* dibatalkan */ }
      }
      const ok = await copyText(url);
      toast(ok ? 'Tautan undangan tersalin ✓' : 'Salin tautan dari address bar ya.');
    });
  }

  function init() {
    teksIdentitas();
    timeline();
    maps();
    kalender();
    share();
  }

  return { init };
})();
