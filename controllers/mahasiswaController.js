const { getBaseData, config } = require('./baseDataHelper');

/**
 * Controller untuk Portal Panel Mahasiswa
 */
exports.dashboard = async (req, res, next) => {
  try {
    res.render('mahasiswa/dashboard', {
      ...(await getBaseData(req.user)),
      judul: `Dashboard Mahasiswa — ${config.appName}`,
      currentRole: 'mahasiswa',
      activeMenu: 'dashboard',
      activeView: 'view-mahasiswa'
    });
  } catch (err) {
    next(err);
  }
};

exports.jadwal = async (req, res, next) => {
  try {
    res.render('mahasiswa/jadwal', {
      ...(await getBaseData(req.user)),
      judul: `Jadwal Perkuliahan Lengkap — ${config.appName}`,
      currentRole: 'mahasiswa',
      activeMenu: 'jadwal',
      activeView: 'view-mahasiswa'
    });
  } catch (err) {
    next(err);
  }
};

exports.prakrs = async (req, res, next) => {
  try {
    res.render('mahasiswa/prakrs', {
      ...(await getBaseData(req.user)),
      judul: `Onboarding & Wizard Pra-KRS — ${config.appName}`,
      currentRole: 'mahasiswa',
      activeMenu: 'prakrs',
      activeView: 'view-mahasiswa'
    });
  } catch (err) {
    next(err);
  }
};

exports.notifikasi = async (req, res, next) => {
  try {
    res.render('mahasiswa/notifikasi', {
      ...(await getBaseData(req.user)),
      judul: `Pusat Notifikasi Mahasiswa — ${config.appName}`,
      currentRole: 'mahasiswa',
      activeMenu: 'notifikasi',
      activeView: 'view-mahasiswa'
    });
  } catch (err) {
    next(err);
  }
};
