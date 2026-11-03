# Jadwalin — AI Powered Smart Course Scheduling

Aplikasi web penjadwalan kuliah cerdas berbasis **Express.js (Arsitektur MVC)**, **EJS Template Engine**, dan **Tailwind CSS** untuk Program Studi Teknologi Informasi (TI) Universitas Muhammadiyah Yogyakarta (UMY).

---

## 📌 Ringkasan Proyek

Penyusunan jadwal kuliah manual di prodi TI (20 dosen, 45 mata kuliah, 8 ruangan) memakan waktu 5–7 hari kerja dan rawan bentrok. **Jadwalin** dirancang untuk:
1. **Memangkas waktu penyusunan** dari 5–7 hari menjadi **&lt; 15 menit**.
2. **0 bentrok (Zero Clash)** dosen dan ruangan pada jadwal final.
3. **100% praktikum** ditempatkan pada laboratorium yang sesuai.
4. **&ge; 85% preferensi waktu** mengajar dosen terakomodasi.

---

## 📂 Struktur Folder & Tanggung Jawab (MVC)

Sesuai ketentuan standar arsitektur Express.js:

```text
PAW-Project-Jadwalin/
├── config/             # Pengaturan aplikasi (port, env, logger, koneksi database)
│   ├── database.js     # Setup & koneksi PostgreSQL Sequelize
│   └── index.js        # Konfigurasi aplikasi & environment variables
├── controllers/        # Logika pemrosesan request & response
│   ├── apiController.js   # Handler endpoint REST API (/api/status, /api/produk, /api/jadwal)
│   └── homeController.js  # Handler render halaman frontend EJS (/)
├── docs/               # PRD, sketsa wireframe UI, & dokumentasi proyek
│   ├── PRD-Kelompok5-TakeHome.docx.md
│   └── images/
├── middlewares/        # Middleware Express.js
│   └── logger.js       # Logger HTTP request otomatis ke file Markdown (logs/logger.md)
├── models/             # Pengelolaan data & operasi bisnis
│   ├── jadwalModel.js  # Data model jadwal kuliah
│   └── produkModel.js  # Data model produk & modul layanan Jadwalin (statis in-memory)
├── routes/             # Pemetaan endpoint URL ke controller
│   ├── api.js          # Rute /api/*
│   ├── index.js        # Entry agregasi routing
│   └── web.js          # Rute web frontend (/)
├── utils/              # Fungsi bantuan (helpers) reusable
│   └── helpers.js      # Format Rupiah, format tanggal, sanitasi markdown, response helper
├── views/              # Template frontend EJS & styling Tailwind CDN
│   ├── index.ejs       # Halaman utama landing page & dashboard preview
│   └── partials/       # Komponen template (head, navbar, footer)
│       ├── footer.ejs
│       ├── head.ejs
│       └── navbar.ejs
├── logs/               # Catatan aktivitas request HTTP
│   └── logger.md       # Format tabel markdown request log
├── app.js              # Entry point Express.js & server bootstrap
├── package.json        # Manifest dependensi & script runner
├── .env.example        # Template konfigurasi environment
├── .gitignore          # Daftar file/folder yang diabaikan Git
└── README.md           # Dokumentasi proyek
```

---

## 🛠️ Stack Teknologi & Dependensi

| Paket | Tipe | Fungsi |
|---|---|---|
| **express** | Core | Framework backend web & REST API |
| **ejs** | Template Engine | Merender halaman frontend terintegrasi dengan backend |
| **dotenv** | Config | Mengelola konfigurasi environment variable (.env) |
| **zod** | Utility | Validasi skema input data & request body |
| **pg** & **sequelize** | ORM / DB | Fondasi koneksi database PostgreSQL untuk milestone lanjutan |
| **nodemon** | Dev Tool | Auto-reload server saat pengembangan |
| **Tailwind CSS (CDN)** | Styling UI | Utility-first CSS responsif tanpa overhead build step |

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Prasyarat
- Node.js (v18+)
- NPM

### 2. Instalasi
```bash
# Clone repository (jika belum)
git clone https://github.com/nurrizqifp/PAW-Project-Jadwalin.git
cd PAW-Project-Jadwalin

# Salin konfigurasi environment
cp .env.example .env

# Install dependensi
npm install
```

### 3. Menjalankan Server
```bash
# Mode Development (Auto-reload dengan nodemon)
npm run dev

# Mode Production
npm start
```

Buka browser di: **`http://localhost:3000`**

---

## 🌐 Endpoint API

| Method | Endpoint | Deskripsi | Format Response |
|---|---|---|---|
| `GET` | `/` | Halaman landing page & preview jadwal interaktif | HTML (EJS) |
| `GET` | `/api/status` | Informasi status server, uptime, & waktu server | JSON |
| `GET` | `/api/produk` | Daftar modul dan produk layanan Jadwalin | JSON Array |
| `GET` | `/api/jadwal` | Data contoh jadwal perkuliahan TI UMY | JSON Array |

---

## 📝 Request Logger

Setiap request HTTP dicatat secara otomatis ke **`logs/logger.md`** dengan format tabel Markdown:
- Timestamp (WIB)
- HTTP Method (`GET`, `POST`, dll.)
- URL Request
- Status Code (`200`, `404`, dll.)
- Durasi respons (ms)
- Alamat IP Client

---

## 👥 Tim Pengembang — Kelompok 5 (TI UMY)

- **Nur Rizqi Febriansyah Putra** (20240140056)
- **Nisrina Hanifah Ramadhani** (20240140075)
- **Bima Eka Setiawan** (20240140089)
- **Resya Glamoda Suhendri** (20240140091)
- **Haidar Yahya Mudhofar** (20240140093)
- **A. Muh. Fadil Asytar** (20240140133)
