const { getBaseData, config } = require('./baseDataHelper');

/**
 * Controller untuk Portal Panel Dosen
 */
exports.dashboard = (req, res) => {
  res.render('dosen/dashboard', {
    ...getBaseData(),
    judul: `Portal Dosen — ${config.appName}`,
    currentRole: 'dosen',
    activeMenu: 'dashboard',
    activeView: 'view-dosen'
  });
};

exports.jadwal = (req, res) => {
  res.render('dosen/jadwal', {
    ...getBaseData(),
    judul: `Jadwal Mengajar Dosen — ${config.appName}`,
    currentRole: 'dosen',
    activeMenu: 'jadwal',
    activeView: 'view-dosen'
  });
};

exports.preferensi = (req, res) => {
  res.render('dosen/preferensi', {
    ...getBaseData(),
    judul: `Formulir Preferensi Waktu Dosen — ${config.appName}`,
    currentRole: 'dosen',
    activeMenu: 'preferensi',
    activeView: 'view-dosen'
  });
};

exports.notifikasi = (req, res) => {
  res.render('dosen/notifikasi', {
    ...getBaseData(),
    judul: `Pusat Notifikasi Dosen — ${config.appName}`,
    currentRole: 'dosen',
    activeMenu: 'notifikasi',
    activeView: 'view-dosen'
  });
};
