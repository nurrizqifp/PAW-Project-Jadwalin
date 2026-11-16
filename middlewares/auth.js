const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'jadwalin_jwt_secret_key_2026';

/**
 * Middleware untuk memverifikasi autentikasi pengguna via JWT (Cookie atau Bearer Header)
 */
const verifyToken = (req, res, next) => {
  let token = null;

  // 1. Cek dari Authorization Header (Bearer token)
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Fallback cek dari Cookies
  if (!token && req.cookies && (req.cookies.jwt || req.cookies.token)) {
    token = req.cookies.jwt || req.cookies.token;
  }

  if (!token) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({
        sukses: false,
        pesan: 'Akses ditolak. Silakan login terlebih dahulu.',
      });
    }
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
    return res.redirect('/login');
  }
};

/**
 * Middleware autentikasi opsional (tidak memblokir jika tidak login)
 */
const optionalAuth = (req, res, next) => {
  let token = null;

  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token && req.cookies && (req.cookies.jwt || req.cookies.token)) {
    token = req.cookies.jwt || req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      if (res.locals) {
        res.locals.currentUser = decoded;
      }
    } catch (e) {
      // Abaikan jika token tidak valid pada optionalAuth
    }
  }

  next();
};

module.exports = {
  verifyToken,
  optionalAuth,
  JWT_SECRET,
};
