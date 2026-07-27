/* ============================================================
   config.js — SATU-SATUNYA FILE YANG PERLU DIEDIT
   Semua teks, tanggal, lokasi, dan tombol diatur dari sini.
   ============================================================ */
window.UND = window.UND || {};

window.UND.config = {
  /* ---------- Identitas anak & keluarga ---------- */
  anak: {
    namaPanggilan: 'Nathan',
    namaLengkap: 'Nathan Afra Lukman Zayn',
    // dipakai untuk pemenggalan baris di hero (biar rapi di layar kecil)
    namaBaris: ['Nathan Afra', 'Lukman Zayn'],
    usia: '7 bulan',
    // Ekstensi boleh .webp / .jpg / .jpeg / .png.
    // Kalau berkasnya tidak ketemu, skrip otomatis mencoba ekstensi lain,
    // jadi salah tulis ekstensi tidak lagi membuat foto gagal tampil.
    fotoUtama: 'assets/img/nathan.webp',
    fotoGaleri: [                             // opsional, boleh dikosongkan: []
      'assets/img/galeri-1.webp',
      'assets/img/galeri-2.webp',
      'assets/img/galeri-3.webp'
    ]
  },

  orangTua: {
    ayah: 'Hendra',
    ibu: 'Nia',
    sapaanAyah: 'Bapak Hendra',
    sapaanIbu: 'Ibu Nia'
  },

  /* ---------- Waktu & tempat ---------- */
  acara: {
    hari: 'Minggu',
    tanggalTeks: '2 Agustus 2026',
    tanggalISO: '2026-08-02T09:00:00+07:00',  // untuk hitung mundur & kalender
    selesaiISO: '2026-08-02T13:00:00+07:00',
    jamTeks: '09.00 WIB — selesai',
    tempat: 'Kediaman Keluarga Hendra & Nia',
    alamat: 'Desa Jiken RT 04 RW 01, Kec. Tulangan, Kab. Sidoarjo, Jawa Timur',
    mapsQuery: 'Desa Jiken RT 04 RW 01 Kec. Tulangan Kab. Sidoarjo',
    // Kalau punya link Google Maps pendek, tempel di sini (kosongkan untuk pakai mapsQuery)
    mapsUrl: ''
  },

  /* ---------- Susunan prosesi ---------- */
  susunan: [
    { jam: '09.00', judul: 'Pembukaan & Doa Bersama',
      teks: 'Tamu dipersilakan hadir, dilanjutkan pembacaan doa untuk sang buah hati.' },
    { jam: '09.30', judul: 'Tedhak Jadah Pitung Warna',
      teks: 'Nathan menapaki tujuh jadah warna-warni — lambang aneka rintangan hidup yang akan dilaluinya.' },
    { jam: '09.45', judul: 'Munggah Tangga Tebu',
      teks: 'Menaiki tangga tebu wulung sebagai simbol tekad dan kemantapan hati menapaki jenjang kehidupan.' },
    { jam: '10.00', judul: 'Kurungan & Pilihan Benda',
      teks: 'Nathan memilih benda di dalam kurungan hias — gambaran cita-cita dan rezekinya kelak.' },
    { jam: '10.15', judul: 'Sebar Udhik-udhik',
      teks: 'Menyebar uang logam dan beras kuning, wujud harapan agar kelak dermawan dan berlimpah rezeki.' },
    { jam: '10.30', judul: 'Siraman & Ganti Busana',
      teks: 'Dimandikan dengan air kembang setaman lalu mengenakan busana baru — simbol kehidupan yang harum dan cerah.' },
    { jam: '11.00', judul: 'Ramah Tamah',
      teks: 'Santap siang bersama keluarga dan para tamu undangan.' }
  ],

  /* ---------- Fitur opsional (true / false) ---------- */
  fitur: {
    musik: true,
    hitungMundur: true,
    galeri: true,
    rsvp: true
  },

  musik: {
    file: 'assets/audio/musik-gamelan.mp3',
    judul: 'Gending Jawa — instrumental'
  },

  /* ---------- RSVP (tanpa database) ---------- */
  // Konfirmasi dikirim sebagai pesan WhatsApp ke nomor di bawah.
  // Tidak ada data tamu yang disimpan di server maupun di browser.
  rsvp: {
    // Nomor WhatsApp penerima konfirmasi (format internasional, tanpa + dan spasi)
    waNumber: '6281234567890'
  },

  /* ---------- Teks sapaan tamu ---------- */
  tamu: {
    // parameter URL yang dikenali: ?to= / ?kepada= / ?nama= / ?u=
    paramKeys: ['to', 'kepada', 'nama', 'u', 'tamu'],
    fallback: 'Bapak/Ibu/Saudara/i',
    // Sebutan yang huruf besarnya dipertahankan saat nama dirapikan
    gelar: ['H', 'Hj', 'KH', 'Dr', 'Drs', 'Ir', 'S.Pd', 'S.E', 'S.T', 'M.M', 'RT', 'RW', 'Bpk', 'Ibu']
  },

  /* ---------- Link berbagi ---------- */
  // Kosongkan untuk memakai alamat halaman saat ini secara otomatis.
  baseUrl: ''
};
