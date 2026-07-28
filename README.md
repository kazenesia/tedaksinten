# Undangan Tedak Sinten — Nathan Afra Lukman Zayn

Undangan digital statis (HTML/CSS/JS murni, tanpa framework & tanpa build step).
Cukup upload seluruh folder ke hosting mana pun.

## Struktur folder

```
undangan/
├── index.html              ← satu-satunya halaman
├── css/
│   ├── base.css            ← variabel warna, reset, tipografi
│   ├── layout.css          ← cover, hero, section, footer
│   ├── components.css      ← tombol, kartu, form, dock, toast
│   ├── ornaments.css       ← batik, wayang, sulur, ukiran (nuansa Jawa)
│   └── animations.css      ← keyframes & scroll reveal
├── js/
│   ├── config.js           ← ★ SEMUA DATA DIEDIT DI SINI
│   ├── utils.js            ← helper (escape HTML, toast, copy, dll)
│   ├── guest.js            ← ★ nama tamu dari parameter URL
│   ├── render.js           ← mengisi konten dari config
│   ├── countdown.js        ← hitung mundur
│   ├── gallery.js          ← galeri + lightbox
│   ├── music.js            ← musik latar
│   ├── animations.js       ← reveal, parallax, dock spy
│   └── main.js             ← orkestrasi & sampul
├── assets/
│   ├── img/                ← nathan.jpg, galeri-1.jpg, og-cover.jpg
│   │                         + gunungan-mask.webp & awan-mask.webp (ornamen)
│   └── audio/              ← musik-gamelan.mp3
└── tools/
    └── generator.html      ← generator link + pesan WhatsApp massal
```

---

## 1. Nama tamu dari parameter URL

Format yang didukung — semuanya menghasilkan **"Hari Maulana"**:

| URL | Hasil |
|---|---|
| `?to=Hari Maulana` | Hari Maulana |
| `?to=hari-maulana` | Hari Maulana |
| `?to=hari_maulana` | Hari Maulana |
| `?to=Hari%20Maulana` | Hari Maulana |
| `?kepada=` / `?nama=` / `?u=` / `?tamu=` | (alias, sama saja) |
| `#to=hari-maulana` | Hari Maulana *(cadangan bila hosting memotong query)* |

Yang terjadi otomatis saat nama terdeteksi:

- muncul di **kartu "Kepada Yth."** pada halaman sampul,
- muncul di sapaan hero: *"Kepada Bapak/Ibu/Saudara/i Hari Maulana, yang berbahagia"*,
- judul tab berubah jadi *"Undangan untuk Hari Maulana — …"*.

**Penanganan khusus:**
- Gelar tetap rapi: `?to=h.-abdul-aziz` → `H Abdul Aziz`. Daftar gelar bisa
  ditambah di `config.js` → `tamu.gelar`.
- **Aman dari XSS.** Semua input dibersihkan; `?to=<script>alert(1)</script>`
  tidak akan mengeksekusi apa pun.
- Nama dibatasi 60 karakter agar layout tidak rusak.
- **Tanpa parameter**, kartu berubah jadi input agar tamu menulis namanya
  sendiri — pratinjau berubah langsung saat mengetik.

### Membuat link massal
Buka `tools/generator.html` di browser, tempel daftar nama, klik **Buat Link**.
Tersedia tombol salin, kirim WhatsApp (dengan template pesan), dan unduh CSV.

---

## 2. Yang perlu diganti sebelum dipakai

Semua di **`js/config.js`**:

- [ ] `anak` — nama, usia, path foto
- [ ] `orangTua` — nama ayah & ibu
- [ ] `acara` — hari, `tanggalISO` (dipakai hitung mundur + kalender), lokasi, `mapsUrl`
- [ ] `baseUrl` — domain final (opsional)

Lalu isi file aset:
- `assets/img/nathan.webp` — foto utama, rasio potret 4:5
- `assets/img/galeri-1.webp` … — foto galeri (opsional)
- `assets/img/og-cover.webp` — thumbnail saat link dibagikan di WA (1200×630)

**Ekstensi bebas** (`.webp`, `.jpg`, `.jpeg`, `.png`). Bila ekstensi di
`config.js` berbeda dengan berkas yang ada, skrip otomatis mencoba ekstensi
lain — jadi foto tetap tampil. Yang **wajib sama** adalah *nama* berkas
(`nathan`, huruf kecil) dan letaknya di `assets/img/`.

> Foto tidak muncul? Buka Console browser (F12). Bila ada pesan
> `[foto] Tidak ditemukan`, berarti nama berkas atau foldernya belum cocok —
> pesan itu menampilkan semua path yang sudah dicoba.
- `assets/audio/musik-gamelan.mp3` — gending Jawa instrumental

> Semua fitur **degrade dengan aman**: bila foto/musik belum ada, placeholder
> tetap tampil dan tombol musik menyembunyikan diri — tidak ada error.

