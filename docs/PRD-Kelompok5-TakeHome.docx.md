**Product Requirements Document (PRD)**

Template Ujian PAW — dikerjakan di kampus

## **Header**

**Yang dikerjakan:** Isi identitas dan nama produk (buat nama sendiri, jangan hanya menyalin nama studi kasus). Status dibiarkan Draft.

| Field | Isi |
| :---- | :---- |
| Nama produk | AI Powered Smart Course Scheduling |
| Versi / Tanggal | v1.1 / 17 Oktober 2026 |
| Penulis (Nama & NIM) | Nur Rizqi Febriansyah Putra 20240140056 Nisrina Hanifah Ramadhani 20240140075 Bima Eka Setiawan 20240140089 Resya Glamoda Suhendri 20240140091 Haidar Yahya Mudhofar 20240140093 A. Muh. Fadil Asytar 20240140133 |
| Status | Draft |

# **1\. Problem Statement & Latar Belakang**

**Yang dikerjakan:** Jelaskan masalah nyata pada studi kasus: siapa yang terdampak, apa akibatnya, dan kenapa perlu solusi digital. Belum boleh menyebut fitur di sini.

Penyusunan jadwal kuliah di prodi Teknologi Informasi (TI) UMY masih dilakukan manual oleh staf administrasi akademik setiap semester. Dengan contoh data variatif seperti 20 dosen, 45 mata kuliah, dan 8 ruangan, proses ini memakan 5-7 hari kerja. Jumlah dosen tetap terbatas, sementara mata kuliah praktikum harus ditempatkan di laboratorium yang sesuai, sehingga jadwal sangat rawan bentrok antar dosen maupun ruangan.

Dampaknya dirasakan banyak pihak. Staf akademik menghabiskan waktu berhari-hari dan harus mengecek ulang jadwal secara manual. Dosen berisiko mendapat jadwal ganda dan preferensi waktu mengajarnya sulit terakomodasi. Mahasiswa berisiko mengalami bentrok kelas atau praktikum di lab yang tidak sesuai, sehingga kegiatan belajar di awal semester terganggu. Penyusunan manual terlalu lambat dan rentan salah untuk kompleksitas sebesar ini, sehingga prodi membutuhkan solusi digital berbasis AI untuk mengatur jadwal perkuliahan.

# **2\. Goals & Non-Goals**

**Yang dikerjakan:** Goals \= hasil yang ingin dicapai produk, bukan daftar fitur (min. 2). Non-goals \= hal yang sengaja tidak dikerjakan supaya batas produk jelas (min. 2).

* **Goals:** 

- AI mengatur jadwal kuliah secara otomatis, selesai dalam \< 15 menit (sebelumnya 5-7 hari kerja manual).  
- Jadwal final 0 bentrok dosen dan ruangan.  
- Praktikum selalu masuk laboratorium yang sesuai.  
- Minimal 85% preferensi waktu mengajar dosen terpenuhi.

* **Non-goals (sengaja tidak dikerjakan):** 

- AI hanya untuk mengatur jadwal, bukan chatbot atau fitur AI lainnya.  
- Tidak mengelola KRS, presensi, nilai, maupun jadwal ujian.  
- Hanya untuk satu prodi (TI), bukan seluruh universitas.

# **3\. Success Metrics**

**Yang dikerjakan:** Tentukan ukuran keberhasilan yang bisa diukur dengan angka dan terkait langsung dengan goals (min. 2 metrik). Hindari target seperti "user senang" tanpa angka.

| ID | Metrik | Target |
| ----- | ----- | ----- |
| M-01 | Waktu AI menyusun jadwal satu semester (sebelumnya 5-7 hari kerja manual)  | \< 15 menit |
| M-02 | Jumlah bentrok dosen dan ruangan pada jadwal final  | 0 |
| M-03 | Persentase mata kuliah praktikum yang masuk laboratorium sesuai | 100% |
| M-04 | Persentase preferensi waktu mengajar dosen yang terpenuhi | ≥ 85% |

# **4\. Target User / Persona**

**Yang dikerjakan:** Tentukan 1–3 persona. Kebutuhan tiap persona harus nyambung dengan masalah di bagian 1\.

