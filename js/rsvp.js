/* ============================================================
   rsvp.js — konfirmasi kehadiran via WhatsApp
   ------------------------------------------------------------
   TANPA DATABASE & TANPA PENYIMPANAN.
   Data tamu tidak disimpan di mana pun — form hanya menyusun
   pesan lalu membuka WhatsApp ke nomor keluarga.
   Tamu tetap harus menekan "kirim" di dalam WhatsApp.
   ============================================================ */
window.UND = window.UND || {};

window.UND.rsvp = (function () {
  'use strict';

  const { $, toast } = window.UND.utils;
  const CFG = window.UND.config;

  /** Susun isi pesan WhatsApp. */
  function susunPesan(data) {
    const anak = CFG.anak.namaLengkap;
    const ac = CFG.acara;

    return [
      `Assalamu'alaikum Wr. Wb.`,
      ``,
      `Saya *${data.nama}*.`,
      `Konfirmasi kehadiran Tedak Sinten *${anak}*`,
      `(${ac.hari}, ${ac.tanggalTeks}):`,
      ``,
      `• Kehadiran : ${data.hadir}`,
      data.hadir === 'Berhalangan' ? null : `• Jumlah    : ${data.jumlah} orang`,
      data.pesan ? `• Ucapan & doa:\n${data.pesan}` : null,
      ``,
      `Matur nuwun.`
    ].filter(v => v !== null).join('\n');
  }

  function kirimWhatsApp(data) {
    const nomor = String(CFG.rsvp.waNumber || '').replace(/\D/g, '');
    if (!nomor) {
      toast('Nomor WhatsApp belum diatur di config.js');
      return false;
    }
    const url = `https://wa.me/${nomor}?text=${encodeURIComponent(susunPesan(data))}`;
    const win = window.open(url, '_blank', 'noopener');
    // Sebagian browser HP memblokir window.open → alihkan langsung
    if (!win) window.location.href = url;
    return true;
  }

  function init() {
    const sec = $('#rsvp');
    if (!CFG.fitur.rsvp) { if (sec) sec.hidden = true; return; }

    const form   = $('#rsvpForm');
    const nama   = $('#rsvpNama');
    const pesan  = $('#rsvpPesan');
    const jumlah = $('#fieldJumlah');
    const note   = $('#rsvpNote');
    const hitung = $('#pesanCount');
    if (!form) return;

    // Penghitung karakter ucapan
    if (pesan && hitung) {
      pesan.addEventListener('input', () => { hitung.textContent = pesan.value.length; });
    }

    // Sembunyikan "jumlah hadir" bila tamu berhalangan
    form.querySelectorAll('input[name="hadir"]').forEach(r => {
      r.addEventListener('change', () => {
        jumlah?.classList.toggle('is-hidden', form.hadir.value === 'Berhalangan');
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const namaVal = nama.value.trim();
      if (!namaVal) {
        nama.setAttribute('aria-invalid', 'true');
        nama.focus();
        note.textContent = 'Mohon isi nama terlebih dahulu.';
        note.className = 'form-note is-err';
        return;
      }
      nama.removeAttribute('aria-invalid');

      const data = {
        nama:   namaVal.slice(0, 60),
        hadir:  form.hadir.value,
        jumlah: form.hadir.value === 'Berhalangan' ? 0 : Number($('#rsvpJumlah').value),
        pesan:  pesan.value.trim().slice(0, 400)
      };

      if (kirimWhatsApp(data)) {
        note.innerHTML = 'WhatsApp sedang dibuka — mohon tekan <strong>kirim</strong> di sana '
                       + 'agar konfirmasi Anda sampai kepada kami. Matur nuwun 🙏';
        note.className = 'form-note is-ok';
      }
    });
  }

  return { init };
})();
