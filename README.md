# Jadwalin — AI Powered Smart Course Scheduling

Aplikasi web penjadwalan kuliah cerdas berbasis Express.js (Arsitektur MVC), EJS Template Engine, dan Tailwind CSS untuk Program Studi Teknologi Informasi (TI) Fakultas Teknik, Universitas Muhammadiyah Yogyakarta (UMY).

---

## Ringkasan Sistem (Berdasarkan PRD)

Penyusunan jadwal kuliah manual di prodi TI (20 dosen, 45 mata kuliah, 8 ruangan) memakan waktu 5–7 hari kerja dan rawan bentrok dosen/ruangan. Sistem **Jadwalin** dirancang secara khusus untuk:
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
│   ├── apiController.js    # Handler REST API (/api/*)
│   └── homeController.js   # Handler render Single Page App (/)
├── docs/                   # Dokumen PRD dan sketsa wireframe antarmuka
│   ├── PRD-Kelompok5-TakeHome.docx.md
│   └── images/
├── middlewares/            # Middleware aplikasi
│   └── logger.js           # Pencatatan request HTTP ke logs/logger.md
├── models/                 # Model domain akademik sesuai PRD
│   ├── masterModel.js      # Data master 20 dosen, 45 mata kuliah, 8 ruangan
│   ├── constraintModel.js  # Aturan Hard Constraints & Soft Constraints
│   ├── jadwalModel.js      # Jadwal hasil generate AI & solver
│   └── produkModel.js      # Pemetaan spesifikasi fitur PRD (F-01 s/d F-08)
├── routes/                 # Definisi rute Express.js
│   ├── api.js              # Endpoint REST API
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

1. **Mahasiswa (Andi Pratama)**
   - Akses jadwal kuliah real-time dengan countdown sesi aktif (`08:50 - 11:30 | 42:15 left`).
   - Jadwal lengkap semester bebas bentrok dengan filter hari.
   - Konfigurasi profil & Pra-KRS dengan validasi angka semester (1–12), angkatan, nama, dan NIM.

2. **Staf Administrasi Akademik (Rina Wulandari)**
   - Pengelolaan data master: 20 Dosen, 45 Mata Kuliah, 8 Ruangan (Kelas Teori & Laboratorium).
   - Pengaturan Hard Constraints (0 bentrok, 100% lab matching) dan Soft Constraints (preferensi dosen).
   - Generator jadwal otomatis AI 1-klik (&lt; 15 menit) dan publikasi jadwal.

3. **Dosen (Dr. Budi Santoso)**
   - Jadwal mengajar pribadi per semester.
   - Form preferensi waktu mengajar dan hari riset (misal: hari Jumat bebas mengajar untuk penelitian).

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
| `GET` | `/api/jadwal` | Data jadwal perkuliahan terpublikasi (filter dosen/ruang/kelas) | JSON |
| `GET` | `/api/master` | Data master 20 dosen, 45 mata kuliah, 8 ruangan | JSON |
| `GET` | `/api/constraints` | Konfigurasi Hard & Soft Constraints | JSON |
| `POST` | `/api/generate` | Trigger AI solver penjadwalan otomatis | JSON |
| `GET` | `/api/produk` | Spesifikasi modul & fitur sistem PRD (F-01 s/d F-08) | JSON |

---

## Request Logger

Setiap request HTTP dicatat ke `logs/logger.md` dalam format tabel Markdown:
- Timestamp (WIB)
- HTTP Method (`GET`, `POST`)
- URL Request
- Status Code (`200`, `404`)
- Durasi respons (ms)
- Alamat IP Client
