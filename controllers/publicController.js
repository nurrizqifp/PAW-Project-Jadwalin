const { getBaseData, config } = require('./baseDataHelper');

/**
 * Controller untuk Halaman Publik & Autentikasi
 * Khusus untuk Guest / Publik Umum tanpa meng-override antarmuka panel civitas
 * ISO/IEC 27018 Data Minimization: tidak mengekspos PII mahasiswa ke sesi publik/guest.
 */
exports.index = async (req, res, next) => {
  try {
    const data = await getBaseData(req.user);
    const currentRole = req.user?.role || req.cookies?.userRole || 'guest';
    res.render('index', {
      ...data,
      mahasiswaList: req.user ? data.mahasiswaList : [],
      judul: `${config.appName} — AI Powered Smart Course Scheduling TI UMY`,
      currentRole,
      activeMenu: 'beranda',
      activeView: 'view-mahasiswa'
    });
  } catch (err) {
    next(err);
  }
};

exports.jadwal = async (req, res, next) => {
  try {
    const data = await getBaseData(req.user);
    const currentRole = req.user?.role || req.cookies?.userRole || 'guest';
    res.render('jadwal', {
      ...data,
      mahasiswaList: req.user ? data.mahasiswaList : [],
      judul: `Jadwal Perkuliahan Resmi S1 TI UMY — ${config.appName}`,
      currentRole,
      activeMenu: 'jadwal'
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    // Hanya redirect ke dashboard jika benar-benar sudah terautentikasi (JWT valid)
    if (req.user?.role) {
      if (req.user.role === 'admin') return res.redirect('/admin/dashboard');
      if (req.user.role === 'dosen') return res.redirect('/dosen/dashboard');
      if (req.user.role === 'mahasiswa') return res.redirect('/mahasiswa/dashboard');
    }

    // Bersihkan cookie role lawas jika tidak ada sesi otentikasi aktif
    if (req.cookies?.userRole) {
      res.clearCookie('userRole');
    }

    res.render('auth/login', {
      appName: config.appName,
      appVersion: config.appVersion,
      judul: `Masuk Sistem — ${config.appName}`,
      currentRole: 'guest',
      activeMenu: 'login'
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    res.render('auth/forgot-password', {
      appName: config.appName,
      appVersion: config.appVersion,
      judul: `Lupa Kata Sandi — ${config.appName}`,
      currentRole: 'guest',
      activeMenu: 'forgotPassword'
    });
  } catch (err) {
    next(err);
  }
};

exports.info = async (req, res, next) => {
  try {
    const data = await getBaseData(req.user);
    const currentRole = req.user?.role || req.cookies?.userRole || 'guest';
    res.render('info', {
      ...data,
      mahasiswaList: req.user ? data.mahasiswaList : [],
      judul: `Panduan & Info Akademik — ${config.appName}`,
      currentRole,
      activeMenu: 'info'
    });
  } catch (err) {
    next(err);
  }
};
