/**
 * Middleware Role-Based Access Control (RBAC)
 * @param  {...string} roles Peran yang diizinkan (contoh: 'admin', 'dosen', 'mahasiswa')
 */
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(401).json({
          sukses: false,
          pesan: 'Akses ditolak. Pengguna belum terautentikasi.',
        });
      }
      return res.redirect('/login');
    }

    if (!roles.includes(req.user.role)) {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(403).json({
          sukses: false,
          pesan: `Akses ditolak. Fitur ini hanya diperuntukkan bagi peran: ${roles.join(', ')}.`,
        });
      }
      
      return res.status(403).render('errors/403', {
        judul: '403 — Akses Dibatasi · Jadwalin',
        roleDibutuhkan: roles,
        roleUser: req.user.role,
        user: req.user,
        appName: process.env.APP_NAME || 'Jadwalin',
        appVersion: process.env.APP_VERSION || 'v.21'
      });
    }

    next();
  };
};

module.exports = {
  authorizeRole,
};
