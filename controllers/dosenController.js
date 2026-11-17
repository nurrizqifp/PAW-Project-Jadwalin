const { getBaseData, config } = require('./baseDataHelper');

/**
 * Controller untuk Portal Panel Dosen
 */
exports.dashboard = async (req, res, next) => {
  try {
    res.render('dosen/dashboard', {
      ...(await getBaseData(req.user)),
      judul: `Portal Dosen — ${config.appName}`,
      currentRole: 'dosen',
      activeMenu: 'dashboard',
      activeView: 'view-dosen'
    });
  } catch (err) {
    next(err);
  }
};

exports.jadwal = async (req, res, next) => {
  try {
    res.render('dosen/jadwal', {
      ...(await getBaseData(req.user)),
      judul: `Jadwal Mengajar Dosen — ${config.appName}`,
      currentRole: 'dosen',
      activeMenu: 'jadwal',
      activeView: 'view-dosen'
    });
  } catch (err) {
    next(err);
  }
};

exports.preferensi = async (req, res, next) => {
  try {
    res.render('dosen/preferensi', {
      ...(await getBaseData(req.user)),
      judul: `Formulir Preferensi Waktu Dosen — ${config.appName}`,
      currentRole: 'dosen',
      activeMenu: 'preferensi',
      activeView: 'view-dosen'
    });
  } catch (err) {
    next(err);
  }
};

exports.notifikasi = async (req, res, next) => {
  try {
    res.render('dosen/notifikasi', {
      ...(await getBaseData(req.user)),
      judul: `Pusat Notifikasi Dosen — ${config.appName}`,
      currentRole: 'dosen',
      activeMenu: 'notifikasi',
      activeView: 'view-dosen'
    });
  } catch (err) {
    next(err);
  }
};