| Persona | Deskripsi | Kebutuhan utama |
| ----- | ----- | :---- |
| Rina Wulandari  | Staf Administrasi Akademik | Input dan kelola data. Validasi hard constraint dan preferensi dosen. Preview jadwal berdasarkan dosen, ruang, dan kelas.  Revisi dan generate ulang. |
| Andi Pratama | Mahasiswa  | Informasi jadwal kuliah yang akurat. Fitur untuk melihat detail mata kuliah, dosen, ruang, dan waktu. Notifikasi jika ada perubahan jadwal atau konflik. Akses mudah melalui web dan perangkat mobile. |
| Budi Santoso | Dosen | Melihat jadwal mengajar yang jelas dan detail (ruang, waktu, kelas). Fitur untuk mengatur preferensi waktu mengajar dan hari yang tidak bisa digunakan. Notifikasi jika ada perubahan jadwal atau konflik. Akses mudah melalui web dan perangkat mobile. |

# **5\. User Stories & Acceptance Criteria**

**Yang dikerjakan:** Tulis user story untuk tiap persona (min. 5). Setiap story wajib punya acceptance criteria format Given-When-Then yang bisa dites, bukan kalimat umum.

| ID | User Story | Acceptance Criteria |
| :---- | :---- | :---- |
| US-01 | Sebagai Rina (Staf Akademik), saya ingin mengelola data dosen, mata kuliah, dan ruangan di satu tempat, agar tidak perlu mengumpulkan data dari banyak sumber  | **Given** Rina berada di halaman Data Master Akademik **When** ia menginput data 20 dosen, 45 mata kuliah, dan 8 ruangan (jenis: kelas atau laboratorium) **Then** data tampil di tabel dan bisa dicari. Baris dengan kolom wajib kosong ditolak dengan pesan error. |
| US-02 | Sebagai Rina, saya ingin mengatur hard constraint (tidak boleh bentrok, praktikum wajib di laboratorium) dan soft constraint (preferensi waktu dosen), agar jadwal yang dihasilkan valid.  | **Given** data master sudah terisi **When** Rina mengaktifkan aturan "dosen tidak boleh mengajar dua kelas di waktu yang sama" dan "praktikum wajib di laboratorium", lalu menyimpan **Then** constraint tersimpan dan dipakai pada proses generate berikutnya. |
| US-03 | Sebagai Rina, saya ingin menyusun jadwal otomatis dengan satu klik dan mendapat laporan konflik jika ada, agar penyusunan turun dari 5-7 hari kerja menjadi hitungan menit.  | **Given** data master dan constraint sudah lengkap **When** Rina mengklik "Generate" **Then** jadwal selesai disusun dalam waktu \< 15 menit. Jika masih ada konflik hard constraint, laporan konflik beserta saran perbaikan tampil dan Rina bisa Generate ulang setelah merevisi data atau constraint. |
| US-04 | Sebagai Rina, saya ingin memeriksa preview jadwal lalu mempublikasikannya, agar hanya jadwal yang sudah benar yang dilihat civitas.  | **Given** hasil generate tidak memuat konflik hard constraint **When** Rina membuka Preview Jadwal, memfilter per dosen, ruang, atau kelas, lalu mengklik "Publikasikan" **Then** grid hanya menampilkan data sesuai filter, dan status jadwal berubah menjadi "Terpublikasi".  |
| US-05 | Sebagai Budi (Dosen), saya ingin mengisi preferensi waktu mengajar dan hari yang tidak bisa digunakan, agar jadwal menyesuaikan kegiatan penelitian saya.  | **Given** periode jadwal sedang dibuka untuk pengisian preferensi **When** Budi memilih hari "Jumat" sebagai tidak tersedia, lalu menyimpan **Then** preferensi tersimpan dan terlihat oleh Rina, dan jadwal hasil generate tidak memuat kelas Budi di hari Jumat.  |
| US-06 | Sebagai Budi, saya ingin melihat jadwal mengajar saya dan menerima notifikasi jika ada perubahan, agar bisa merencanakan kegiatan mengajar dan riset.  | **Given** jadwal sudah berstatus "Terpublikasi" **When** Budi membuka halaman Jadwal Saya **Then** hanya kelas yang ia ampu yang tampil (mata kuliah, hari, jam, ruang, kelas). Jika jadwal berubah, notifikasi di sistem web menampilkan ringkasan perubahannya.  |
| US-07 | Sebagai Andi (Mahasiswa), saya ingin melihat jadwal kuliah yang akurat beserta dosen, ruang, dan waktunya lewat browser di laptop maupun smartphone, agar tidak bolak-balik mengecek informasi.  | **Given** jadwal sudah berstatus "Terpublikasi" **When** Andi membuka jadwal kuliah semester 4 lewat browser smartphone **Then** seluruh mata kuliahnya tampil lengkap dengan dosen, ruang, hari, dan jam, tanpa jadwal bentrok. Tampilan terbaca tanpa zoom atau geser horizontal.  |
| US-08 | Sebagai Andi, saya ingin menerima notifikasi jika jadwal berubah, agar bisa menyesuaikan rencana dengan kegiatan organisasi dan kerja  | **Given** jadwal yang sudah terbit diubah oleh Rina **When** perubahan disimpan **Then** notifikasi di sistem web menampilkan mata kuliah yang berubah beserta waktu atau ruang barunya.  |

