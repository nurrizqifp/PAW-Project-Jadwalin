# Jadwalin — AI Powered Smart Course Scheduling

Aplikasi web penjadwalan kuliah cerdas berbasis Express.js (Arsitektur MVC), EJS Template Engine, dan Tailwind CSS untuk Program Studi Teknologi Informasi (TI) Fakultas Teknik, Universitas Muhammadiyah Yogyakarta (UMY).

---

## Informasi

Pesan commit sebelumnya seharusnya berformat Week7

---

## Ringkasan Sistem (Berdasarkan PRD)

Penyusunan jadwal kuliah manual di prodi TI (21 dosen resmi, 57 mata kuliah kurikulum Sem 1–8 + 20 mata kuliah pilihan peminatan, 12 ruangan F4 & F6, dan 111 sesi pertemuan) memakan waktu 5–7 hari kerja dan rawan bentrok dosen/ruangan. Sistem **Jadwalin** dirancang secara khusus untuk:
1. **Memangkas waktu penyusunan**: Dari 5–7 hari menjadi **kurang dari 15 menit** (Metrik M-01).
2. **Nol Bentrok**: 0 bentrok dosen dan ruangan pada jadwal final (Metrik M-02).
3. **100% Lab Matching**: Seluruh mata kuliah praktikum ditempatkan pada laboratorium yang sesuai (Metrik M-03).
4. **Kepuasan Dosen**: Minimal 85% preferensi waktu mengajar dosen terakomodasi (Metrik M-04).

---

## Struktur Folder & Arsitektur MVC

```text
PAW-Project-Jadwalin/
├── config/                 # Pengaturan environment, port, dan koneksi database
│   ├── database.js         # Setup PostgreSQL Sequelize
│   └── index.js            # Konfigurasi aplikasi
├── controllers/            # Controller pemrosesan logika & response
│   ├── apiController.js    # Handler REST API (/api/*) dengan validasi Zod
│   └── homeController.js   # Handler render Single Page App (/)
├── docs/                   # Dokumen PRD dan sketsa wireframe antarmuka
│   ├── PRD-Kelompok5-TakeHome.docx.md
│   ├── design/             # Canvas dan spesifikasi desain antarmuka
│   └── images/
├── middlewares/            # Middleware aplikasi
│   └── logger.js           # Pencatatan request HTTP ke logs/logger.md
├── models/                 # Model domain akademik sesuai PRD
│   ├── masterModel.js      # Data master 21 dosen resmi, 57 MK kurikulum, 20 MK pilihan, 12 ruangan
│   ├── constraintModel.js  # Aturan Hard Constraints & Soft Constraints
│   ├── jadwalModel.js      # Jadwal hasil generate AI, deteksi konflik, & notifikasi
│   └── produkModel.js      # Pemetaan spesifikasi fitur PRD (F-01 s/d F-08)
├── routes/                 # Definisi rute Express.js
│   ├── api.js              # Endpoint REST API (termasuk CRUD Data Master)
│   ├── index.js            # Router agregator
│   └── web.js              # Rute frontend web
├── utils/                  # Helper fungsi reusable
│   └── helpers.js          # Formatter & response helper
├── views/                  # Template frontend EJS (Apple Monochrome Design)
│   ├── index.ejs           # Antarmuka Single Page App (Mahasiswa, Staf, Dosen, Sistem)
│   └── partials/           # Komponen layout (head, navbar, footer)
│       ├── footer.ejs
│       ├── head.ejs
│       └── navbar.ejs
├── logs/                   # Log aktivitas request
│   └── logger.md           # Format tabel Markdown request log
├── app.js                  # Entry point bootstrap Express.js
├── package.json            # Dependensi & script runner
├── .env.example            # Template konfigurasi environment
├── .gitignore              # Konfigurasi Git ignore
└── README.md               # Dokumentasi sistem
```

---

## Fitur & Hak Akses Persona (PRD)

1. **Mahasiswa (Ahmad Fauzi)**
   - Akses jadwal kuliah real-time dengan countdown sesi aktif (`08:50 - 11:30 | 00:42:15 left`) dan tampilan penuh (`Jadwal Lengkap`).
   - Jadwal lengkap semester bebas bentrok dengan filter hari dan banner notifikasi perubahan jadwal (US-07, US-08).
   - Landing modal (`Login`, `Coba demo` tutorial read-only, `Register`) serta 4-Step Onboarding Pra-KRS (validasi integer semester 1–12 tanpa dropdown, Year Picker angkatan, input Nama huruf besar + builder NIM `[angkatan]0140[3NIM]`, dan Grid View Mata Kuliah per kategori dengan AI Mapping & tombol `Minta Variasi Lain`).

