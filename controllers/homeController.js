const MasterModel = require('../models/masterModel');
const JadwalModel = require('../models/jadwalModel');
const ConstraintModel = require('../models/constraintModel');
const config = require('../config');

// Helper untuk mengambil seluruh dataset dasar
function getBaseData() {
  const jadwal = JadwalModel.getAll();
  const jadwalStatus = JadwalModel.getStatus();
  const notifikasiList = JadwalModel.getNotifikasi();
  const masterSummary = MasterModel.getSummary();
  const dosenList = MasterModel.getDosen();
  const ruanganList = MasterModel.getRuangan();
  const kurikulumList = MasterModel.getKurikulum();
  const peminatanList = MasterModel.getPeminatan();
  const constraints = ConstraintModel.getAll();

  const defaultMahasiswaMatkul = MasterModel.getMatkulForMahasiswa(5, 'PR');
  const defaultPrakrs = JadwalModel.rekomendasiPraKrs({
    kodeMatkulList: defaultMahasiswaMatkul.map(m => m.kode),
    prefKelas: 'B',
    prefHari: 'Semua',
    prefWaktu: 'Semua',
    variasiIndex: 0
  });

  return {
    appName: config.appName,
    appVersion: config.appVersion,
    jadwal,
    jadwalStatus,
    notifikasiList,
    masterSummary,
    dosenList,
    ruanganList,
    kurikulumList,
    peminatanList,
    defaultMahasiswaMatkul,
    defaultPrakrs,
    constraints
  };
}

// --------------------------------------------------------
// 1. PUBLIC & AUTHENTICATION
// --------------------------------------------------------
exports.index = (req, res) => {
  const data = getBaseData();
  res.render('index', {
    ...data,
    judul: `${config.appName} — AI Powered Smart Course Scheduling TI UMY`,
    currentRole: 'mahasiswa',
    activeView: 'view-mahasiswa'
  });
};

exports.login = (req, res) => {
  res.render('auth/login', {
    ...getBaseData(),
    judul: `Masuk Sistem — ${config.appName}`,
    currentRole: 'guest'
  });
};

exports.forgotPassword = (req, res) => {
  res.render('auth/forgot-password', {
    ...getBaseData(),
    judul: `Lupa Kata Sandi — ${config.appName}`,
    currentRole: 'guest'
  });
};

// --------------------------------------------------------
// 2. MAHASISWA ROUTES
// --------------------------------------------------------
exports.mahasiswaDashboard = (req, res) => {
  res.render('mahasiswa/dashboard', {
    ...getBaseData(),
    judul: `Dashboard Mahasiswa — ${config.appName}`,
    currentRole: 'mahasiswa',
    activeMenu: 'dashboard',
    activeView: 'view-mahasiswa'
  });
};

exports.mahasiswaJadwal = (req, res) => {
  res.render('mahasiswa/jadwal', {
    ...getBaseData(),
    judul: `Jadwal Perkuliahan Lengkap — ${config.appName}`,
    currentRole: 'mahasiswa',
    activeMenu: 'jadwal',
    activeView: 'view-mahasiswa'
  });
};

exports.mahasiswaPrakrs = (req, res) => {
  res.render('mahasiswa/prakrs', {
    ...getBaseData(),
    judul: `Onboarding & Wizard Pra-KRS — ${config.appName}`,
    currentRole: 'mahasiswa',
    activeMenu: 'prakrs',
    activeView: 'view-mahasiswa'
  });
};

exports.mahasiswaNotifikasi = (req, res) => {
  res.render('mahasiswa/notifikasi', {
    ...getBaseData(),
    judul: `Pusat Notifikasi Mahasiswa — ${config.appName}`,
    currentRole: 'mahasiswa',
    activeMenu: 'notifikasi',
    activeView: 'view-mahasiswa'
  });
};

// --------------------------------------------------------
// 3. DOSEN ROUTES
// --------------------------------------------------------
exports.dosenDashboard = (req, res) => {
  res.render('dosen/dashboard', {
    ...getBaseData(),
    judul: `Portal Dosen — ${config.appName}`,
    currentRole: 'dosen',
    activeMenu: 'dashboard',
    activeView: 'view-dosen'
  });
};

exports.dosenJadwal = (req, res) => {
  res.render('dosen/jadwal', {
    ...getBaseData(),
    judul: `Jadwal Mengajar Dosen — ${config.appName}`,
    currentRole: 'dosen',
    activeMenu: 'jadwal',
    activeView: 'view-dosen'
  });
};

exports.dosenPreferensi = (req, res) => {
  res.render('dosen/preferensi', {
    ...getBaseData(),
    judul: `Formulir Preferensi Waktu Dosen — ${config.appName}`,
    currentRole: 'dosen',
    activeMenu: 'preferensi',
    activeView: 'view-dosen'
  });
};

exports.dosenNotifikasi = (req, res) => {
  res.render('dosen/notifikasi', {
    ...getBaseData(),
    judul: `Pusat Notifikasi Dosen — ${config.appName}`,
    currentRole: 'dosen',
    activeMenu: 'notifikasi',
    activeView: 'view-dosen'
  });
};

// --------------------------------------------------------
// 4. ADMIN ROUTES
// --------------------------------------------------------
exports.adminDashboard = (req, res) => {
  res.render('admin/dashboard', {
    ...getBaseData(),
    judul: `Panel Administrasi Akademik — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'dashboard'
  });
};

exports.adminMasterDosen = (req, res) => {
  res.render('admin/master/dosen', {
    ...getBaseData(),
    judul: `Master Data Dosen — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'dosen'
  });
};

exports.adminMasterMatkul = (req, res) => {
  res.render('admin/master/matkul', {
    ...getBaseData(),
    judul: `Master Data Mata Kuliah — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'matkul'
  });
};

exports.adminMasterRuangan = (req, res) => {
  res.render('admin/master/ruangan', {
    ...getBaseData(),
    judul: `Master Data Ruangan & Laboratorium — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'ruangan'
  });
};

exports.adminMasterMahasiswa = (req, res) => {
  res.render('admin/master/mahasiswa', {
    ...getBaseData(),
    judul: `Master Data Mahasiswa — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'mahasiswa'
  });
};

exports.adminConstraints = (req, res) => {
  res.render('admin/constraints/hard', {
    ...getBaseData(),
    judul: `Manajemen Hard Constraints — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'constraints'
  });
};

exports.adminConstraintsSoft = (req, res) => {
  res.render('admin/constraints/soft', {
    ...getBaseData(),
    judul: `Manajemen Soft Constraints — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'constraints'
  });
};

exports.adminGenerate = (req, res) => {
  res.render('admin/generate', {
    ...getBaseData(),
    judul: `AI Generator Jadwal — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'generate'
  });
};

exports.adminJadwal = (req, res) => {
  res.render('admin/jadwal', {
    ...getBaseData(),
    judul: `Preview & Publikasi Jadwal — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'jadwal'
  });
};

exports.adminProfil = (req, res) => {
  res.render('admin/profil', {
    ...getBaseData(),
    judul: `Profil Pengelola Akademik — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'profil'
  });
};

exports.adminSettings = (req, res) => {
  res.render('admin/settings', {
    ...getBaseData(),
    judul: `Pengaturan Sistem — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'settings'
  });
};

exports.adminPeriode = (req, res) => {
  res.render('admin/master/periode', {
    ...getBaseData(),
    judul: `Manajemen Periode & Semester — ${config.appName}`,
    currentRole: 'admin',
    activeMenu: 'periode'
  });
};
