const { getBaseData, config } = require('./baseDataHelper');

/**
 * Controller untuk Halaman Publik & Autentikasi
 * Khusus untuk Guest / Publik Umum tanpa meng-override antarmuka panel civitas
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

exports.jadwal = (req, res) => {
  const data = getBaseData();
  const currentRole = req.cookies?.userRole || 'guest';
  res.render('jadwal', {
    ...data,
    judul: `Jadwal Perkuliahan Resmi S1 TI UMY — ${config.appName}`,
    currentRole,
    activeMenu: 'jadwal'
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