# **6\. Fitur & Prioritas (MoSCoW)**

**Yang dikerjakan:** Ubah user story menjadi fitur, beri ID, hubungkan ke ID US, lalu tentukan prioritas MoSCoW beserta alasannya. Tidak boleh semua fitur Must.

| ID Fitur | Nama fitur | Terkait US | Prioritas | Alasan prioritas |
| :---- | :---- | :---- | :---- | :---- |
| F-01 | Kelola Data Master Akademik  | US-01 | Must | Tanpa data dosen, mata kuliah, dan ruangan, AI tidak punya bahan untuk menyusun jadwal. |
| F-02 | Pengaturan Hard & Soft Constraint  | US-02 | Must  | Menjamin jadwal 0 bentrok dan praktikum masuk laboratorium yang sesuai (M-02, M-03).  |
| F-03 | Generate Jadwal Otomatis (AI)  | US-03 | Must | Fitur utama project ini yang memangkas penyusunan dari 5-7 hari kerja menjadi \< 15 menit (M-01).  |
| F-04 | Laporan Konflik & Saran Perbaikan | US-03 | Must | Mempercepat revisi, tetapi jadwal tetap bisa dihasilkan dan diperiksa tanpa saran otomatis.  |
| F-05 | Preview & Publikasi Jadwal  | US-04  | Must | Pemeriksaan wajib sebelum publikasi, dan publikasi adalah cara jadwal sampai ke dosen dan mahasiswa. |
| F-06 | Form Preferensi Dosen  | US-05  | Should  | Mendukung target 90% preferensi terpenuhi (M-04), tetapi preferensi sementara bisa diinput staf lewat halaman constraint |
| F-07 | Lihat Jadwal Terpublikasi (Dosen & Mahasiswa)  | US-06, US-07  | Must | Nilai akhir bagi dosen dan mahasiswa serta menjawab masalah kurangnya transparansi jadwal. |
| F-08 | Notifikasi Perubahan Jadwal (di Web)  | US-06, US-08  | Should  | Penting untuk perubahan setelah terbit, tetapi civitas masih bisa mengecek jadwal langsung di sistem.  |
| F-09 | Tampilan Web Responsif (Browser Smartphone)  | US-07  | Could  | Memudahkan akses dari smartphone tanpa aplikasi, tetapi tampilan desktop sudah cukup untuk rilis awal. |
| F-10 | Aplikasi Mobile Native & Integrasi KRS, Presensi, Nilai, Jadwal Ujian  | US-07  | Won't  | Produk berbentuk web dan hanya fokus pada penjadwalan kuliah TI (sesuai non-goals). Ditunda ke rilis berikutnya. |

*Prioritas: Must / Should / Could / Won't. Alasan prioritas wajib diisi.*

# **7\. Scope & Out of Scope**

**Yang dikerjakan:** Tegaskan batas: apa yang dibangun pada versi ini dan apa yang tidak. Harus konsisten dengan non-goals dan prioritas Won't.

