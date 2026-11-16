# Jadwalin — System Architecture & Design
**AI Powered Smart Course Scheduling · TI UMY**  
*Lead Architecture Specification v2.0*

---

## 1. Ringkasan Eksekutif

Sistem **Jadwalin** dirancang untuk memecahkan bottleneck penyusunan jadwal kuliah manual di Prodi Teknologi Informasi Fakultas Teknik UMY yang sebelumnya memakan waktu 5–7 hari kerja dan rawan bentrok jadwal dosen serta ruangan.

### Metrik Keberhasilan (PRD Section 3)
- **M-01**: Waktu AI menyusun jadwal satu semester < 15 menit.
- **M-02**: Jumlah bentrok dosen dan ruangan pada jadwal final = 0 (Zero Clash).
- **M-03**: Persentase mata kuliah praktikum yang masuk laboratorium sesuai = 100%.
- **M-04**: Persentase preferensi waktu mengajar dosen yang terpenuhi ≥ 85%.

---

## 2. Arsitektur Database Relasional (PostgreSQL + Sequelize)

### ERD 11 Entitas Inti
```text
USERS (id, username, password_hash, role, ref_id)
  ├── DOSEN (id, inisial, nidn, nama, keahlian, beban_sks_max)
  └── MAHASISWA (id, nim, nama, angkatan, semester_aktif, kode_peminatan)

MATA_KULIAH (id, kode, nama, sks, semester, kategori, jenis, kode_peminatan, semester_penawaran)
RUANGAN (id, kode, nama, gedung, tipe, kapasitas)
PERIODE_JADWAL (id, nama, tahun_akademik, semester_tipe, status, generated_at, published_at, generated_by)

JADWAL_SESI (id, periode_id, mata_kuliah_id, ruangan_id, hari, jam_mulai, jam_selesai, kelas, is_pilihan, is_lab_valid, melewati_istirahat)
  └── JADWAL_DOSEN (id, jadwal_sesi_id, dosen_id, is_team_teaching) [Pivot Table]

CONSTRAINT_HARD (id, kode, nama, deskripsi, is_active)
CONSTRAINT_SOFT (id, dosen_id, hari_off, preferensi_waktu, alasan, is_accommodated)
NOTIFIKASI (id, periode_id, target_role, target_ref_id, judul, isi, is_read)
KONFLIK_LOG (id, periode_id, tipe, kode_constraint, deskripsi, saran_perbaikan, is_resolved)
```

### Relasi Kunci
1. **Team Teaching**: Satu `JADWAL_SESI` dapat diajar oleh lebih dari satu dosen melalui tabel pivot `JADWAL_DOSEN`.
2. **Lab Matching**: Mata kuliah bertipe `Praktikum` wajib terhubung ke `RUANGAN` dengan `tipe = 'Laboratorium'`.
3. **Periode Multi-Instance**: Setiap generate menghasilkan record `PERIODE_JADWAL`. Hanya satu periode yang dapat berstatus `Terpublikasi` pada satu waktu.