Mematikan fitur cukup lewat `config.js` → `fitur`:
```js
fitur: { musik:true, hitungMundur:true, galeri:true }
```

---

## 3. Tanpa RSVP

Undangan ini **tidak memiliki formulir konfirmasi kehadiran** dan **tidak
menyimpan data tamu** sama sekali — tanpa database, tanpa `localStorage`.
Sifatnya murni undangan satu arah.

Nama tamu dari parameter URL (bagian 1) tetap berjalan penuh: tampil di
kartu sampul, sapaan hero, dan judul tab.

Bila suatu saat ingin menambahkan konfirmasi kehadiran kembali, cara paling
sederhana adalah mencantumkan tautan WhatsApp biasa di bagian penutup:

```html
<a href="https://wa.me/628xxxxxxxxxx?text=Saya%20akan%20hadir">
  Konfirmasi via WhatsApp
</a>
```

## 3b. Nuansa Jawa (ornamen)

Semua ornamen dibuat sebagai **SVG inline** — tidak ada file gambar tambahan,
jadi tetap tajam di layar HD dan ringan.

| Ornamen | Letak | Berkas |
|---|---|---|
| **Kawung + parang** (lapisan batik) | menyelimuti seluruh halaman | `ornaments.css` → `.batik-layer` |
| **Gunungan / kayon** (gambar asli) | di balik nama, sapaan, penutup | `assets/img/gunungan-mask.webp` |
| **Gunungan sepasang** mengapit isi | sampul, hero, tentang | `.gunungan-side` |
| **Awan mega mendung** | latar kedua di hampir semua bagian | `assets/img/awan-mask.webp` |
| **Sulur / lung-lungan** | pembatas antar bagian | `#sulur` |
| **Sudut ukiran** | bingkai kartu Detail Acara | `#ukir-sudut` |

Mengatur ketebalan nuansa — semua lewat `css/ornaments.css`:

```css
.batik-layer{ opacity:.5; }                              /* motif batik: 0 = polos */
.gunungan-ghost{ background-color:rgba(184,134,59,.16); } /* gunungan besar */
.gunungan-side{ background-color:rgba(53,39,27,.055); }   /* gunungan pengapit */
.awan{ background-color:rgba(184,134,59,.20); }           /* awan */
.awan--soft{ background-color:rgba(184,134,59,.13); }     /* awan lebih samar */
.gunungan-solid{ background-color:var(--gold); }          /* gunungan penutup */
```

Gunungan & awan dipasang sebagai **CSS mask**, bukan `<img>`. Keuntungannya:
warnanya bisa diatur lewat `background-color` agar selalu serasi dengan palet,
dan ukuran berkas jauh lebih kecil (327 KB → 57 KB untuk kedua gambar).

Kalau menurut Anda masih terlalu ramai, cukup turunkan angka-angka di atas.

## 4. Menjalankan secara lokal

Jangan buka `index.html` lewat `file://` (parameter URL & fetch bisa bermasalah).
Gunakan server statis:

```bash
cd undangan
python3 -m http.server 8000
# buka http://localhost:8000/?to=hari-maulana
```

## 5. Deploy

- **Netlify / Vercel** — drag & drop folder `undangan/`
- **GitHub Pages** — push, aktifkan Pages
- **cPanel / hosting biasa** — upload isi folder ke `public_html`

Semua sudah static, tidak butuh Node/PHP/database.

---

## 6. Cache browser (penting saat memperbarui)

Cache **bukan** penyebab foto tidak muncul pertama kali, tapi sering
**menyembunyikan perbaikan** — termasuk hasil 404 yang ikut tersimpan.

**Sudah ditangani otomatis:**
- Bila foto gagal dimuat, skrip mencoba ulang sekali dengan penanda anti-cache.
  Jadi tamu yang sempat membuka undangan *sebelum* foto diunggah tetap akan
  melihat fotonya, tanpa perlu diminta menghapus cache.

**Yang harus Anda lakukan sendiri:**
Setiap kali mengedit berkas di `css/` atau `js/`, **naikkan nomor versi**
di `index.html`:

```html
<link rel="stylesheet" href="css/base.css?v=1">   <!-- jadi ?v=2 -->
<script src="js/config.js?v=1"></script>          <!-- jadi ?v=2 -->
```

Cara cepat menaikkan semua sekaligus (dari dalam folder undangan):

```bash
sed -i 's/?v=1/?v=2/g' index.html
```

Tanpa ini, tamu yang pernah membuka undangan bisa memakai CSS/JS lama
selama berhari-hari — mis. nomor rekening atau jam acara yang sudah Anda
perbaiki tidak ikut berubah di layar mereka.

**Menguji seperti tamu baru:** buka undangan di jendela Samaran/Incognito,
atau muat ulang paksa dengan `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac).
Di HP: tutup tab lalu buka ulang dari link.