2. **Staf Administrasi Akademik (Rina Wulandari)**
   - Panel CRUD Data Master: kelola, tambah, edit, dan hapus 21 Dosen Resmi, 57 Mata Kuliah Kurikulum (Sem 1–8) + 20 MK Pilihan (`PR`, `DA`, `NE`, `UX`), dan 12 Ruangan (Gedung F4 & F6) dengan pencarian dan validasi (US-01).
   - Pengaturan Hard Constraints (0 bentrok, 100% lab matching) dan Soft Constraints (preferensi dosen) (US-02).
   - Generator jadwal otomatis AI 1-klik (&lt; 15 menit), deteksi laporan konflik beserta saran perbaikan (US-03), serta preview multi-filter & publikasi jadwal (US-04).

3. **Dosen (Ir. Asroni, S.T., M.Eng)**
   - Jadwal mengajar pribadi per semester & notifikasi perubahan jadwal (US-06).
   - Form preferensi waktu mengajar dan hari riset (misal: hari Jumat bebas mengajar untuk penelitian) yang tersinkronisasi ke panel Staf Akademik (US-05).

---

## Uji Coba Fitur CRUD Data Master Dosen (Praktikum Pekan 8)

Sebagai pemenuhan capaian praktikum Pekan 8 untuk implementasi fitur **CRUD (Create, Read, Update, Delete)** penuh yang terintegrasi antara frontend (Single Page App) dan backend (Express.js REST API + Model), berikut dokumentasi tangkapan layar pengujian pada tabel **Dosen Resmi TI UMY**:

### 1. Create — Penambahan Data Dosen Baru
Formulir modal penambahan data master dosen dengan validasi schema Zod pada backend (`POST /api/master`). Data baru langsung ter-render di baris tabel secara dinamis tanpa perlu me-reload halaman.

![Uji Coba Create Dosen](docs/images/create%20dosen.png)

### 2. Update — Pengubahan Data Dosen
Tombol **Edit** pada setiap baris dosen membuka modal dengan field terisi otomatis. Perubahan data dikirim melalui method `PUT /api/master/dosen/:id` dan atribut baris tabel langsung diperbarui secara instan.

![Uji Coba Edit Dosen](docs/images/edit%20dosen.png)

### 3. Delete — Penghapusan Data Dosen
Tombol **Hapus** pada baris dosen memicu dialog konfirmasi interaktif. Setelah dikonfirmasi, sistem mengirim request `DELETE /api/master/dosen/:id`, menghapus elemen dari DOM, serta menata ulang nomor urut dan counter total dosen secara dinamis.

![Uji Coba Delete Dosen](docs/images/delete%20dosen.png)

---

## Cara Menjalankan Aplikasi

```bash
# Salin konfigurasi environment
cp .env.example .env

# Install dependensi
npm install

# Jalankan mode development
npm run dev

# Atau jalankan mode production
npm start
```

Akses aplikasi di: **`http://localhost:3000`**

---

## Endpoint REST API

| Method | Endpoint | Deskripsi | Format |
|---|---|---|---|
| `GET` | `/` | Antarmuka Single Page App Sistem Penjadwalan | HTML (EJS) |
| `GET` | `/api/status` | Status server, zero-clash metrics, uptime | JSON |
| `GET` | `/api/jadwal` | Data jadwal terpublikasi (mendukung filter kombinasi `dosen`, `ruang`, `kelas`, `hari`) | JSON |
| `POST` | `/api/jadwal/revisi` | Revisi slot jadwal, deteksi konflik otomatis, dan pencatatan notifikasi perubahan | JSON |
| `POST` | `/api/jadwal/prakrs` | AI Mapping rekomendasi kelas, variasi jadwal alternatif, dan validasi Onboarding Pra-KRS | JSON |
| `POST` | `/api/jadwal/publish` | Validasi zero-clash dan publikasi jadwal ke seluruh civitas | JSON |
| `GET` | `/api/master` | Data master 21 dosen resmi, 57 MK kurikulum, 20 MK pilihan, 12 ruangan | JSON |
| `POST` | `/api/master` | Tambah data dosen, mata kuliah, atau ruangan dengan validasi skema Zod | JSON |
| `PUT` | `/api/master/dosen/:id` | Update data dosen (inisial, nama, keahlian, beban SKS) | JSON |
| `DELETE` | `/api/master/dosen/:id` | Hapus data dosen dari Data Master Akademik | JSON |
| `GET` | `/api/constraints` | Konfigurasi Hard & Soft Constraints | JSON |
| `POST` | `/api/constraints/preferensi` | Simpan preferensi hari bebas mengajar dosen | JSON |
| `POST` | `/api/constraints/hard` | Aktifkan/nonaktifkan aturan Hard Constraint | JSON |
| `POST` | `/api/generate` | Trigger AI solver penjadwalan otomatis & resolusi konflik | JSON |
| `GET` | `/api/produk` | Spesifikasi modul & fitur sistem PRD (F-01 s/d F-08) | JSON |

---

## Request Logger

Setiap request HTTP dicatat ke `logs/logger.md` dalam format tabel Markdown:
- Timestamp (WIB)
- HTTP Method (`GET`, `POST`)
- URL Request
- Status Code (`200`, `201`, `400`, `404`, `422`)
- Durasi respons (ms)
- Alamat IP Client
