const { getBaseData, config } = require('./baseDataHelper');

/**
 * Controller untuk Halaman Publik & Autentikasi
 */
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

exports.info = (req, res) => {
  res.render('info', {
    ...getBaseData(),
    judul: `Panduan & Info Akademik — ${config.appName}`,
    currentRole: 'guest'
  });
};
