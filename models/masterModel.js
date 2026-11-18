/**
 * Model Data Master Akademik TI UMY
 * Dataset Bersih: Kurikulum Semester 1-8, MK Pilihan Peminatan (PR, DA, NE, UX),
 * MKWU (Mata Kuliah Wajib Universitas), Dosen Riil, dan Ruangan Gedung F4 & F6.
 */

const daftarDosen = [
  {
    "id": 1,
    "inisial": "AS",
    "nama": "Ir. Asroni, S.T., M.Eng",
    "keahlian": "Rekayasa Web & Komputasi",
    "bebanSks": 12
  },
  {
    "id": 2,
    "inisial": "DP",
    "nama": "Dr. Ir. Dwijoko Purbohadi, M.T.",
    "keahlian": "Arsitektur Perangkat Lunak",
    "bebanSks": 19
  },
  {
    "id": 3,
    "inisial": "EP",
    "nama": "Ir. Eko Prasetyo, M.Eng., Ph.D.",
    "keahlian": "Jaringan Komputer & Cyber Security",
    "bebanSks": 19
  },
  {
    "id": 4,
    "inisial": "HQ",
    "nama": "Muhammad Abdul Haq, S.Tr.T., M.Eng. Ph.D.",
    "keahlian": "Kecerdasan Buatan & Data Science",
    "bebanSks": 24
  },
  {
    "id": 5,
    "inisial": "WS",
    "nama": "Winny Setyonugroho, S.Ked., MT., Ph.D",
    "keahlian": "Sistem Informasi Akademik",
    "bebanSks": 12
  },
  {
    "id": 6,
    "inisial": "HS",
    "nama": "Haris Setyawan, S.T., M.Eng.",
    "keahlian": "Pemrograman Bergerak & IoT",
    "bebanSks": 25
  },
  {
    "id": 7,
    "inisial": "AK",
    "nama": "Aprilia Kurnianti, ST. M. Eng.",
    "keahlian": "Basis Data Lanjut",
    "bebanSks": 16
  },
  {
    "id": 8,
    "inisial": "AG",
    "nama": "Dr. Nasy’an Taufiq Al Ghifari, S.T., M.T.",
    "keahlian": "Cloud Computing & DevOps",
    "bebanSks": 18
  },
  {
    "id": 9,
    "inisial": "RG",
    "nama": "Dr. Reza Giga Isnanda, S.T., M.Sc.",
    "keahlian": "UI/UX & Human Computer Interaction",
    "bebanSks": 18
  },
  {
    "id": 10,
    "inisial": "CO",
    "nama": "Chayadi Oktomy N S, S.T., M.Eng., Ph.D.",
    "keahlian": "Sistem Operasi & Tata Kelola",
    "bebanSks": 12
  },
  {
    "id": 11,
    "inisial": "QA",
    "nama": "Qodri Aziz, S.Kom., M.Eng",
    "keahlian": "Machine Learning & Web Service",
    "bebanSks": 19
  },
  {
    "id": 12,
    "inisial": "FF",
    "nama": "Muhammad Fadilah Alfarizy, B.Sc., M.Sc.",
    "keahlian": "Internet of Things",
    "bebanSks": 19
  },
  {
    "id": 13,
    "inisial": "NA",
    "nama": "Nurwahyu Alamsyah, S.Kom., M.Kom., M.IM., Ph.D",
    "keahlian": "Jaringan Nirkabel & Sensor",
    "bebanSks": 15
  },
  {
    "id": 14,
    "inisial": "AM",
    "nama": "Ahmad Musthafa Masyhur, S,Kom. PhD (Cand)",
    "keahlian": "Keamanan Jaringan",
    "bebanSks": 12
  },
  {
    "id": 15,
    "inisial": "AL",
    "nama": "Laila Ma’rifatul Azizah, S.Kom., M.I.M.",
    "keahlian": "Pemrosesan Bahasa Alami",
    "bebanSks": 6
  },
  {
    "id": 16,
    "inisial": "TA",
    "nama": "Tri Andi, S.T., M.Kom.",
    "keahlian": "Rekayasa Perangkat Lunak",
    "bebanSks": 21
  },
  {
    "id": 17,
    "inisial": "CD",
    "nama": "Cahya Damarjati, S.T. M. Eng., Ph.D.",
    "keahlian": "Interaksi Komputer Manusia",
    "bebanSks": 12
  },
  {
    "id": 18,
    "inisial": "EI",
    "nama": "Dr. Etik Irijanti, S.T., M.Sc.",
    "keahlian": "Technopreneurship & Inovasi",
    "bebanSks": 10
  },
  {
    "id": 19,
    "inisial": "SR",
    "nama": "Prof. Ir. Slamet Riyadi, S.T., M.Sc., Ph.D.",
    "keahlian": "Visi Komputer & Data",
    "bebanSks": 9
  },
  {
    "id": 20,
    "inisial": "AD",
    "nama": "Annisa Divayu Andriyani, S,Kom. PhD (Cand)",
    "keahlian": "Analisis & Desain Sistem",
    "bebanSks": 15
  },
  {
    "id": 21,
    "inisial": "TW",
    "nama": "Titis Wisnu Wijaya, S. Pd., M. Pd.",
    "keahlian": "Bahasa Inggris untuk TI",
    "bebanSks": 44
  }
];
const daftarRuangan = [
  {
    "id": 1,
    "kode": "F6.001",
    "nama": "Ruang Kuliah Besar F6.001",
    "gedung": "F6",
    "tipe": "Ruang Kuliah Besar",
    "kapasitas": 80
  },
  {
    "id": 2,
    "kode": "F6.002",
    "nama": "Ruang Teori F6.002",
    "gedung": "F6",
    "tipe": "Reguler",
    "kapasitas": 45
  },
  {
    "id": 3,
    "kode": "F6.003",
    "nama": "Ruang Teori F6.003",
    "gedung": "F6",
    "tipe": "Reguler",
    "kapasitas": 45
  },
  {
    "id": 4,
    "kode": "F6.004",
    "nama": "Ruang Teori F6.004",
    "gedung": "F6",
    "tipe": "Reguler",
    "kapasitas": 40
  },
  {
    "id": 5,
    "kode": "F6.101",
    "nama": "Ruang Kuliah F6.101",
    "gedung": "F6",
    "tipe": "Reguler",
    "kapasitas": 40
  },
  {
    "id": 6,
    "kode": "F6.102",
    "nama": "Ruang Kuliah F6.102",
    "gedung": "F6",
    "tipe": "Reguler",
    "kapasitas": 40
  },
  {
    "id": 7,
    "kode": "F6.103",
    "nama": "Ruang Kuliah F6.103",
    "gedung": "F6",
    "tipe": "Reguler",
    "kapasitas": 40
  },
  {
    "id": 8,
    "kode": "F6.202",
    "nama": "Ruang Kuliah F6.202",
    "gedung": "F6",
    "tipe": "Reguler",
    "kapasitas": 35
  },
  {
    "id": 9,
    "kode": "F6.203",
    "nama": "Ruang Kuliah F6.203",
    "gedung": "F6",
    "tipe": "Reguler",
    "kapasitas": 35
  },
  {
    "id": 10,
    "kode": "F4.001",
    "nama": "Laboratorium Komputer F4.001",
    "gedung": "F4",
    "tipe": "Laboratorium",
    "kapasitas": 40
  },
  {
    "id": 11,
    "kode": "F4.002",
    "nama": "Laboratorium Jaringan & Multimedia F4.002",
    "gedung": "F4",
    "tipe": "Laboratorium",
    "kapasitas": 40
  },
  {
    "id": 12,
    "kode": "F4.003",
    "nama": "Ruang Kuliah F4.003",
    "gedung": "F4",
    "tipe": "Reguler",
    "kapasitas": 40
  }
];
const kurikulumSemester = [
  {
    "semester": 1,
    "kode": "TI101",
    "nama": "Fisika dan Elektronika Teknologi Informasi",
    "sks": 2,
    "kategori": "Basic Science"
  },
  {
    "semester": 1,
    "kode": "TI102",
    "nama": "Matematika Teknologi Informasi 1",
    "sks": 3,
    "kategori": "Basic Science"
  },
  {
    "semester": 1,
    "kode": "TI103",
    "nama": "Dasar Teknologi Informasi",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 1,
    "kode": "TI104",
    "nama": "Logika Teknik Pemrograman",
    "sks": 2,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 1,
    "kode": "TI105",
    "nama": "Perancangan Basis Data",
    "sks": 2,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 1,
    "kode": "TI106",
    "nama": "Rekayasa Kebutuhan",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 1,
    "kode": "MKWU06",
    "nama": "Pancasila",
    "sks": 2,
    "kategori": "General Education"
  },
  {
    "semester": 1,
    "kode": "MKWU01",
    "nama": "Al-Islam dan Kemuhammadiyahan 1 (Kemanusiaan dan Keimanan)",
    "sks": 2,
    "kategori": "General Education"
  },
  {
    "semester": 1,
    "kode": "TI109",
    "nama": "Bahasa Inggris Dasar",
    "sks": 1,
    "kategori": "General Education"
  },
  {
    "semester": 2,
    "kode": "TI201",
    "nama": "Matematika Teknologi Informasi 2",
    "sks": 3,
    "kategori": "Basic Science"
  },
  {
    "semester": 2,
    "kode": "TI202",
    "nama": "Algoritma dan Struktur Data",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 2,
    "kode": "TI203",
    "nama": "Pemrograman Dasar",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 2,
    "kode": "TI204",
    "nama": "Administrasi Basis Data",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 2,
    "kode": "TI205",
    "nama": "Dasar Jaringan",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 2,
    "kode": "MKWU07",
    "nama": "Kewarganegaraan",
    "sks": 2,
    "kategori": "General Education"
  },
  {
    "semester": 2,
    "kode": "MKWU02",
    "nama": "Al-Islam dan Kemuhammadiyahan 2 (Ibadah dan Muamalah)",
    "sks": 2,
    "kategori": "General Education"
  },
  {
    "semester": 2,
    "kode": "TI208",
    "nama": "Bahasa Inggris Menengah",
    "sks": 1,
    "kategori": "General Education"
  },
  {
    "semester": 3,
    "kode": "TI301",
    "nama": "Probabilitas dan Statistika",
    "sks": 3,
    "kategori": "Basic Science"
  },
  {
    "semester": 3,
    "kode": "TI302",
    "nama": "Pemrograman Multiplatform",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 3,
    "kode": "TI303",
    "nama": "Implementasi Basis Data",
    "sks": 3,
    "kategori": "Teknologi Informasi",
    "jenis": "Praktikum"
  },
  {
    "semester": 3,
    "kode": "TI304",
    "nama": "Switching dan Wireless",
    "sks": 3,
    "kategori": "Teknologi Informasi",
    "jenis": "Praktikum"
  },
  {
    "semester": 3,
    "kode": "TI305",
    "nama": "Teknologi Server",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 3,
    "kode": "TI306",
    "nama": "Perancangan Berorientasi Objek",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 3,
    "kode": "MKWU03",
    "nama": "Al-Islam dan Kemuhammadiyahan 3 (Kemuhammadiyahan)",
    "sks": 2,
    "kategori": "General Education"
  },
  {
    "semester": 3,
    "kode": "TI308",
    "nama": "Bahasa Inggris Lanjut",
    "sks": 1,
    "kategori": "General Education"
  },
  {
    "semester": 4,
    "kode": "TI401",
    "nama": "Pengembangan Desain Web",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 4,
    "kode": "TI402",
    "nama": "Pengembangan Aplikasi Basis Data",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 4,
    "kode": "TI403",
    "nama": "Routing dan Keamanan Jaringan",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 4,
    "kode": "TI404",
    "nama": "Keamanan Siber",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 4,
    "kode": "TI405",
    "nama": "Interaksi Manusia Komputer",
    "sks": 2,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 4,
    "kode": "TI406",
    "nama": "Pengujian dan Penjaminan Mutu Perangkat Lunak",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 4,
    "kode": "MKWU04",
    "nama": "Al-Islam dan Kemuhammadiyahan 4 (Islam dan Ilmu Pengetahuan)",
    "sks": 2,
    "kategori": "General Education"
  },
  {
    "semester": 4,
    "kode": "TI408",
    "nama": "Bahasa Inggris untuk Profesional Bidang Teknologi Informasi",
    "sks": 1,
    "kategori": "General Education"
  },
  {
    "semester": 4,
    "kode": "TI409",
    "nama": "Praktik Profesional",
    "sks": 2,
    "kategori": "General Education"
  },
  {
    "semester": 5,
    "kode": "TI501",
    "nama": "Pengembangan Aplikasi Web",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 5,
    "kode": "TI502",
    "nama": "Pengembangan Aplikasi Mobile",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 5,
    "kode": "TI503",
    "nama": "Pengembangan Web Service",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 5,
    "kode": "TI504",
    "nama": "WAN dan Teknologi Jaringan",
    "sks": 2,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 5,
    "kode": "TI505",
    "nama": "Tata Kelola Teknologi Informasi",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 5,
    "kode": "TI506",
    "nama": "Manajemen Proyek",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 5,
    "kode": "TI507",
    "nama": "Bahasa Inggris untuk Membaca Naskah Akademik",
    "sks": 1,
    "kategori": "General Education"
  },
  {
    "semester": 5,
    "kode": "TI508",
    "nama": "Technopreneurship",
    "sks": 2,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 6,
    "kode": "TI601",
    "nama": "Capstone Project 1 (Analisis dan Perancangan)",
    "sks": 3,
    "kategori": "Capstone"
  },
  {
    "semester": 6,
    "kode": "TI602",
    "nama": "Kerja Praktek/Magang",
    "sks": 2,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 6,
    "kode": "TI603",
    "nama": "Deployment Perangkat Lunak",
    "sks": 3,
    "kategori": "Teknologi Informasi"
  },
  {
    "semester": 6,
    "kode": "TI604",
    "nama": "Metode Penelitian",
    "sks": 2,
    "kategori": "General Education"
  },
  {
    "semester": 6,
    "kode": "TI605",
    "nama": "Persiapan TOEFL",
    "sks": 1,
    "kategori": "General Education"
  },
  {
    "semester": 6,
    "kode": "TIxxx-1",
    "nama": "Mata Kuliah Pilihan 1",
    "sks": 3,
    "kategori": "Pilihan"
  },
  {
    "semester": 6,
    "kode": "TIxxx-2",
    "nama": "Mata Kuliah Pilihan 2",
    "sks": 3,
    "kategori": "Pilihan"
  },
  {
    "semester": 6,
    "kode": "TIxxx-3",
    "nama": "Mata Kuliah Pilihan 3",
    "sks": 3,
    "kategori": "Pilihan"
  },
  {
    "semester": 7,
    "kode": "TI701",
    "nama": "Capstone Project 2 (Implementasi dan Pengujian)",
    "sks": 3,
    "kategori": "Capstone"
  },
  {
    "semester": 7,
    "kode": "TI702",
    "nama": "Kuliah Kerja Nyata",
    "sks": 3,
    "kategori": "General Education"
  },
  {
    "semester": 7,
    "kode": "MKWU05",
    "nama": "Bahasa Indonesia dan Penulisan Ilmiah",
    "sks": 2,
    "kategori": "General Education"
  },
  {
    "semester": 7,
    "kode": "TI704",
    "nama": "Bahasa Inggris untuk Penulisan Naskah Akademik",
    "sks": 1,
    "kategori": "General Education"
  },
  {
    "semester": 7,
    "kode": "TIxxx-4",
    "nama": "Mata Kuliah Pilihan 4",
    "sks": 3,
    "kategori": "Pilihan"
  },
  {
    "semester": 7,
    "kode": "TIxxx-5",
    "nama": "Mata Kuliah Pilihan 5",
    "sks": 3,
    "kategori": "Pilihan"
  },
  {
    "semester": 8,
    "kode": "TI801",
    "nama": "Tugas Akhir",
    "sks": 6,
    "kategori": "Tugas Akhir"
  }
];
const matkulPeminatan = [
  {
    "kode": "TISE01",
    "nama": "Pengembangan Game",
    "sks": 3,
    "semesterPenawaran": "Ganjil",
    "kodePeminatan": "SE",
    "peminatan": "Software Engineering",
    "jenis": "Teori"
  },
  {
    "kode": "TISE02",
    "nama": "Teknologi Multimedia",
    "sks": 3,
    "semesterPenawaran": "Ganjil",
    "kodePeminatan": "SE",
    "peminatan": "Software Engineering",
    "jenis": "Teori"
  },
  {
    "kode": "TINS01",
    "nama": "Blockchain",
    "sks": 3,
    "semesterPenawaran": "Ganjil",
    "kodePeminatan": "NS",
    "peminatan": "Network & Cyber Security",
    "jenis": "Teori"
  },
  {
    "kode": "TINS02",
    "nama": "CyberOps",
    "sks": 3,
    "semesterPenawaran": "Ganjil",
    "kodePeminatan": "NS",
    "peminatan": "Network & Cyber Security",
    "jenis": "Teori"
  },
  {
    "kode": "TISE03",
    "nama": "Pemrograman Web Framework",
    "sks": 3,
    "semesterPenawaran": "Genap",
    "kodePeminatan": "SE",
    "peminatan": "Software Engineering",
    "jenis": "Teori"
  },
  {
    "kode": "TISE04",
    "nama": "Pengembangan Aplikasi Mobile Lanjut",
    "sks": 3,
    "semesterPenawaran": "Genap",
    "kodePeminatan": "SE",
    "peminatan": "Software Engineering",
    "jenis": "Teori"
  },
  {
    "kode": "TISE05",
    "nama": "Pemrograman Internet of Things",
    "sks": 3,
    "semesterPenawaran": "Genap",
    "kodePeminatan": "SE",
    "peminatan": "Software Engineering",
    "jenis": "Teori"
  },
  {
    "kode": "TINS03",
    "nama": "Core Network",
    "sks": 3,
    "semesterPenawaran": "Genap",
    "kodePeminatan": "NS",
    "peminatan": "Network & Cyber Security",
    "jenis": "Teori"
  },
  {
    "kode": "TINS04",
    "nama": "Programmable Infrastructure",
    "sks": 3,
    "semesterPenawaran": "Genap",
    "kodePeminatan": "NS",
    "peminatan": "Network & Cyber Security",
    "jenis": "Teori"
  },
  {
    "kode": "TINS05",
    "nama": "Routing Lanjut",
    "sks": 3,
    "semesterPenawaran": "Genap",
    "kodePeminatan": "NS",
    "peminatan": "Network & Cyber Security",
    "jenis": "Teori"
  }
];

