const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = config.jwtSecret || process.env.JWT_SECRET || 'jadwalin_default_secret_key_ti_umy_2026';

function extractToken(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  if (req.cookies && (req.cookies.jwt || req.cookies.token)) {
    return req.cookies.jwt || req.cookies.token;
  }
  return null;
}

function clearAuthCookies(res) {
  res.clearCookie('jwt');
  res.clearCookie('token');
  res.clearCookie('userRole');
}

function handleDevRoleMock(req, res) {
  const targetRole = req.query.asRole || req.query.role;
  if (!targetRole) return null;

  const validRoles = ['admin', 'dosen', 'mahasiswa'];
  if (!validRoles.includes(targetRole)) return null;

  const mockUsers = {
    admin: { id: 1, username: 'admin', nama: 'Administrator Jadwalin', role: 'admin' },
    dosen: { id: 2, username: 'dosen', nama: 'Dr. Dosen Contoh, M.Kom.', role: 'dosen', refId: 1 },
    mahasiswa: { id: 3, username: '20230140001', nama: 'Haidar Mahasiswa', role: 'mahasiswa', refId: 1 }
  };

  const payload = mockUsers[targetRole] || { id: 99, username: targetRole, nama: targetRole, role: targetRole };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return payload;
}

/**
 * Middleware untuk memverifikasi autentikasi pengguna via JWT (Cookie atau Bearer Header)
 */
const verifyToken = (req, res, next) => {
  // Support quick switch di dev mode via ?asRole=...
  if (config.nodeEnv !== 'production' && (req.query.asRole || req.query.role)) {
    const mocked = handleDevRoleMock(req, res);
    if (mocked) {
      req.user = mocked;
      if (res.locals) res.locals.currentUser = mocked;
      return next();
    }
  }

  const token = extractToken(req);

  if (!token) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({
        sukses: false,
        pesan: 'Akses ditolak. Silakan login terlebih dahulu.',
      });
    }
    clearAuthCookies(res);
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    if (res.locals) {
      res.locals.currentUser = decoded;
    }
    next();
  } catch (error) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({
        sukses: false,
        pesan: 'Sesi login tidak valid atau telah kadaluarsa.',
      });
    }
    clearAuthCookies(res);
    return res.redirect('/login');
  }
};

/**
 * Middleware autentikasi opsional (tidak memblokir jika tidak login)
 */
const optionalAuth = (req, res, next) => {
  // Support quick switch di dev mode via ?asRole=...
  if (config.nodeEnv !== 'production' && (req.query.asRole || req.query.role)) {
    const mocked = handleDevRoleMock(req, res);
    if (mocked) {
      req.user = mocked;
      if (res.locals) res.locals.currentUser = mocked;
      return next();
    }
  }

  const token = extractToken(req);

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      if (res.locals) {
        res.locals.currentUser = decoded;
      }
    } catch (e) {
      // Bersihkan cookie busuk jika tidak valid
      clearAuthCookies(res);
    }
  }

  next();
};

module.exports = {
  verifyToken,
  optionalAuth,
  JWT_SECRET,
};
