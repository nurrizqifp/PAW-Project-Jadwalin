# Jadwalin — Design System Specification (v2.0)
**Precision Academic & Corporate Interface Standard**  
*Lead UI Architecture · Berdasarkan Filter Antislop (UI, Human, Code, Copy, Layout Mobile)*

---

## 1. Filosofi & Arah Desain

Jadwalin dirancang dengan karakter **Precision + Academic**:
- **Bukan Mainan AI**: Nol emoji dekoratif, tanpa ornamen glow/pulse tak bermakna, tanpa kapsul banner "AI-Powered" yang berlebihan.
- **Data-Dense & Honest**: Prioritas utama adalah keterbacaan jadwal perkuliahan, slot waktu, ruangan lab, dan status konflik yang faktual.
- **Dual Mode (Light & Dark)**: Berakar pada skala monokrom netral **Zinc** (`zinc-50` hingga `zinc-950`).
- **Human & Accessible**: Kontras teks memenuhi standar WCAG AA (≥ 4.5:1 untuk teks normal, ≥ 3:1 untuk komponen non-teks dan heading besar), fokus keyboard terlihat tegas (`focus-visible:ring-2`), serta target sentuh minimal 44×44px pada layar ponsel.

---

## 2. Tipografi Resmi

Sistem tipografi menggunakan kombinasi 3 keluarga huruf khusus:

| Peran | Family | Fallback | Karakteristik |
|---|---|---|---|
| **Heading / Display** | `Bricolage Grotesque` | `sans-serif` | Tegas, geometris, berkarakter editorial akademik modern |
| **Body & UI Controls** | `Plus Jakarta Sans` | `system-ui, sans-serif` | Netral, legibilitas tinggi pada ukuran 12–16px, x-height seimbang |
| **Data, NIM, Waktu, Kode** | `Google Sans Code` | `'JetBrains Mono', monospace` | Presisi tinggi untuk slot waktu, jam, SKS, dan kode kelas |

### Skala Tipografi
- **Display / H1**: `font-heading text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50`
- **Section / H2**: `font-heading text-lg lg:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100`
- **Card Title / H3**: `font-heading text-base font-semibold text-zinc-900 dark:text-zinc-100`
- **Body Regular**: `font-sans text-sm font-normal text-zinc-700 dark:text-zinc-300 leading-relaxed`
- **UI Small / Caption**: `font-sans text-xs font-medium text-zinc-500 dark:text-zinc-400`
- **Code & Timestamp**: `font-mono text-xs tracking-tight text-zinc-800 dark:text-zinc-200`

---

## 3. Sistem Ikon (Phosphor Icons)

Semua ikon emoji dan representasi ASCII wajib diganti menggunakan **Phosphor Icons** (`@phosphor-icons/web`).

| Konteks | Class Ikon | Weight |
|---|---|---|
| Kalender / Jadwal | `ph ph-calendar` | Regular |
| Generate / Solusi AI | `ph ph-cpu` atau `ph ph-sparkle` | Bold (aksi aktif) |
| Jam / Countdown | `ph ph-clock` | Regular |
| Ruang / Lab | `ph ph-door` / `ph ph-flask` | Regular |
| Dosen / Civitas | `ph ph-chalkboard-teacher` | Regular |
| Mahasiswa | `ph ph-student` | Regular |
| Peringatan Hard Constraint | `ph ph-warning-circle` | Bold |
| Validasi Sukses | `ph ph-check-circle` | Fill / Bold |
| Filter & Opsi | `ph ph-faders` | Regular |
| Pengaturan Sistem | `ph ph-gear` | Regular |
| Notifikasi | `ph ph-bell` | Regular |
| Tema Gelap/Terang | `ph ph-sun` / `ph ph-moon` | Regular |

---

## 4. Token Warna & Palet Zinc (Light / Dark)

### Token Netral (Zinc Core)

```css
/* LIGHT MODE (Default) */
--bg-canvas:       #fafafa; /* zinc-50 */
--bg-surface:      #ffffff; /* white */
--bg-surface-sub:  #f4f4f5; /* zinc-100 */
--border-subtle:   #e4e4e7; /* zinc-200 */
--border-strong:   #d4d4d8; /* zinc-300 */
--text-primary:    #18181b; /* zinc-900 */
--text-secondary:  #52525b; /* zinc-600 */
--text-muted:      #71717a; /* zinc-500 */

/* DARK MODE */
--dark-bg-canvas:      #09090b; /* zinc-950 */
--dark-bg-surface:     #18181b; /* zinc-900 */
--dark-bg-surface-sub: #27272a; /* zinc-800 */
--dark-border-subtle:  #27272a; /* zinc-800 */
--dark-border-strong:  #3f3f46; /* zinc-700 */
--dark-text-primary:   #fafafa; /* zinc-50 */
--dark-text-secondary: #a1a1aa; /* zinc-400 */
--dark-text-muted:     #71717a; /* zinc-500 */
```

