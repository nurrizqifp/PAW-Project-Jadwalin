# Jadwalin — Master Job Distribution & Branch Mapping
**Pemetaan Tugas 6 Developer Sesuai Branch Git Repositori**  
*Lead System Document v2.0*

---

## 1. Pemetaan Branch Git

| No | Nama Developer | NIM | Git Branch | Peran Utama |
|---|---|---|---|---|
| 1 | **Nur Rizqi Febriansyah Putra** | 20240140056 | `nurrizqifp` | 🤖 AI Integration & Solver Core (Gemini API) |
| 2 | **Nisrina Hanifah Ramadhani** | 20240140075 | `nanaa` | 🎛 Frontend Admin Panel & Management UI |
| 3 | **Bima Eka Setiawan** | 20240140089 | `bims` | 🗄 Database Sequelize, Seeder & Auth Local |
| 4 | **Resya Glamoda Suhendri** | 20240140091 | `resya` | 🎓 Frontend Dosen, Mahasiswa & Wizard Pra-KRS |
| 5 | **Haidar Yahya Mudhofar** | 20240140093 | `yuum` | 🎨 Design System, Routing & Layout Architecture |
| 6 | **A. Muh. Fadil Asytar** | 20240140133 | `fadil` | 📅 Jadwal CRUD, Constraints & Notifikasi |

---

## 2. Deliverable Per Branch

### Branch `nurrizqifp` (Nur Rizqi - 056)
- File fokus: `services/aiSolverService.js`, `services/geminiClient.js`, `services/konflikService.js`, `controllers/generateController.js`.
- Tugas utama: Integrasi Gemini API, payload generator, pemrosesan output JSON jadwal, kalkulasi metrik M-01 s/d M-04, pembuatan laporan konflik otomatis.

### Branch `nanaa` (Nisrina - 075)
- File fokus: `views/admin/**/*.ejs` (Dashboard, Master Data Dosen/Ruang/MK/Mahasiswa, Constraints, Generate, Preview Jadwal).
- Tugas utama: Implementasi antarmuka admin lengkap, DataTable dengan pagination & pencarian, modal CRUD, progress bar solver, dan tombol publikasi terproteksi zero-clash.

### Branch `bims` (Bima - 089)
- File fokus: `models/**/*.js`, `migrations/*.js`, `seeders/*.js`, `middlewares/auth.js`, `middlewares/rbac.js`, `controllers/authController.js`.
- Tugas utama: 11 tabel Sequelize, migrasi database PostgreSQL, seeder komprehensif (21 dosen, 77 MK, 12 ruang + lab, mahasiswa per angkatan), login & register autentikasi lokal dengan bcrypt dan JWT.

### Branch `resya` (Resya - 091)
- File fokus: `views/dosen/**/*.ejs`, `views/mahasiswa/**/*.ejs`, `views/mahasiswa/prakrs.ejs`.
- Tugas utama: Dashboard mahasiswa dengan countdown sesi aktif real-time, form preferensi dosen (hari riset), wizard Pra-KRS 4-step fleksibel, dan slide-over notifikasi.

### Branch `yuum` (Haidar - 093)
- File fokus: `docs/DESIGN.md`, `docs/design/ui-kit.html`, `views/partials/*.ejs`, `routes/web.js`.
- Tugas utama: Standar desain Antislop (monokrom Zinc, Phosphor icons, Bricolage Grotesque & Plus Jakarta Sans), implementasi Dark Mode toggle, responsive layout mobile, dan arsitektur routing EJS.

### Branch `fadil` (Fadil - 133)
- File fokus: `controllers/jadwalController.js`, `controllers/constraintController.js`, `controllers/notifikasiController.js`, `services/notifikasiService.js`, `routes/api/*.js`.
- Tugas utama: REST API jadwal (filter dosen, ruang, kelas, hari), revisi slot jadwal via modal form, API publikasi jadwal, API toggle constraint, dan dispatch notifikasi perubahan.