const daftarMahasiswa = [
  { id: 1, nim: '20240140001', nama: 'Andi Pratama', angkatan: 2024, semesterAktif: 4, kodePeminatan: 'PR' },
  { id: 2, nim: '20240140089', nama: 'Bima Eka Setiawan', angkatan: 2024, semesterAktif: 4, kodePeminatan: 'DA' },
  { id: 3, nim: '20240140056', nama: 'Nur Rizqi Febriansyah Putra', angkatan: 2024, semesterAktif: 4, kodePeminatan: 'NE' },
  { id: 4, nim: '20240140091', nama: 'Resya Glamoda Suhendri', angkatan: 2024, semesterAktif: 4, kodePeminatan: 'UX' },
  { id: 5, nim: '20240140075', nama: 'Nisrina Hanifah Ramadhani', angkatan: 2024, semesterAktif: 4, kodePeminatan: 'PR' },
  { id: 6, nim: '20240140093', nama: 'Haidar Yahya Mudhofar', angkatan: 2024, semesterAktif: 4, kodePeminatan: 'UX' },
  { id: 7, nim: '20240140133', nama: 'A. Muh. Fadil Asytar', angkatan: 2024, semesterAktif: 4, kodePeminatan: 'DA' }
];

const MasterModel = {
  getDosen() {
    return daftarDosen;
  },
  getRuangan() {
    return daftarRuangan;
  },
  getKurikulum(semester = null) {
    if (!semester) return kurikulumSemester;
    return kurikulumSemester.filter(k => k.semester === Number(semester));
  },
  getPeminatan(kodePeminatan = null) {
    if (!kodePeminatan) return matkulPeminatan;
    return matkulPeminatan.filter(p => p.kodePeminatan.toUpperCase() === String(kodePeminatan).toUpperCase());
  },
  getMataKuliah() {
    const list = [...kurikulumSemester];
    matkulPeminatan.forEach(p => {
      if (!list.some(m => m.kode === p.kode)) {
        list.push({
          semester: p.semesterPenawaran === 'Ganjil' ? 5 : 6,
          kode: p.kode,
          nama: p.nama,
          sks: p.sks,
          kategori: 'Pilihan (' + p.peminatan + ')',
          kodePeminatan: p.kodePeminatan
        });
      }
    });
    return list;
  },
  getMatkulForMahasiswa(semester = 5, kodePeminatan = 'SE') {
    const sem = Number(semester);
    const mkList = kurikulumSemester.filter(k => k.semester === sem);
    const resolved = [];
    const pilihanPeminatan = matkulPeminatan.filter(p => !kodePeminatan || p.kodePeminatan.toUpperCase() === String(kodePeminatan).toUpperCase());

    let pilIdx = 0;
    for (const mk of mkList) {
      const aliasJadwal = mk.kode.replace(/^TI10([1-9])$/, 'TI2610$1');
      if (mk.kode.startsWith('TIxxx')) {
        const pick = pilihanPeminatan[pilIdx % pilihanPeminatan.length];
        pilIdx++;
        if (pick) {
          resolved.push({
            ...mk,
            kodeAsli: mk.kode,
            kode: pick.kode,
            kodeJadwal: pick.kode,
            nama: pick.nama,
            peminatan: pick.peminatan,
            isPilihan: true
          });
        } else {
          resolved.push({ ...mk, kodeJadwal: mk.kode });
        }
      } else {
        resolved.push({
          ...mk,
          kodeJadwal: aliasJadwal,
          isMkwu: mk.kode.startsWith('MKWU')
        });
      }
    }
    return resolved;
  },
  addDosen({ inisial, nidn, nama, keahlian, bebanSks }) {
    const item = {
      id: daftarDosen.length > 0 ? Math.max(...daftarDosen.map(d => d.id)) + 1 : 1,
      inisial: (inisial || 'TI').toUpperCase(),
      nidn: nidn || String(Date.now()).slice(-10),
      nama,
      keahlian: keahlian || 'Teknologi Informasi',
      bebanSks: Number(bebanSks) || 8
    };
    daftarDosen.push(item);
    return item;
  },
  updateDosen(id, { inisial, nidn, nama, keahlian, bebanSks }) {
    const idx = daftarDosen.findIndex(d => d.id === Number(id));
    if (idx === -1) return null;
    if (inisial !== undefined) daftarDosen[idx].inisial = inisial.toUpperCase();
    if (nidn !== undefined) daftarDosen[idx].nidn = nidn;
    if (nama !== undefined) daftarDosen[idx].nama = nama;
    if (keahlian !== undefined) daftarDosen[idx].keahlian = keahlian;
    if (bebanSks !== undefined) daftarDosen[idx].bebanSks = Number(bebanSks);
    return daftarDosen[idx];
  },
  deleteDosen(id) {
    const idx = daftarDosen.findIndex(d => d.id === Number(id));
    if (idx === -1) return false;
    daftarDosen.splice(idx, 1);
    return true;
  },
  addMataKuliah({ kode, nama, sks, semester, kategori }) {
    const item = {
      semester: Number(semester),
      kode: kode.toUpperCase(),
      nama,
      sks: Number(sks),
      kategori: kategori || 'Teknologi Informasi'
    };
    kurikulumSemester.push(item);
    return item;
  },
  addRuangan({ kode, nama, kapasitas, gedung, tipe }) {
    const item = {
      id: daftarRuangan.length + 1,
      kode,
      nama: nama || ('Ruang ' + kode),
      gedung: gedung || (kode.startsWith('F6') ? 'F6' : 'F4'),
      tipe: tipe || 'Reguler',
      kapasitas: Number(kapasitas) || 40
    };
    daftarRuangan.push(item);
    return item;
  },
  updateRuangan(id, { kode, nama, kapasitas, gedung, tipe }) {
    const idx = daftarRuangan.findIndex(r => r.id === Number(id) || r.kode === String(id));
    if (idx === -1) return null;
    if (kode) daftarRuangan[idx].kode = kode;
    if (nama) daftarRuangan[idx].nama = nama;
    if (kapasitas) daftarRuangan[idx].kapasitas = Number(kapasitas);
    if (gedung) daftarRuangan[idx].gedung = gedung;
    if (tipe) daftarRuangan[idx].tipe = tipe;
    return daftarRuangan[idx];
  },
  deleteRuangan(id) {
    const idx = daftarRuangan.findIndex(r => r.id === Number(id) || r.kode === String(id));
    if (idx === -1) return false;
    daftarRuangan.splice(idx, 1);
    return true;
  },
  updateMataKuliah(kode, { nama, sks, semester, kategori, jenis }) {
    const targetKode = String(kode).toUpperCase();
    const idx = kurikulumSemester.findIndex(k => k.kode.toUpperCase() === targetKode);
    if (idx !== -1) {
      if (nama) kurikulumSemester[idx].nama = nama;
      if (sks) kurikulumSemester[idx].sks = Number(sks);
      if (semester) kurikulumSemester[idx].semester = Number(semester);
      if (kategori) kurikulumSemester[idx].kategori = kategori;
      if (jenis) kurikulumSemester[idx].jenis = jenis;
      return kurikulumSemester[idx];
    }
    const pemIdx = matkulPeminatan.findIndex(p => p.kode.toUpperCase() === targetKode);
    if (pemIdx !== -1) {
      if (nama) matkulPeminatan[pemIdx].nama = nama;
      if (sks) matkulPeminatan[pemIdx].sks = Number(sks);
      if (jenis) matkulPeminatan[pemIdx].jenis = jenis;
      return matkulPeminatan[pemIdx];
    }
    return null;
  },
  deleteMataKuliah(kode) {
    const targetKode = String(kode).toUpperCase();
    const idx = kurikulumSemester.findIndex(k => k.kode.toUpperCase() === targetKode);
    if (idx !== -1) {
      kurikulumSemester.splice(idx, 1);
      return true;
    }
    const pemIdx = matkulPeminatan.findIndex(p => p.kode.toUpperCase() === targetKode);
    if (pemIdx !== -1) {
      matkulPeminatan.splice(pemIdx, 1);
      return true;
    }
    return false;
  },
  getMahasiswa() {
    return daftarMahasiswa;
  },
  addMahasiswa({ nim, nama, angkatan, semesterAktif, kodePeminatan }) {
    const item = {
      id: daftarMahasiswa.length + 1,
      nim: String(nim),
      nama,
      angkatan: Number(angkatan) || 2024,
      semesterAktif: Number(semesterAktif) || 1,
      kodePeminatan: kodePeminatan || null
    };
    daftarMahasiswa.push(item);
    return item;
  },
  updateMahasiswa(id, { nim, nama, angkatan, semesterAktif, kodePeminatan }) {
    const idx = daftarMahasiswa.findIndex(m => m.id === Number(id) || m.nim === String(id));
    if (idx === -1) return null;
    if (nim) daftarMahasiswa[idx].nim = String(nim);
    if (nama) daftarMahasiswa[idx].nama = nama;
    if (angkatan) daftarMahasiswa[idx].angkatan = Number(angkatan);
    if (semesterAktif) daftarMahasiswa[idx].semesterAktif = Number(semesterAktif);
    if (kodePeminatan !== undefined) daftarMahasiswa[idx].kodePeminatan = kodePeminatan;
    return daftarMahasiswa[idx];
  },
  deleteMahasiswa(id) {
    const idx = daftarMahasiswa.findIndex(m => m.id === Number(id) || m.nim === String(id));
    if (idx === -1) return false;
    daftarMahasiswa.splice(idx, 1);
    return true;
  },
  getSummary() {
    return {
      totalDosen: daftarDosen.length,
      totalMatkul: kurikulumSemester.length,
      totalPeminatan: matkulPeminatan.length,
      totalRuangan: daftarRuangan.length,
      totalMahasiswa: daftarMahasiswa.length,
      ruangF6: daftarRuangan.filter(r => r.gedung === 'F6').length,
      ruangF4: daftarRuangan.filter(r => r.gedung === 'F4').length
    };
  }
};

module.exports = MasterModel;
