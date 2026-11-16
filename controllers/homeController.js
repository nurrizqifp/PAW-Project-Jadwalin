const MasterModel = require('../models/masterModel');
const JadwalModel = require('../models/jadwalModel');
const ConstraintModel = require('../models/constraintModel');
const ProdukModel = require('../models/produkModel');
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
  const produk = ProdukModel.getAll();

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
    constraints,
    produk
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
  res.render('index', {
    ...getBaseData(),
    judul: `Masuk Sistem — ${config.appName}`,
    showLoginModal: true,
    currentRole: 'guest'
  });
};

// --------------------------------------------------------
// 2. MAHASISWA ROUTES
// --------------------------------------------------------
exports.mahasiswaDashboard = (req, res) => {
  res.render('index', {
    ...getBaseData(),
    judul: `Dashboard Mahasiswa — ${config.appName}`,
    currentRole: 'mahasiswa',
    activeView: 'view-mahasiswa'
  });
};

exports.mahasiswaJadwal = (req, res) => {
  res.render('index', {
    ...getBaseData(),
    judul: `Jadwal Perkuliahan Lengkap — ${config.appName}`,
    currentRole: 'mahasiswa',
    activeView: 'view-mahasiswa',
    subSection: 'jadwal-lengkap'
  });
};

exports.mahasiswaPrakrs = (req, res) => {
  res.render('index', {
    ...getBaseData(),
    judul: `Onboarding & Wizard Pra-KRS — ${config.appName}`,
    currentRole: 'mahasiswa',
    activeView: 'view-mahasiswa',
    subSection: 'prakrs'
  });
};

exports.mahasiswaNotifikasi = (req, res) => {
  res.render('index', {
    ...getBaseData(),
    judul: `Pusat Notifikasi Mahasiswa — ${config.appName}`,
    currentRole: 'mahasiswa',
    activeView: 'view-mahasiswa',
    openNotifDrawer: true
  });
};

// --------------------------------------------------------
// 3. DOSEN ROUTES
// --------------------------------------------------------
exports.dosenDashboard = (req, res) => {
  res.render('index', {
    ...getBaseData(),
    judul: `Portal Dosen — ${config.appName}`,
    currentRole: 'dosen',
    activeView: 'view-dosen'
  });
};

exports.dosenJadwal = (req, res) => {
  res.render('index', {
    ...getBaseData(),
    judul: `Jadwal Mengajar Dosen — ${config.appName}`,
    currentRole: 'dosen',
    activeView: 'view-dosen',
    subSection: 'jadwal'
  });
};

exports.dosenPreferensi = (req, res) => {
  res.render('index', {
    ...getBaseData(),
    judul: `Formulir Preferensi Waktu Dosen — ${config.appName}`,
    currentRole: 'dosen',
    activeView: 'view-dosen',
    subSection: 'preferensi'
  });
};

// --------------------------------------------------------
// 4. ADMIN ROUTES
// --------------------------------------------------------
exports.adminDashboard = (req, res) => {
  res.render('index', {
    ...getBaseData(),
    judul: `Panel Administrasi Akademik — ${config.appName}`,
    currentRole: 'admin',
    activeView: 'view-akademik',
    activeMenu: 'dashboard'
  });
};

exports.adminMasterDosen = (req, res) => {
  res.render('index', {
    ...getBaseData(),
    judul: `Master Data Dosen — ${config.appName}`,
    currentRole: 'admin',
    activeView: 'view-akademik',
    activeMenu: 'dosen',
    subSection: 'master-dosen'
  });
};

exports.adminMasterMatkul = (req, res) => {
  res.render('index', {
    ...getBaseData(),
    judul: `Master Data Mata Kuliah — ${config.appName}`,
    currentRole: 'admin',
    activeView: 'view-akademik',
    activeMenu: 'matkul',
    subSection: 'master-matkul'
  });
};

exports.adminMasterRuangan = (req, res) => {
  res.render('index', {
    ...getBaseData(),
    judul: `Master Data Ruangan & Laboratorium — ${config.appName}`,
    currentRole: 'admin',
    activeView: 'view-akademik',
    activeMenu: 'ruangan',
    subSection: 'master-ruangan'
  });
};

exports.adminMasterMahasiswa = (req, res) => {
  res.render('index', {
    ...getBaseData(),
    judul: `Master Data Mahasiswa — ${config.appName}`,
    currentRole: 'admin',
    activeView: 'view-akademik',
    activeMenu: 'mahasiswa',
    subSection: 'master-mahasiswa'
  });
};

exports.adminConstraints = (req, res) => {
  res.render('index', {
    ...getBaseData(),
    judul: `Manajemen Constraints & Preferensi — ${config.appName}`,
    currentRole: 'admin',
    activeView: 'view-akademik',
    activeMenu: 'constraints',
    subSection: 'constraints'
  });
};

exports.adminGenerate = (req, res) => {
  res.render('index', {
    ...getBaseData(),
    judul: `AI Generator Jadwal — ${config.appName}`,
    currentRole: 'admin',
    activeView: 'view-akademik',
    activeMenu: 'generate',
    subSection: 'generate'
  });
};

exports.adminJadwal = (req, res) => {
  res.render('index', {
    ...getBaseData(),
    judul: `Preview & Publikasi Jadwal — ${config.appName}`,
    currentRole: 'admin',
    activeView: 'view-akademik',
    activeMenu: 'jadwal',
    subSection: 'jadwal'
  });
};
