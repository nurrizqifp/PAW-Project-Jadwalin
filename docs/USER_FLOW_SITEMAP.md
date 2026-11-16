# Jadwalin — User Flow & Sitemap Specification
**Alur Kerja Tiga Persona: Staf Akademik (Admin), Dosen, & Mahasiswa**  
*Lead System Document v2.0*

---

## 1. Peta Situs Lengkap (Sitemap)

```text
/ (Layar Utama / Landing Modal: Login | Coba Demo | Daftar)
│
├── /login                         [Public/Auth] Form autentikasi lokal
├── /logout                        [Auth] Hapus token / sesi
│
├── /admin                         [Role: Admin / Staf Akademik]
│   ├── /admin/dashboard           Ringkasan jadwal, metrik M-01–M-04, status zero clash
│   ├── /admin/master/dosen        CRUD 21 Dosen, NIDN, inisial, keahlian, beban SKS
│   ├── /admin/master/matkul       CRUD 57 MK Kurikulum + 20 MK Pilihan Peminatan
│   ├── /admin/master/ruangan      CRUD 12 Ruang Kuliah & Laboratorium Komputer
│   ├── /admin/master/mahasiswa    CRUD Data Mahasiswa per angkatan
│   ├── /admin/constraints/hard    Toggle aturan wajib: HC-01, HC-02, HC-03
│   ├── /admin/constraints/soft    Kelola preferensi dosen (hari riset & jam pilihan)
│   ├── /admin/generate            Panel pemicu AI Solver & live progress
│   ├── /admin/jadwal              Preview kalender mingguan, filter multi-aspek, & tombol publikasi
│   └── /admin/notifikasi          Log seluruh pemberitahuan sistem
│
├── /dosen                         [Role: Dosen]
│   ├── /dosen/dashboard           Jadwal mengajar aktif hari ini & countdown sesi
│   ├── /dosen/jadwal              Jadwal mengajar satu semester (filter kelas & hari)
│   ├── /dosen/preferensi          Form hari off mengajar & alasan riset laboratorium
│   └── /dosen/notifikasi          Pemberitahuan perubahan slot mengajar
│
└── /mahasiswa                     [Role: Mahasiswa]
    ├── /mahasiswa/dashboard       Countdown sesi aktif real-time & jadwal hari ini
    ├── /mahasiswa/jadwal          Jadwal lengkap semester aktif bebas bentrok
    ├── /mahasiswa/prakrs          Wizard 4-Step Pra-KRS (Semester, Angkatan, NIM, Pemetaan AI)
    └── /mahasiswa/notifikasi      Pemberitahuan perubahan ruang / jadwal kuliah
```

---

## 2. Alur Pengguna (User Flow)

### 2.1 Alur Staf Akademik (Penyusunan & Publikasi Jadwal)
1. Login sebagai `admin`.
2. Verifikasi Data Master: pastikan data dosen, mata kuliah, dan ruangan lengkap.
3. Buka menu **Constraints**: pastikan HC-01 (Zero Clash Dosen), HC-02 (Zero Clash Ruangan), dan HC-03 (Jeda Ibadah) dalam kondisi aktif.
4. Buka menu **Generate**:
   - Pilih periode akademik (misal: Genap 2025/2026).
   - Klik **Jalankan AI Solver**.
   - Backend memicu integrasi Gemini API.
5. Jika ada pelanggaran Hard Constraint:
   - Sistem menampilkan **Laporan Konflik** beserta rekomendasi slot alternatif.
   - Admin dapat melakukan penyesuaian data atau revisi slot manual lewat klik slot jadwal.
6. Jika **Zero Clash Terpenuhi (0 konflik)**:
   - Admin memeriksa grid jadwal di halaman preview.
   - Tombol **Publikasikan** menjadi aktif.
   - Admin klik **Publikasikan**: status jadwal berubah menjadi `Terpublikasi`, dan notifikasi otomatis dikirim ke seluruh dosen dan mahasiswa.

### 2.2 Alur Dosen (Pengisian Preferensi & Monitoring Jadwal)
1. Login sebagai `dosen`.
2. Masuk ke halaman **Preferensi Waktu**:
   - Memilih 1 hari bebas mengajar (misal: Jumat untuk riset).
   - Mengisi alasan dan preferensi rentang jam mengajar.
   - Menyimpan preferensi (tersinkronisasi langsung ke constraint model admin).
3. Setelah jadwal diterbitkan:
   - Dosen membuka **Jadwal Saya**: hanya sesi mengajar yang diampu yang ditampilkan.
   - Menerima notifikasi instan jika admin memindahkan jam atau ruangan kelas.

### 2.3 Alur Mahasiswa (Pra-KRS Fleksibel & Akses Jadwal)
1. Mahasiswa mengakses web via desktop atau browser smartphone.
2. Membuka **Formulir Pra-KRS**:
   - **Langkah 1**: Input semester aktif (angka integer 1–12).
   - **Langkah 2**: Pilih tahun angkatan & masukkan 3 digit NIM. Sistem membentuk NIM resmi secara otomatis.
   - **Langkah 3**: AI merekomendasikan paket kelas bebas bentrok. Jika kurang cocok, mahasiswa dapat menekan tombol **Minta Variasi Lain** untuk mendapatkan alternatif kombinasi kelas.
3. Dashboard Mahasiswa menyajikan:
   - Countdown sesi aktif yang sedang berlangsung (`08:50 - 11:30 | 00:42:15 left`).
   - Tampilan hybrid: beralih antara grid mingguan atau daftar agenda harian.
