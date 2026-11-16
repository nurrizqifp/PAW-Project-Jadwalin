const { getBaseData, config } = require('./baseDataHelper');

/**
 * Controller untuk Halaman Publik & Autentikasi
 */
exports.index = (req, res) => {
  const data = getBaseData();
  const currentRole = req.cookies?.userRole || 'guest';
  res.render('index', {
    ...data,
    judul: `${config.appName} — AI Powered Smart Course Scheduling TI UMY`,
    currentRole,
    activeMenu: 'beranda',
    activeView: 'view-mahasiswa'
  });
};

exports.login = (req, res) => {
  res.render('auth/login', {
    ...getBaseData(),
    judul: `Masuk Sistem — ${config.appName}`,
    currentRole: 'guest',
    activeMenu: 'login'
  });
};

exports.forgotPassword = (req, res) => {
  res.render('auth/forgot-password', {
    ...getBaseData(),
    judul: `Lupa Kata Sandi — ${config.appName}`,
    currentRole: 'guest',
    activeMenu: 'forgotPassword'
  });
};

exports.info = (req, res) => {
  const currentRole = req.cookies?.userRole || 'guest';
  res.render('info', {
    ...getBaseData(),
    judul: `Panduan & Info Akademik — ${config.appName}`,
    currentRole,
    activeMenu: 'info'
  });
};
