const { getBaseData, config } = require('./baseDataHelper');

/**
 * Controller untuk Portal Panel Mahasiswa
 */
exports.dashboard = (req, res) => {
  res.render('mahasiswa/dashboard', {
    ...getBaseData(),
    judul: `Dashboard Mahasiswa — ${config.appName}`,
    currentRole: 'mahasiswa',
    activeMenu: 'dashboard',
    activeView: 'view-mahasiswa'
  });
};

exports.jadwal = (req, res) => {
  res.render('mahasiswa/jadwal', {
    ...getBaseData(),
    judul: `Jadwal Perkuliahan Lengkap — ${config.appName}`,
    currentRole: 'mahasiswa',
    activeMenu: 'jadwal',
    activeView: 'view-mahasiswa'
  });
};

exports.prakrs = (req, res) => {
  res.render('mahasiswa/prakrs', {
    ...getBaseData(),
    judul: `Onboarding & Wizard Pra-KRS — ${config.appName}`,
    currentRole: 'mahasiswa',
    activeMenu: 'prakrs',
    activeView: 'view-mahasiswa'
  });
};

exports.notifikasi = (req, res) => {
  res.render('mahasiswa/notifikasi', {
    ...getBaseData(),
    judul: `Pusat Notifikasi Mahasiswa — ${config.appName}`,
    currentRole: 'mahasiswa',
    activeMenu: 'notifikasi',
    activeView: 'view-mahasiswa'
  });
};
