# Jadwalin — AI Generator & Solver Rules
**Panduan Teknis Integrasi Gemini API & Algoritma Zero-Clash Scheduling**  
*Owner: Nur Rizqi Febriansyah Putra (056) & Backend Team*

---

## 1. Peran & Batasan AI Solver

Sistem menggunakan **Gemini API** sebagai engine optimasi penjadwalan. Sesuai batasan PRD (Non-Goals):
- AI hanya digunakan untuk penyusunan jadwal kuliah, bukan chatbot atau fitur asisten interaktif percakapan.
- AI beroperasi dalam skenario batch/generate terstruktur, menerima payload data master dan menghasilkan daftar sesi perkuliahan dalam format JSON ketat.

---

## 2. Aturan Constraint (Wajib Dipatuhi AI)

### 2.1 Hard Constraints (Nol Toleransi Pelanggaran)
1. **HC-01 Zero Clash Dosen & Team Teaching**:
   - Dosen yang sama tidak boleh dijadwalkan pada dua sesi berbeda pada hari dan slot waktu yang saling tumpang tindih.
   - Sesi team teaching (contoh: `DP;QA`, `TA;AM`) mengikat seluruh dosen yang terlibat pada slot tersebut.
2. **HC-02 Zero Clash Ruangan**:
   - Satu ruangan (Gedung F4 & F6) tidak boleh digunakan oleh lebih dari satu kelas pada hari dan jam yang sama.
3. **HC-03 Jeda Waktu Ibadah Sholat**:
   - **Dhuhur**: Slot kuliah yang dimulai pagi wajib selesai selambat-lambatnya pukul 11:30 WIB, atau dimulai setelah pukul 12:10 WIB (rentang 11:30–12:10 bebas dari perkuliahan).
   - **Ashar**: Menghormati jeda ashar sekitar pukul 15:00–15:20 WIB.
4. **Lab Matching (100%)**:
   - Mata kuliah yang bertipe `Praktikum` hanya boleh ditempatkan pada ruangan dengan tipe `Laboratorium`.

### 2.2 Soft Constraints (Target Terpenuhi ≥ 85%)
1. **SC-01 Hari Riset Dosen**:
   - Menghindari penugasan mengajar pada `hariOff` yang didaftarkan dosen (contoh: Muhammad Abdul Haq bebas mengajar hari Jumat).
2. **SC-02 Preferensi Waktu**:
   - Memprioritaskan rentang waktu mengajar pagi (07:00–12:00) atau siang sesuai data preferensi.

---

## 3. Spesifikasi Prompt Gemini API

Backend memanggil Gemini API dengan parameter:
- **Temperature**: `0.1` (sangat deterministik dan patuh pada aturan logika constraint).
- **Response MIME Type**: `application/json`.

### Struktur Payload Input (Prompt Context)
```json
{
  "dosen": [
    { "id": 1, "inisial": "AS", "nama": "Ir. Asroni, S.T., M.Eng", "keahlian": "Rekayasa Web", "bebanMax": 12 },
    { "id": 4, "inisial": "HQ", "nama": "Muhammad Abdul Haq, Ph.D", "hariOff": "Jumat" }
  ],
  "ruangan": [
    { "id": 1, "kode": "F6.001", "tipe": "Ruang Kuliah Besar", "kapasitas": 80 },
    { "id": 13, "kode": "F4.LAB1", "tipe": "Laboratorium", "kapasitas": 40 }
  ],
  "mataKuliah": [
    { "kode": "TI501", "nama": "Pengembangan Aplikasi Web", "sks": 3, "jenis": "Teori", "kelas": "E" },
    { "kode": "TI205", "nama": "Praktikum Jaringan Komputer", "sks": 3, "jenis": "Praktikum", "kelas": "A" }
  ],
  "slotWaktuTersedia": [
    { "hari": "Senin", "jamMulai": "07:00", "jamSelesai": "08:40" },
    { "hari": "Senin", "jamMulai": "08:50", "jamSelesai": "11:30" },
    { "hari": "Senin", "jamMulai": "12:10", "jamSelesai": "15:00" },
    { "hari": "Senin", "jamMulai": "13:20", "jamSelesai": "16:20" }
  ]
}
```

### Struktur Output JSON Wajib
Gemini API wajib mengembalikan format array JSON tanpa markdown tambahan:
```json
{
  "jadwal": [
    {
      "kodeMatkul": "TI501",
      "mataKuliah": "Pengembangan Aplikasi Web",
      "sks": 3,
      "kelas": "E",
      "dosenInisial": "AS",
      "ruang": "F4.003",
      "hari": "Senin",
      "jamMulai": "08:50",
      "jamSelesai": "11:30",
      "jenis": "Teori"
    }
  ],
  "evaluasi": {
    "totalSesi": 111,
    "pelanggaranHardConstraint": 0,
    "persenPreferensiDosenTerpenuhi": 92.4,
    "persenLabMatching": 100.0,
    "durasiGenerateDetik": 1.4
  }
}
```

---

## 4. Validasi Zero-Clash Pasca-Generate

Backend `services/konflikService.js` melakukan double-check lokal atas output AI:
1. Memeriksa tabrakan `(dosen_id, hari, rentang_jam)`.
2. Memeriksa tabrakan `(ruangan_id, hari, rentang_jam)`.
3. Memastikan tidak ada kelas yang berlangsung di rentang 11:30–12:10 WIB (Dhuhur).
4. Jika ditemukan pelanggaran, status periode diset ke `Generated (Konflik)` dan data konflik disimpan ke tabel `konflik_log` beserta saran resolusinya.
