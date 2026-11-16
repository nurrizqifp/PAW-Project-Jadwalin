# Jadwalin — Feature Specifications & MoSCoW Matrix
**Spesifikasi Fungsional F-01 s/d F-09 & API Contracts**  
*Lead System Document v2.0*

---

## 1. Matriks Fitur MoSCoW (PRD Section 6)

| ID Fitur | Nama Fitur | Prioritas | Terkait US | Pemilik Tugas |
|---|---|---|---|---|
| **F-01** | Kelola Data Master Akademik | **Must** | US-01 | Bima (089) & Nisrina (075) |
| **F-02** | Pengaturan Hard & Soft Constraint | **Must** | US-02 | Fadil (133) & Nisrina (075) |
| **F-03** | Generate Jadwal Otomatis (AI) | **Must** | US-03 | Nur Rizqi (056) & Nisrina (075) |
| **F-04** | Laporan Konflik & Saran Perbaikan | **Must** | US-03 | Nur Rizqi (056) & Nisrina (075) |
| **F-05** | Preview & Publikasi Jadwal | **Must** | US-04 | Fadil (133) & Nisrina (075) |
| **F-06** | Form Preferensi Dosen | **Should** | US-05 | Fadil (133) & Resya (091) |
| **F-07** | Lihat Jadwal Terpublikasi | **Must** | US-06, US-07 | Fadil (133) & Resya (091) |
| **F-08** | Notifikasi Perubahan Jadwal (Web) | **Should** | US-06, US-08 | Fadil (133) & Resya (091) |
| **F-09** | Tampilan Web Responsif Mobile | **Could** | US-07 | Haidar (093) |

---

## 2. Rincian Fitur & Kriteria Penerimaan

### F-01: Kelola Data Master Akademik
- **Deskripsi**: Admin dapat menambah, mengubah, melihat, dan menghapus (CRUD) data 21 Dosen, 77 Mata Kuliah, 12 Ruang Kuliah/Laboratorium, serta data Mahasiswa.
- **Validasi Zod**:
  - Dosen: nama wajib min 3 karakter, beban SKS integer 1–60.
  - Mata Kuliah: kode unik min 3 karakter, sks integer 1–6, semester 1–8.
  - Ruangan: kode ruang min 2 karakter, kapasitas integer 10–200, tipe: `Reguler`, `Ruang Kuliah Besar`, `Laboratorium`.
- **Response**: Mengembalikan status 201 Created pada penambahan baru dan 200 OK pada update/delete.

### F-02: Pengaturan Constraint
- **Deskripsi**: Menyediakan kontrol toggle untuk aturan wajib (HC-01, HC-02, HC-03) dan penyimpanan preferensi hari riset dosen.
- **Endpoint**:
  - `POST /api/constraints/hard` `{ id: 'HC-01', isActive: true }`
  - `POST /api/constraints/preferensi` `{ dosenNama, hariOff, alasan }`

### F-03 & F-04: AI Generator & Deteksi Konflik
- **Deskripsi**: Menjalankan AI Solver berbasis Gemini API. Waktu eksekusi dicatat dan dibandingkan dengan target < 15 menit. Jika ada bentrok, dihasilkan daftar konflik dengan kode dan rekomendasi slot pengganti.
- **Endpoint**: `POST /api/generate` `{ periodeNama, tahunAkademik, semesterTipe }`

### F-05: Preview & Publikasi
- **Deskripsi**: Memeriksa hasil generate melalui kalender mingguan. Tombol "Publikasikan" hanya aktif bila `totalKonflik === 0`.
- **Endpoint**: `POST /api/jadwal/publish` `{ periodeId }`

### F-06: Form Preferensi Dosen
- **Deskripsi**: Antarmuka bagi dosen untuk memilih hari bebas mengajar dan waktu riset.
- **UI State**: Menampilkan status "Terakomodir" atau "Menunggu Generate".

### F-07: Lihat Jadwal (Dosen & Mahasiswa)
- **Deskripsi**:
  - Dosen hanya melihat kelas yang diampunya.
  - Mahasiswa melihat kelas sesuai semesternya dengan countdown sesi aktif yang sedang berlangsung.
- **Endpoint**: `GET /api/jadwal?dosen=AS` atau `GET /api/jadwal?semester=4`

### F-08: Notifikasi Perubahan Jadwal
- **Deskripsi**: Drawer slide-over yang mencatat setiap revisi slot atau pengumuman jadwal baru.
- **Endpoint**: `GET /api/notifikasi` dan `PUT /api/notifikasi/read-all`

### F-09: Tampilan Responsif Mobile
- **Deskripsi**: Mode Agenda harian dengan chip hari dan scroll horizontal bebas layout shift pada viewport 360px ke atas.