* **In scope:** Pengembangan aplikasi web untuk TI UMY yang mencakup pengelolaan data dosen, mata kuliah, dan ruangan; pengaturan hard constraint dan soft constraint; generate jadwal otomatis beserta laporan konflik dan saran perbaikan; preview, validasi, dan publikasi jadwal; form preferensi dosen; tampilan jadwal terpublikasi untuk dosen dan mahasiswa; serta notifikasi perubahan jadwal melalui web. Tampilan web responsif pada browser smartphone diupayakan sesuai waktu dan sumber daya yang tersedia.  
* **Out of scope:** Aplikasi mobile native; pengelolaan KRS, presensi, nilai, dan jadwal ujian; chatbot atau penggunaan AI di luar penjadwalan kuliah; serta penerapan sistem untuk prodi selain TI UMY.

# **8\. Asumsi, Dependensi, Constraint**

**Yang dikerjakan:** Tulis hal yang dianggap benar tapi belum pasti, hal yang bergantung pada pihak/teknologi lain, dan batasan (waktu, teknologi, anggaran).

* **Asumsi:** Data dosen, mata kuliah, ruangan beserta jenisnya, slot hari dan jam, kebutuhan ruang praktikum, serta preferensi waktu dosen tersedia, benar, dan diperbarui oleh staf akademik sebelum proses generate dilakukan.  
* **Dependensi:** Hasil penjadwalan bergantung pada kelengkapan data master dan aturan hard constraint maupun soft constraint yang ditetapkan staf akademik. Sistem juga memerlukan database, server, dan koneksi jaringan agar jadwal dapat dibuat, dipublikasikan, serta diakses dosen dan mahasiswa.  
* **Constraint:** Versi awal hanya berbentuk web dan digunakan di TI UMY. Targetnya adalah generate kurang dari 15 menit, nol bentrok dosen dan ruangan pada jadwal final, 100% mata kuliah praktikum ditempatkan di laboratorium yang sesuai, serta minimal 85% preferensi waktu dosen terpenuhi. Waktu pengerjaan, anggaran, dan infrastruktur mengikuti sumber daya proyek yang tersedia; nominal anggaran dan spesifikasi server belum ditetapkan.

# **9\. Risiko & Mitigasi (opsional / bonus)**

**Yang dikerjakan:** Bonus. Sebutkan risiko yang bisa menggagalkan produk, dampaknya, dan cara mengurangi risiko tersebut.

| Risiko | Dampak | Mitigasi |
| :---- | :---- | :---- |
| Data master dosen, mata kuliah, atau ruangan tidak lengkap maupun keliru. | Jadwal yang dihasilkan tidak valid, kebutuhan praktikum tidak terpenuhi, atau proses generate harus diulang. | Validasi kolom wajib saat input dan lakukan pemeriksaan data master oleh staf akademik sebelum generate. |
| Kombinasi ketersediaan dosen, slot waktu, ruangan, dan constraint tidak memungkinkan jadwal yang valid. | Sistem gagal menghasilkan jadwal tanpa bentrok atau target waktu penyusunan tidak tercapai. | Tampilkan laporan konflik hard constraint, periksa kembali ketersediaan slot dan data, lalu revisi constraint atau data yang keliru sebelum generate ulang. |
| Proses generate memerlukan waktu lebih dari 15 menit atau menghasilkan susunan jadwal yang kurang sesuai. | Target M-01 tidak tercapai dan staf akademik tetap membutuhkan banyak waktu untuk revisi. | Uji proses generate menggunakan data yang mewakili kondisi TI, ukur durasi dan hasilnya, lalu optimalkan proses sebelum jadwal dipublikasikan. |
| Perubahan jadwal setelah publikasi tidak tersampaikan kepada pengguna. | Dosen dan mahasiswa berpotensi menggunakan informasi ruang atau waktu yang sudah tidak berlaku. | Simpan status dan waktu pembaruan jadwal, tampilkan notifikasi perubahan di web, serta uji alur perubahan sampai notifikasi diterima. |
| Pengguna yang tidak berwenang mengubah atau memublikasikan jadwal. | Integritas jadwal terganggu dan informasi akademik yang dilihat pengguna menjadi tidak dapat dipercaya. | Batasi akses berdasarkan peran; hanya staf akademik berwenang yang dapat mengelola dan memublikasikan jadwal, serta catat perubahan penting. |

