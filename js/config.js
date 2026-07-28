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
    mapsUrl: 'https://maps.app.goo.gl/ztimMchWpSa33eH78?g_st=atm'
  },

  /* ---------- Fitur opsional (true / false) ---------- */
  fitur: {
    musik: true,
    hitungMundur: true,
    galeri: true
  },

  musik: {
    file: 'assets/audio/musik-gamelan.mp3',
    judul: 'Gending Jawa — instrumental'
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