### Warna Semantik Fungsional
Warna hanya digunakan untuk menandakan kondisi fungsional (bukan ornamen visual):
- **Teori**: `blue-600` (Light: `bg-blue-50 border-blue-200 text-blue-900`, Dark: `bg-blue-950/40 border-blue-800 text-blue-200`)
- **Praktikum / Lab**: `emerald-600` (Light: `bg-emerald-50 border-emerald-200 text-emerald-900`, Dark: `bg-emerald-950/40 border-emerald-800 text-emerald-200`)
- **Peminatan / Pilihan**: `violet-600` (Light: `bg-violet-50 border-violet-200 text-violet-900`, Dark: `bg-violet-950/40 border-violet-800 text-violet-200`)
- **Hard Constraint Violation**: `rose-600` (Light: `bg-rose-50 border-rose-300 text-rose-900`, Dark: `bg-rose-950/50 border-rose-800 text-rose-200`)
- **Soft Constraint / Preferensi**: `amber-600` (Light: `bg-amber-50 border-amber-300 text-amber-900`, Dark: `bg-amber-950/50 border-amber-800 text-amber-200`)

---

## 5. Skala Radius Sudut (Strict Hierarchy)

Sesuai konfirmasi:
- **`rounded-md` (6px)**: Input form, button, dropdown item, badge.
- **`rounded-xl` (12px)**: Card konteks, container preview jadwal, alert box.
- **`rounded-2xl` (16px)**: Modal dialog box, slide-over drawer panel.

---

## 6. Layout Shell Navigasi

### Admin Shell: Sidebar Kiri Collapsible + Top Bar
- **Sidebar**: Menyimpan navigasi grup Master Data (Dosen, Ruang, MK, Mahasiswa), Constraints, Solver Generator, dan Log Publikasi. Bisa dilipat (`w-64` ke `w-16`).
- **Top Bar**: Menyimpan breadcrumb rute, indikator status jadwal aktif (`Draft` / `Terpublikasi`), toggle Dark Mode, lonceng notifikasi (slide-over trigger), dan avatar profil.

### Mahasiswa & Dosen Shell: Top Bar Ringkas + Quick Subnav
- Top bar minimalis dengan navigasi tab: *Dashboard (Sesi Aktif)*, *Jadwal Lengkap*, *Form Pra-KRS (Mahasiswa) / Preferensi (Dosen)*, dan Slide-over Notifikasi.

---

## 7. Tampilan Jadwal Hybrid: Grid Mingguan & Agenda View

Berdasarkan keputusan arsitektur, interface jadwal memiliki **Switcher Tab**:
1. **Grid View (Desktop Prioritas)**:
   - Kolom Senin s/d Sabtu dengan slot jam 07:00 – 17:00.
   - Kolom jam pertama terkunci (`sticky left-0`).
   - Slot istirahat sholat (Dhuhur 11:30–12:10 & Ashar) memotong secara elegan tanpa penumpukan data.
   - Klik langsung pada sesi membuka **Modal Edit Form Sesi** (tanpa drag-and-drop rapuh).
2. **Agenda View (Mobile Responsive Prioritas)**:
   - Sesi dijabarkan dalam urutan waktu kronologis per hari terpilih.
   - Kartu sesi memuat detail lengkap: Jam, Kode MK, Dosen Inisial/Nama, Ruang/Lab, Kelas, dan SKS.
   - Pilihan filter hari praktis (chip pills horizontal scrollable).

---

## 8. Drawer Slide-Over Notifikasi

Saat ikon lonceng diklik:
- Muncul drawer dari sisi kanan layar (`fixed inset-y-0 right-0 w-full sm:max-w-md bg-white dark:bg-zinc-900 shadow-2xl z-50`).
- Menyajikan linimasa perubahan slot jadwal, peringatan bentrok ruang, dan konfirmasi preferensi dosen.
- Tombol aksi: "Tandai sudah dibaca" dan "Filter per peran".

---

## 9. Antislop Quality Checklist (Verifikasi Kode & UI)

Sebelum setiap perubahan antarmuka dinyatakan selesai:
- [x] Nol emoji dekoratif (semua diganti ikon Phosphor).
- [x] Rasio kontras teks terverifikasi WCAG AA (≥ 4.5:1).
- [x] Kontrol keyboard: `focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100`.
- [x] Target sentuh mobile terjamin minimal 44×44px (`min-h-[44px]`).
- [x] Tanpa layout shift atau horizontal overflow tak terduga pada 360px viewport.
- [x] Bahasa lugas, tanpa istilah klise pemasaran (*elevate*, *seamless*, *supercharged*).
